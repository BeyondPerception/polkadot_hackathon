/* src/pages/EventDetail.tsx */
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers, BigNumber } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

import { getEventById } from "@/data/eventsData";
import abi from "@/data/abi.json";

/* ---------- chain / contract ---------- */
const RPC_URL = "https://rpc.api.moonbase.moonbeam.network";
const CONTRACT_ADDRESS = "0x9953c57133F51034eC9607e8F4A1635eB36382F2";
const MOONBASE_PARAMS = {
  chainId: "0x507",
  chainName: "Moonbase Alpha",
  rpcUrls: [RPC_URL],
  blockExplorerUrls: ["https://moonbase.moonscan.io"],
  nativeCurrency: { name: "DEV", symbol: "DEV", decimals: 18 },
};

/* ---------- helpers ---------- */
const formatPrice = (wei: BigNumber) =>
  `${ethers.utils.formatUnits(wei, 18)} DEV`;

export default function EventDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  /* recognise on-chain ids like “onchain-123” */
  const onChain = id.startsWith("onchain-");
  const chainId = onChain ? parseInt(id.replace("onchain-", "")) : 0;

  /* ---------- local data fallback ---------- */
  const localEvent = onChain ? null : getEventById(id);

  /* ---------- state for chain-loaded info ---------- */
  const [chainInfo, setChainInfo] = useState<any | null>(null);
  const [loadingChain, setLoadingChain] = useState(onChain);
  const [mintedURI, setMintedURI] = useState<string | null>(null);

  /* tickets UI */
  const [ticketCount, setTicketCount] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [txPending, setTxPending] = useState(false);

  /* ---------- fetch on-chain event once ---------- */
  useEffect(() => {
    if (!onChain) return;

    const load = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const info = await contract.eventInfo(chainId);
        setChainInfo(info);
      } catch (err) {
        console.error("eventInfo failed", err);
      } finally {
        setLoadingChain(false);
      }
    };
    load();
  }, [onChain, chainId]);

  /* ---------- merged + derived fields ---------- */
  const event = useMemo(() => {
    if (onChain && chainInfo) {
      return {
        id,
        title: chainInfo.name,
        description: chainInfo.description,
        image: chainInfo.imageURI,
        date: new Date(Number(chainInfo.date) * 1000).toLocaleDateString(),
        time: new Date(Number(chainInfo.date) * 1000).toLocaleTimeString(),
        priceWei: chainInfo.priceWei as BigNumber,
        price: formatPrice(chainInfo.priceWei),
        availableTickets: chainInfo.capacity.sub(chainInfo.sold).toNumber(),
        location: "Harvard Square",
        organizer: chainInfo.organiser.slice(0, 10) + "…",
      };
    }
    return localEvent;
  }, [onChain, chainInfo, localEvent, id]);

  /* ---------- early 404 ---------- */
  if (!event && !loadingChain) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The event you&rsquo;re looking for doesn&rsquo;t exist.
          </p>
          <Button onClick={() => navigate("/events")}>Browse Events</Button>
        </main>
        <Footer />
      </div>
    );
  }

  /* ---------- buy tickets (on-chain only) ---------- */
  const buyTickets = async () => {
    if (!onChain || !chainInfo) return;
    try {
      setTxPending(true);

      /* 1. Detect MetaMask + switch net */
      const detected: any = await detectEthereumProvider();
      if (!detected) throw new Error("MetaMask not detected");
      await detected.request({ method: "eth_requestAccounts" });
      try {
        await detected.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: MOONBASE_PARAMS.chainId }],
        });
      } catch (err: any) {
        if (err.code === 4902) {
          await detected.request({
            method: "wallet_addEthereumChain",
            params: [MOONBASE_PARAMS],
          });
        } else throw err;
      }

      /* 2. Send tx */
      const provider = new ethers.providers.Web3Provider(detected);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const totalWei = chainInfo.priceWei.mul(ticketCount);
      const tx = await contract.buyTickets(chainId, ticketCount, {
        value: totalWei,
      });

      toast({ title: "Transaction sent", description: tx.hash });
      const receipt = await tx.wait();

      /* 3. Parse TicketsMinted log to get firstTokenId */
      // const mintedEvt = receipt.logs
      //   .map((l) => contract.interface.parseLog(l))
      //   .find((d) => d?.name === "TicketsMinted");
      // if (mintedEvt) {
      //   const firstId = mintedEvt.args.firstTokenId.toNumber();
      //   const tokenURI = await contract.tokenURI(firstId);

      //   /* if tokenURI returns JSON w/ image, try to fetch it */
      //   let img = tokenURI;
      //   try {
      //     const meta = await fetch(tokenURI).then((r) => r.json());
      //     if (meta.image) img = meta.image;
      //   } catch {/* ignore */ }
      //   setMintedURI(img);
      // }

      toast({ title: "Purchase complete!", description: "Tickets minted 🎫" });
      setDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Purchase failed",
        description: err.message ?? "Transaction reverted",
        variant: "destructive",
      });
    } finally {
      setTxPending(false);
    }
  };

  /* ---------- render skeleton while loading chain ---------- */
  if (loadingChain || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading event…</p>
        </main>
        <Footer />
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* hero */}
        <div className="relative h-80 md:h-96 bg-ticket-dark">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="container text-white">
              <p className="text-sm md:text-base mb-2">
                {event.date} • {event.time}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="container py-8 flex flex-col md:flex-row gap-8">
          {/* left */}
          <div className="md:w-2/3">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About this event</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {event.description}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">{event.location}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Organizer</h2>
              <div className="flex items-center gap-4">
                <div className="bg-ticket-purple/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-ticket-purple font-bold">
                    {event.organizer.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{event.organizer}</p>
                  <p className="text-sm text-muted-foreground">
                    Event Organizer
                  </p>
                </div>
              </div>
            </section>

            {/* minted NFT preview */}
            {mintedURI && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Your Ticket NFT</h2>
                <img
                  src={mintedURI}
                  alt="Minted ticket"
                  className="max-w-xs rounded-lg shadow-lg"
                />
              </section>
            )}
          </div>

          {/* right: ticket box */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-xl font-bold mb-4">Tickets</h3>

              <div className="mb-6 space-y-1">
                <div className="flex justify-between">
                  <span>Price</span>
                  <span className="font-bold">{event.price}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Available</span>
                  <span>{event.availableTickets} tickets</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="ticketCount">Number of tickets</Label>
                  <Input
                    id="ticketCount"
                    type="number"
                    min={1}
                    max={event.availableTickets}
                    value={ticketCount}
                    onChange={(e) =>
                      setTicketCount(parseInt(e.target.value) || 1)
                    }
                    className="mt-1"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Total</span>
                    <span className="font-bold">
                      {onChain
                        ? formatPrice(
                          (event.priceWei as BigNumber).mul(ticketCount)
                        )
                        : `$${(event.price * ticketCount).toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-ticket-purple hover:bg-ticket-secondary"
                  onClick={() =>
                    onChain ? setDialogOpen(true) : alert("Demo only 🙂")
                  }
                  disabled={event.availableTickets === 0}
                >
                  Buy Tickets
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Secure checkout powered by TicketHub
              </p>
            </div>
          </div>
        </div>

        {/* purchase dialog (MetaMask flow for on-chain) */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {txPending ? "Awaiting confirmation…" : "Confirm purchase"}
              </DialogTitle>
              <DialogDescription>
                You are purchasing {ticketCount} ticket
                {ticketCount > 1 && "s"} for{" "}
                <strong>{formatPrice(event.priceWei.mul(ticketCount))}</strong>.
                MetaMask will pop up to confirm.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={txPending}
              >
                Cancel
              </Button>
              <Button
                className="bg-ticket-purple hover:bg-ticket-secondary"
                disabled={txPending}
                onClick={buyTickets}
              >
                {txPending ? "Processing…" : "Buy with MetaMask"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
