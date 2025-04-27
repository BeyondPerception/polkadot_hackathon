import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/data/eventsData";

import detectEthereumProvider from "@metamask/detect-provider";
import { ethers, BigNumber } from "ethers";
import abi from "@/data/abi.json";

/* ---------- chain / contract constants ---------- */
const CONTRACT_ADDRESS = "0x9953c57133F51034eC9607e8F4A1635eB36382F2";
const MOONBASE_PARAMS = {
  chainId: "0x507",
  chainName: "Moonbase Alpha",
  rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
  blockExplorerUrls: ["https://moonbase.moonscan.io"],
  nativeCurrency: { name: "DEV", symbol: "DEV", decimals: 18 },
};

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    /* names align with `createEvent` */
    name: "",
    description: "",
    imageURI: "",
    date: "",
    time: "",
    priceDev: "",
    capacity: "",
    location: "",
    category: "",
    organizer: "",
  });

  /* ---------- helpers ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- main submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Detect MetaMask */
    const detected = (await detectEthereumProvider()) as any;
    if (!detected) {
      toast({ title: "MetaMask not found", description: "Please install MetaMask", variant: "destructive" });
      return;
    }

    try {
      /* Request account access */
      await detected.request({ method: "eth_requestAccounts" });

      /* Ensure we’re on Moonbase Alpha */
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
        } else {
          throw err;
        }
      }

      /* 4️⃣ Prepare arguments */
      const provider = new ethers.providers.Web3Provider(detected);
      const signer = provider.getSigner();

      const unixSeconds = Math.floor(
        new Date(`${formData.date}T${formData.time}:00`).getTime() / 1_000
      );
      const priceWei = ethers.utils.parseUnits(formData.priceDev || "0", 18);
      const capacityBn = BigNumber.from(formData.capacity || "0");

      /* 5️⃣ Send tx */
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const tx = await contract.createEvent(
        formData.name,
        formData.description,
        formData.imageURI,
        unixSeconds,
        priceWei,
        capacityBn
      );

      toast({ title: "Transaction sent", description: `Hash: ${tx.hash}` });
      await tx.wait();

      toast({
        title: "Event Created!",
        description: "Your event is now on-chain.",
      });
      setTimeout(() => navigate("/events"), 1500);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message ?? "Transaction failed",
        variant: "destructive",
      });
    }
  };

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create an Event</h1>
          <p className="text-muted-foreground mb-8">
            Fill out the form below to create and publish your event on TicketHub.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Event Title</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter event title"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Event Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priceDev">Ticket Price (DEV)</Label>
                  <Input
                    id="priceDev"
                    name="priceDev"
                    type="number"
                    min="0"
                    step="0.000000000000000001"
                    placeholder="0.0"
                    value={formData.priceDev}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    placeholder="100"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Optional extras kept for your off-chain UI */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Event location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange(value, "category")}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter((c) => c !== "All").map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="imageURI">Image URL</Label>
                <Input
                  id="imageURI"
                  name="imageURI"
                  placeholder="Enter image URL or IPFS CID"
                  value={formData.imageURI}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended size: 1200 × 600 px.
                </p>
              </div>

              <div>
                <Label htmlFor="organizer">Organizer Name</Label>
                <Input
                  id="organizer"
                  name="organizer"
                  placeholder="Enter organizer name"
                  value={formData.organizer}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="border-t pt-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/events")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-ticket-purple hover:bg-ticket-secondary"
              >
                Create Event
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateEvent;
