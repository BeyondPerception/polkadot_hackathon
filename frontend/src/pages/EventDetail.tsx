
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getEventById } from "@/data/eventsData";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const event = getEventById(id || "");
  
  const [ticketCount, setTicketCount] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/events")}>Browse Events</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBuyTickets = () => {
    setIsDialogOpen(true);
  };

  const handleCompletePurchase = () => {
    setPurchaseComplete(true);
    setTimeout(() => {
      setIsDialogOpen(false);
      toast({
        title: "Purchase Successful!",
        description: `You've purchased ${ticketCount} ticket${ticketCount > 1 ? 's' : ''} to ${event.title}`,
      });
      setPurchaseComplete(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="relative h-80 md:h-96 bg-ticket-dark">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="container">
              <div className="text-white">
                <p className="text-sm md:text-base mb-2">{event.date} • {event.time}</p>
                <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
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
                    <p className="text-sm text-muted-foreground">Event Organizer</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h3 className="text-xl font-bold mb-4">Tickets</h3>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Price</span>
                    <span className="font-bold">${event.price}</span>
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
                      min="1"
                      max={event.availableTickets}
                      value={ticketCount}
                      onChange={(e) => setTicketCount(parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Total</span>
                      <span className="font-bold">${(event.price * ticketCount).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-ticket-purple hover:bg-ticket-secondary"
                    onClick={handleBuyTickets}
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
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{purchaseComplete ? "Purchase Complete!" : "Complete Your Purchase"}</DialogTitle>
              <DialogDescription>
                {purchaseComplete 
                  ? "Your tickets have been purchased successfully." 
                  : `You are purchasing ${ticketCount} ticket${ticketCount > 1 ? 's' : ''} to ${event.title}.`}
              </DialogDescription>
            </DialogHeader>
            
            {!purchaseComplete ? (
              <>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card">Card Information</Label>
                    <Input id="card" placeholder="1234 5678 9012 3456" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>${(event.price * ticketCount).toFixed(2)}</span>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-ticket-purple hover:bg-ticket-secondary"
                    onClick={handleCompletePurchase}
                  >
                    Complete Purchase
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Thank you for your purchase!</h3>
                <p className="text-muted-foreground mb-4">
                  A confirmation email has been sent to your email address.
                </p>
                <Button 
                  className="bg-ticket-purple hover:bg-ticket-secondary"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
