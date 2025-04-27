
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
      />
      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Discover and Create Unforgettable Events
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Find events that match your interests or host your own event on TicketHub - your one-stop platform for amazing experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/events">
              <Button className="bg-ticket-purple hover:bg-ticket-secondary text-white w-full sm:w-auto">
                Explore Events
              </Button>
            </Link>
            <Link to="/create-event">
              <Button variant="outline" className="border-white text-black hover:bg-white hover:text-ticket-dark w-full sm:w-auto">
                Host Your Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
