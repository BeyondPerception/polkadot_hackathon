
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";
import { events, getEventsByCategory } from "@/data/eventsData";

const Events = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category") || "All";
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [filteredEvents, setFilteredEvents] = useState(events);

  useEffect(() => {
    setFilteredEvents(getEventsByCategory(selectedCategory));
  }, [selectedCategory]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

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
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            {filteredEvents.length === 0 && (
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
