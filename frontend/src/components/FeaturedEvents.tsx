
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { getFeaturedEvents } from "@/data/eventsData";

const FeaturedEvents = () => {
  const featuredEvents = getFeaturedEvents();
  
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Events</h2>
          <Link to="/events">
            <Button variant="outline" className="border-ticket-purple text-ticket-purple hover:bg-ticket-purple hover:text-white">
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
