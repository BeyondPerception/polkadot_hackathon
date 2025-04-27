# TicketHub — A Decentralized Ticketing Platform on Polkadot & Moonbeam

Ronak's project for the EasyA x Polkadot hackathon

## Project Overview

| Legacy ticket-ing pain-points | How TicketHub fixes them |
| ----------------------------- | ------------------------ |
| **High platform fees** (10-25 %) | < 2 % gas fees — no middle-man margin |
| **Centralized custody** → cancellations, censorship, single point of failure | Tickets live **on-chain**; organizers control revenue, users control tickets |
| **Counterfeit tickets&nbsp;& opaque resale** | Each ticket is an **ERC-721**; provenance, caps, and resale rules enforced by code |
| **Fiat-only or geo-locked checkout** | Wallet checkout in DEV/GLMR now — cross-chain assets via Polkadot **XCM** next |

Users connect MetaMask, browse events, and purchase.  
The smart-contract mints an NFT ticket directly to their wallet; that NFT is the “QR code” scanned at the venue.  
Organizers withdraw proceeds trust-lessly, and cancelled events auto-refund buyers.

---

## Technical Architecture

| Layer | Stack / SDKs | Role |
| ----- | ------------ | ---- |
| **Smart-contract** | Solidity 0.8, OpenZeppelin ERC-721 Enumerable, deployed on **Moonbeam** / Moonbase Alpha | `EventBriteNFT.sol` stores events (`createEvent`) and mints tickets (`buyTickets`) with on-chain capacity, price & withdrawal logic |
| **Polkadot relay-chain** | **Shared security**, **XCM** | Moonbeam inherits security from Polkadot validators and can send tickets or funds to other parachains without bridges |
| **Frontend** | React + Vite + TypeScript, TailwindCSS, ShadCN/UI, **ethers.js v5**, **@metamask/detect-provider** | Connect MetaMask, switch to chain 0x507, call `createEvent`, `buyTickets`, `eventInfo`, listen for `TicketsMinted` logs |
| **Data layer** | Moonbeam JSON-RPC, (future) Polkadot.js API for XCM | Reads `EventCreated` logs → shows on-chain events; zero central DB |
| **DevOps** | Hardhat, **Moonbeam Hardhat SDK**, TypeChain | Compile, test, type-gen, and deploy contracts |

> Next milestone: demonstrate moving ticket NFTs to Statemint via XCM using the Polkadot.js API.

### Polkadot Features That Enable TicketHub

* **EVM compatibility on Moonbeam** – write Solidity, use MetaMask; zero wallet friction.  
* **Shared security & scalability** – Moonbeam’s parachain slots gain Polkadot’s validator security while scaling execution independently.  
* **XCM cross-chain messaging** – tickets or funds travel trust-lessly to other parachains or the Relay Chain.  
* **Predictable, low fees** – weight-based fees on Moonbeam keep minting costs pennies, not dollars.

---

## How It Works (End-to-End)

1. **Event Creation**  
   Organizer submits React form → `createEvent(name, description, imageURI, date, priceWei, capacity)` (≈ 0.25 DEV gas).
2. **Browsing**  
   Front-end merges on-chain `EventCreated` logs with any seed data, filters by category.
3. **Purchase**  
   Buyer clicks **Buy**. MetaMask signs `buyTickets(id, qty)` with `qty × priceWei` DEV attached.
4. **Minting**  
   Contract mints `qty` ERC-721 tickets, emits `TicketsMinted(id, buyer, firstTokenId, qty)`.
5. **Display**  
   Front-end parses the log, fetches `tokenURI(firstTokenId)` JSON, shows the NFT image as the ticket.
6. **Door Scan**  
   Venue scans the NFT’s QR; verifier calls `ownerOf(tokenId)` to confirm entry.
7. **Payout / Refund**  
   Organizer calls `withdraw(id)` after the event, or buyers receive refunds automatically on cancellation.

---
