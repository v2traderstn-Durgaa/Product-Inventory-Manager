import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, ArrowLeft, Video, CheckCircle } from "lucide-react";
import { useGetEventBySlug, useRegisterForEvent } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface RegForm { name: string; email: string; phone: string; attendees: number; }

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading } = useGetEventBySlug(slug);
  const { toast } = useToast();
  const registerMutation = useRegisterForEvent();
  const [registered, setRegistered] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<RegForm>({ defaultValues: { attendees: 1 } });

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" /></div>;
  if (!event) return <div className="text-center py-20"><p className="text-muted-foreground">Event not found</p><Link href="/events" className="text-primary underline mt-4 block">Back to Events</Link></div>;

  const onSubmit = (data: RegForm) => {
    registerMutation.mutate({ id: event.id, data }, {
      onSuccess: () => { setRegistered(true); toast({ title: "Registered!", description: "You are registered for this event." }); },
      onError: () => toast({ title: "Error", description: "Registration failed.", variant: "destructive" }),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Link href="/events" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-primary to-primary/60 rounded-3xl h-64 mb-8 flex items-center justify-center">
              <p className="text-white font-serif font-bold text-4xl text-center px-8">{event.title}</p>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-accent font-semibold uppercase tracking-widest text-sm">{event.eventType}</span>
              <h1 className="font-serif text-4xl font-bold text-foreground mt-2 mb-4">{event.title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">{event.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/40 rounded-2xl p-4 flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary shrink-0" />
                  <div><p className="text-xs text-muted-foreground">Date</p><p className="font-semibold text-sm">{formatDate(event.eventDate)}</p></div>
                </div>
                <div className="bg-secondary/40 rounded-2xl p-4 flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary shrink-0" />
                  <div><p className="text-xs text-muted-foreground">Time</p><p className="font-semibold text-sm">{formatTime(event.eventDate)}</p></div>
                </div>
                <div className="bg-secondary/40 rounded-2xl p-4 flex items-center gap-3">
                  {event.isOnline ? <Video className="h-6 w-6 text-primary shrink-0" /> : <MapPin className="h-6 w-6 text-primary shrink-0" />}
                  <div><p className="text-xs text-muted-foreground">Location</p><p className="font-semibold text-sm">{event.isOnline ? "Online" : event.location}</p></div>
                </div>
                {event.registrationCount !== undefined && (
                  <div className="bg-secondary/40 rounded-2xl p-4 flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary shrink-0" />
                    <div><p className="text-xs text-muted-foreground">Registered</p><p className="font-semibold text-sm">{event.registrationCount} attendees</p></div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          <div className="lg:col-span-1">
            {registered ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold mb-2">You're Registered!</h3>
                <p className="text-muted-foreground text-sm">We'll send event details to your email.</p>
              </motion.div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-28">
                <div className="mb-6">
                  <p className="text-muted-foreground text-sm mb-1">Registration Fee</p>
                  <p className={`font-bold text-3xl ${Number(event.price) === 0 ? "text-green-600" : "text-primary"}`}>
                    {Number(event.price) === 0 ? "Free" : `Rs ${event.price}`}
                  </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Full Name *</label>
                    <input {...register("name", { required: "Required" })} className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="Your name" />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email *</label>
                    <input {...register("email", { required: "Required" })} type="email" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="your@email.com" />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone *</label>
                    <input {...register("phone", { required: "Required" })} className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="9876543210" />
                    {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <button type="submit" disabled={registerMutation.isPending}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-60">
                    {registerMutation.isPending ? "Registering..." : "Register Now"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
