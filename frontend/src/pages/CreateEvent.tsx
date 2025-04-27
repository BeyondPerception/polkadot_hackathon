
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

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    category: "",
    image: "",
    organizer: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your backend
    console.log("Event data submitted:", formData);
    
    toast({
      title: "Event Created!",
      description: "Your event has been created successfully.",
    });
    
    // Redirect to events page
    setTimeout(() => {
      navigate("/events");
    }, 1500);
  };
  
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
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  value={formData.title}
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
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Event location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Ticket Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
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
                      {categories.filter(cat => cat !== "All").map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  placeholder="Enter image URL for your event"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide a URL to an image for your event. Recommended size: 1200x600 pixels.
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
                  required
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
