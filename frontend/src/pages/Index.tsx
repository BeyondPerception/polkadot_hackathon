
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedEvents from "@/components/FeaturedEvents";
import { categories } from "@/data/eventsData";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedEvents />
        
        <section className="py-12 md:py-16 bg-muted">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Browse Events by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.filter(cat => cat !== "All").map((category) => (
                <a 
                  key={category}
                  href={`/events?category=${category}`}
                  className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-lg">{category}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Host Your Next Event with TicketHub</h2>
                <p className="text-muted-foreground mb-6">
                  Create, promote, and sell tickets for your events with our easy-to-use platform. 
                  Reach a wider audience and provide a seamless experience for your attendees.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-ticket-purple/10 p-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ticket-purple"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Easy Event Creation</h4>
                      <p className="text-sm text-muted-foreground">Create events in minutes with our intuitive interface</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-ticket-purple/10 p-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ticket-purple"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Simple Ticket Management</h4>
                      <p className="text-sm text-muted-foreground">Manage sales, attendees, and ticket types from one dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-ticket-purple/10 p-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ticket-purple"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Powerful Marketing Tools</h4>
                      <p className="text-sm text-muted-foreground">Promote your event to our community of event-goers</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=1600&auto=format&fit=crop"
                  alt="Event hosting"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                  <div className="text-ticket-purple font-bold text-xl">+200K</div>
                  <div className="text-sm text-ticket-gray">Events hosted yearly</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
