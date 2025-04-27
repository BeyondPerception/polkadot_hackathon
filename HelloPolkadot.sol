// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*  OpenZeppelin ERC-721 + helpers  */
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title EventBriteNFT
 * @notice Minimal “Eventbrite-like” ticketing dApp with NFT tickets
 *         for EVM-compatible Polkadot parachains (Moonbeam, Moonriver, …)
 */
contract EventBriteNFT is ERC721Enumerable, Ownable, ReentrancyGuard {
    /* ───────────────────────────── Types ───────────────────────────── */

    struct Event {
        address organiser;
        string  name;
        string  description;   // NEW
        string  imageURI;      // NEW
        uint256 date;
        uint256 priceWei;
        uint256 capacity;
        uint256 sold;
        bool    cancelled;
        uint256 balanceWei;
    }

    /* ──────────────────────────── Storage ──────────────────────────── */

    uint256 public nextEventId = 1;              // monotonic id for events
    uint256 public nextTokenId = 1;              // monotonic id for NFTs

    mapping(uint256 => Event) private _events;   // eventId → Event
    mapping(uint256 => uint256) private _tokenEvent; // tokenId → eventId

    /* ──────────────────────────── Events ───────────────────────────── */

    event EventCreated(
        uint256 indexed id,
        address indexed organiser,
        string  name,
        uint256 capacity,
        uint256 priceWei
    );
    event TicketsMinted(
        uint256 indexed id,
        address indexed buyer,
        uint256 firstTokenId,
        uint256 quantity
    );
    event EventCancelled(uint256 indexed id);
    event Withdrawal(uint256 indexed id, uint256 amountWei);

    /* ───────────────────────── Constructor ─────────────────────────── */

    /// @dev We must pass the ERC-721 name & symbol here
    constructor()
    ERC721("EventBrite Ticket", "EBT")
    Ownable(msg.sender)
    {
    }

    /* ────────────────────────── Modifiers ──────────────────────────── */

    modifier eventExists(uint256 id) {
        require(_events[id].organiser != address(0), "event DNE");
        _;
    }
    modifier onlyOrganiser(uint256 id) {
        require(msg.sender == _events[id].organiser, "not organiser");
        _;
    }

    /* ─────────────────────── Public Functions ─────────────────────── */

    /// Organiser creates a new event with rich metadata
    function createEvent(
        string  calldata name_,
        string  calldata description_,
        string  calldata imageURI_,
        uint256 date_,          // 0 = TBA
        uint256 priceWei_,
        uint256 capacity_
    ) external returns (uint256 id) {
        require(capacity_ > 0, "cap=0");
        id = nextEventId++;

        _events[id] = Event({
            organiser : msg.sender,
            name      : name_,
            description: description_,
            imageURI  : imageURI_,
            date      : date_,
            priceWei  : priceWei_,
            capacity  : capacity_,
            sold      : 0,
            cancelled : false,
            balanceWei: 0
        });
        emit EventCreated(id, msg.sender, name_, capacity_, priceWei_);
    }

    /// Buy `qty` tickets → contract mints `qty` NFTs
    function buyTickets(uint256 id, uint256 qty)
        external
        payable
        nonReentrant
        eventExists(id)
    {
        Event storage e = _events[id];
        require(!e.cancelled,               "cancelled");
        require(qty > 0,                    "qty=0");
        require(e.sold + qty <= e.capacity, "sold out");
        require(msg.value == e.priceWei * qty, "wrong value");

        uint256 startToken = nextTokenId;
        for (uint256 i = 0; i < qty; i++) {
            uint256 tId = nextTokenId++;
            _tokenEvent[tId] = id;
            _safeMint(msg.sender, tId);
        }

        e.sold      += qty;
        e.balanceWei += msg.value;
        emit TicketsMinted(id, msg.sender, startToken, qty);
    }

    /// Cancel event (refunds handled off-chain if you wish)
    function cancelEvent(uint256 id)
        external
        eventExists(id)
        onlyOrganiser(id)
    {
        _events[id].cancelled = true;
        emit EventCancelled(id);
    }

    /// Organiser withdraws ticket revenue
    function withdraw(uint256 id)
        external
        nonReentrant
        eventExists(id)
        onlyOrganiser(id)
    {
        uint256 amount = _events[id].balanceWei;
        require(amount > 0, "nothing");
        _events[id].balanceWei = 0;
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "transfer fail");
        emit Withdrawal(id, amount);
    }

    /* ────────────────────── Verification Helpers ───────────────────── */

    /// Quick check: does `wallet` own at least one ticket for event `id` ?
    function ownsTicket(uint256 id, address wallet)
        external
        view
        returns (bool)
    {
        // cheaper than iterating token list – ERC-721 balance + internal mapping
        return
            _events[id].sold > 0 &&
            balanceOf(wallet) > 0 &&
            _ownsTicketIter(id, wallet);
    }

    /// Returns the event linked to an NFT ticket (tokenId)
    function tokenEvent(uint256 tokenId) external view returns (uint256) {
        return _tokenEvent[tokenId];
    }

    /* ───────────────────────── View Helpers ────────────────────────── */

    function eventInfo(uint256 id)
        external
        view
        eventExists(id)
        returns (Event memory)
    {
        return _events[id];
    }

    /* ─────────────────── Internal helper (O(n) loop) ───────────────── */

    function _ownsTicketIter(uint256 id, address wallet)
        internal
        view
        returns (bool)
    {
        uint256 bal = balanceOf(wallet);
        for (uint256 i = 0; i < bal; i++) {
            uint256 tId = tokenOfOwnerByIndex(wallet, i);
            if (_tokenEvent[tId] == id) return true;
        }
        return false;
    }

    /* ──────────────────────── Metadata URI ─────────────────────────── */

    /// Basic on-chain metadata: ipfs/https image + JSON via data URI.
    /// For production you’d normally override baseURI & host off-chain.
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_ownerOf(tokenId) != address(0), "bad id");
        uint256 id = _tokenEvent[tokenId];
        Event storage e = _events[id];

        // very small JSON – larger data should be off-chain
        string memory json = string(
            abi.encodePacked(
                '{"name":"',
                e.name,
                ' #',
                _toString(tokenId),
                '", "description":"',
                e.description,
                '", "image":"',
                e.imageURI,
                '", "attributes":[{"trait_type":"Event ID","value":',
                _toString(id),
                "}]}"
            )
        );
        return string(
            abi.encodePacked("data:application/json;base64,", _b64(bytes(json)))
        );
    }

    /* ─────────── tiny libs (string & base64) to stay self-contained ─── */

    function _toString(uint256 v) internal pure returns (string memory) {
        if (v == 0) return "0";
        uint256 j = v;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory b = new bytes(len);
        uint256 k = len;
        j = v;
        while (j != 0) {
            b[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        return string(b);
    }

    bytes internal constant _TABLE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function _b64(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";
        uint256 encodedLen = 4 * ((len + 2) / 3);
        bytes memory result = new bytes(encodedLen + 32);

        bytes memory table = _TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                out := shl(8, out)
                out := add(out, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                out := shl(8, out)
                out := add(
                    out,
                    mload(add(tablePtr, and(input, 0x3F)))
                )

                mstore(resultPtr, shl(224, out))
                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }
        return string(result);
    }
}
