/* src/pages/Events.tsx */
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";

import { events as localEvents, categories as localCategories } from "@/data/eventsData";
import abi from "@/data/abi.json";

/* ---------- contract + RPC constants ---------- */
const RPC_URL = "https://rpc.api.moonbase.moonbeam.network";
const CONTRACT_ADDRESS = "0x9953c57133F51034eC9607e8F4A1635eB36382F2";

/* ---------- helper to turn contract struct → UI object ---------- */
const mapChainEvent = (id: number, ev: any) => ({
  id: `onchain-${id}`,
  name: ev.name,
  description: ev.description,
  image: ev.imageURI,
  date: new Date(Number(ev.date) * 1000).toISOString(),
  location: "Harvard Square",
  price: ethers.utils.formatUnits(ev.priceWei, 18) + " DEV",
  category: "Technology",
  capacity: ev.capacity.toString(),
  sold: ev.sold.toString(),
  organiser: ev.organiser,
  onChain: true,
});

const Events = () => {
  /* ---------- routing / category state ---------- */
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  /* ---------- on-chain events state ---------- */
  const [chainEvents, setChainEvents] = useState<any[]>([]);
  const [loadingChain, setLoadingChain] = useState<boolean>(true);

  /* ---------- fetch on-chain once ---------- */
  useEffect(() => {
    const fetchChainEvents = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

        const nextIdBn: ethers.BigNumber = await contract.nextEventId();
        const nextId = nextIdBn.toNumber();

        const fetched: any[] = [];
        for (let id = 1; id < nextId; id++) {
          try {
            const info = await contract.eventInfo(id);
            if (!info.cancelled) fetched.push(mapChainEvent(id, info));
          } catch {
            /* id never existed or was hard-deleted (event DNE) – just skip it */
          }
        }
        setChainEvents(fetched);
      } catch (err) {
        console.error("Failed to fetch on-chain events", err);
      } finally {
        setLoadingChain(false);
      }
    };

    fetchChainEvents();
  }, []);

  /* ---------- merged + filtered list ---------- */
  const filteredEvents = useMemo(() => {
    const merged = [...localEvents, ...chainEvents];
    if (selectedCategory === "All") return merged;
    return merged.filter((ev) => ev.category === selectedCategory);
  }, [selectedCategory, chainEvents]);

  /* ---------- category list (add “On-Chain” if absent) ---------- */
  const categories = useMemo(() => {
    const base = new Set(localCategories);
    base.add("On-Chain");
    return Array.from(base);
  }, []);

  /* ---------- render ---------- */
  const handleCategorySelect = (cat: string) => setSelectedCategory(cat);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="bg-ticket-purple/5 py-12">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Events</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find events that match your interests and passions
            </p>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />

            {/* grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* empty-state */}
            {filteredEvents.length === 0 && !loadingChain && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  Try selecting a different category or check back later.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
