
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-ticket-purple">TicketHub</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-ticket-purple transition-colors">
            Home
          </Link>
          <Link to="/events" className="text-sm font-medium hover:text-ticket-purple transition-colors">
            Events
          </Link>
          <Link to="/create-event" className="text-sm font-medium hover:text-ticket-purple transition-colors">
            Create Event
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/create-event">
            <Button className="bg-ticket-purple hover:bg-ticket-secondary">
              Host Event
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
