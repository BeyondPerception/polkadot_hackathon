
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Event } from "@/data/eventsData";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Link to={`/event/${event.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
          />
          <div className="absolute top-2 right-2 bg-ticket-purple text-white text-xs py-1 px-2 rounded-full">
            {event.category}
          </div>
        </div>
        <CardContent className="p-4 flex-grow">
          <div className="text-sm text-ticket-gray mb-1">{event.date} • {event.time}</div>
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{event.title}</h3>
          <p className="text-sm text-ticket-gray mb-2">{event.location}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-auto">
          <div className="text-sm text-ticket-gray">By {event.organizer}</div>
          <div className="font-semibold text-ticket-purple">${event.price}</div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
