
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  organizer: string;
  featured: boolean;
  category: string;
  availableTickets: number;
}

export const events: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2025",
    description: "Join us for the biggest tech conference of the year! Learn from industry experts, network with professionals, and discover the latest technological advancements. This three-day event features workshops, panel discussions, and hands-on demonstrations covering AI, blockchain, cloud computing, and more.",
    date: "June 15, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "San Francisco Convention Center",
    price: 299,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop",
    organizer: "TechEvents Inc.",
    featured: true,
    category: "Technology",
    availableTickets: 500
  },
  {
    id: "2",
    title: "Summer Music Festival",
    description: "Experience the ultimate summer music festival featuring top artists from around the world. Set against a beautiful backdrop, this festival combines amazing music, art installations, and delicious food for an unforgettable weekend experience.",
    date: "July 24-26, 2025",
    time: "12:00 PM - 11:00 PM",
    location: "Golden Gate Park",
    price: 149,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2000&auto=format&fit=crop",
    organizer: "Festival Productions",
    featured: true,
    category: "Music",
    availableTickets: 2000
  },
  {
    id: "3",
    title: "Culinary Masterclass",
    description: "Learn cooking techniques from renowned chef Maria Sanchez in this exclusive masterclass. Perfect your culinary skills and discover new recipes that will impress your family and friends.",
    date: "May 10, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Downtown Culinary School",
    price: 89,
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2000&auto=format&fit=crop",
    organizer: "Gourmet Experiences",
    featured: false,
    category: "Food & Drink",
    availableTickets: 30
  },
  {
    id: "4",
    title: "Business Leadership Summit",
    description: "Connect with business leaders and entrepreneurs at this inspirational summit. Gain insights into successful business strategies, leadership principles, and innovation techniques that can transform your career or company.",
    date: "August 5, 2025",
    time: "8:00 AM - 4:00 PM",
    location: "Metropolitan Business Center",
    price: 199,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop",
    organizer: "Business Growth Network",
    featured: true,
    category: "Business",
    availableTickets: 150
  },
  {
    id: "5",
    title: "Yoga and Wellness Retreat",
    description: "Rejuvenate your mind and body at our exclusive yoga and wellness retreat. Expert instructors will guide you through various yoga styles, meditation sessions, and wellness workshops in a tranquil natural setting.",
    date: "September 15-17, 2025",
    time: "7:00 AM - 8:00 PM",
    location: "Serene Mountain Resort",
    price: 349,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2000&auto=format&fit=crop",
    organizer: "Mindful Living Co.",
    featured: false,
    category: "Health & Wellness",
    availableTickets: 50
  },
  {
    id: "6",
    title: "Photography Workshop",
    description: "Enhance your photography skills with this hands-on workshop led by award-winning photographer James Wilson. Learn composition techniques, lighting principles, and post-processing tips while exploring stunning locations.",
    date: "May 20, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Urban Arts Center",
    price: 129,
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop",
    organizer: "Creative Vision Photography",
    featured: false,
    category: "Arts",
    availableTickets: 25
  },
  {
    id: "7",
    title: "Film Festival",
    description: "Celebrate the art of filmmaking at our annual film festival. Featuring independent films from around the world, director Q&As, and networking events, this festival is a must-attend for cinema enthusiasts.",
    date: "October 10-15, 2025",
    time: "Various Times",
    location: "City Cinema Complex",
    price: 75,
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2000&auto=format&fit=crop",
    organizer: "Independent Film Association",
    featured: true,
    category: "Entertainment",
    availableTickets: 300
  },
  {
    id: "8",
    title: "Artificial Intelligence Conference",
    description: "Explore the future of AI and machine learning at this cutting-edge conference. Industry pioneers will present the latest research, applications, and ethical considerations in the rapidly evolving field of artificial intelligence.",
    date: "November 3-4, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Tech Innovation Hub",
    price: 249,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop",
    organizer: "AI Research Foundation",
    featured: false,
    category: "Technology",
    availableTickets: 200
  }
];

export const categories = [
  "All",
  "Technology",
  "Music",
  "Food & Drink",
  "Business",
  "Health & Wellness",
  "Arts",
  "Entertainment"
];

export const getFeaturedEvents = () => {
  return events.filter(event => event.featured);
};

export const getEventById = (id: string) => {
  return events.find(event => event.id === id);
};

export const getEventsByCategory = (category: string) => {
  if (category === "All") return events;
  return events.filter(event => event.category === category);
};
