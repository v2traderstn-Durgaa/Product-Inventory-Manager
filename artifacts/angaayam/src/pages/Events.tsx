import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react";
import { useGetEvents } from "@workspace/api-client-react";

export default function EventsPage() {
  const { data, isLoading } = useGetEvents();
  const events = data?.events ?? [];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const typeColors: Record<string, string> = {
    webinar: "bg-blue-100 text-blue-700",
    workshop: "bg-green-100 text-green-700",
    popup: "bg-orange-100 text-orange-700",
    expo: "bg-purple-100 text-purple-700",
    tasting: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl font-bold text-primary-foreground mb-4">Events & Workshops</motion.h1>
          <p className="text-primary-foreground/70 text-lg">Learn, taste, and grow with our community events</p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No upcoming events. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={`/events/${event.slug}`}>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                    <div className="h-48 bg-gradient-to-br from-primary to-primary/60 relative flex items-center justify-center">
                      <p className="text-white font-serif font-bold text-3xl">{event.title}</p>
                      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${typeColors[event.eventType] ?? "bg-muted text-muted-foreground"}`}>
                        {event.eventType}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{event.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{formatDate(event.eventDate)}</span>
                          <Clock className="h-4 w-4 text-primary ml-2" />
                          <span>{formatTime(event.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{event.isOnline ? "Online" : event.location}</span>
                        </div>
                        {event.registrationCount !== undefined && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4 text-primary" />
                            <span>{event.registrationCount} registered</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`font-bold text-lg ${Number(event.price) === 0 ? "text-green-600" : "text-primary"}`}>
                          {Number(event.price) === 0 ? "Free" : `Rs ${event.price}`}
                        </span>
                        <span className="text-primary text-sm font-semibold flex items-center gap-1">
                          Register <ExternalLink className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
