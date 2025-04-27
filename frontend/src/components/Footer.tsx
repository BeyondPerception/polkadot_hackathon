
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-ticket-purple">TicketHub</h1>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Your one-stop platform for discovering and hosting amazing events.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-ticket-purple transition-colors">
                  All Events
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-ticket-purple transition-colors">
                  Featured Events
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-sm text-muted-foreground hover:text-ticket-purple transition-colors">
                  Create Event
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-ticket-purple transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-ticket-purple transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-ticket-purple transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-ticket-purple transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-ticket-purple transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-ticket-purple transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 TicketHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
