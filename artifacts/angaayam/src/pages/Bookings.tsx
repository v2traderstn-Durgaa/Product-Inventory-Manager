import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useCreateBooking } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Calendar, Clock, Building, Users, Gift, MessageSquare, CheckCircle } from "lucide-react";

interface BookingForm {
  type: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

const bookingTypes = [
  { value: "consultation", label: "Nutrition Consultation", icon: MessageSquare, desc: "1-on-1 consultation with our nutrition experts" },
  { value: "bulk_order", label: "Bulk Order", icon: Users, desc: "Order in bulk for events, offices, or gifting" },
  { value: "corporate", label: "Corporate Wellness", icon: Building, desc: "Health programs and snack subscriptions for your team" },
  { value: "gift_hamper", label: "Gift Hamper", icon: Gift, desc: "Custom curated gift hampers for any occasion" },
];

export default function BookingsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");
  const { toast } = useToast();
  const createBooking = useCreateBooking();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingForm>({
    defaultValues: { type: "consultation" }
  });
  const selectedType = watch("type");

  const onSubmit = (data: BookingForm) => {
    createBooking.mutate({ data }, {
      onSuccess: (result) => {
        setBookingNumber(result.bookingNumber);
        setSubmitted(true);
        toast({ title: "Booking confirmed!", description: `Your booking ${result.bookingNumber} is confirmed.` });
      },
      onError: () => toast({ title: "Error", description: "Could not submit booking. Please try again.", variant: "destructive" }),
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-4">Your booking number is <span className="text-primary font-bold">{bookingNumber}</span></p>
          <p className="text-muted-foreground text-sm">Our team will reach out to you within 24 hours to confirm the details.</p>
          <button onClick={() => setSubmitted(false)} className="mt-8 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-all">
            Make Another Booking
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl font-bold text-primary-foreground mb-4">Book a Service</motion.h1>
          <p className="text-primary-foreground/70 text-lg">Consultations, bulk orders, corporate wellness and more</p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Booking Type */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">What are you looking for?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookingTypes.map(bt => (
                <label key={bt.value}
                  className={`flex gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedType === bt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                  <input {...register("type")} type="radio" value={bt.value} className="sr-only" />
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <bt.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{bt.label}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{bt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold mb-6">Your Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name *</label>
                <input {...register("name", { required: "Name required" })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="Your name" />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email *</label>
                <input {...register("email", { required: "Email required" })} type="email"
                  className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="your@email.com" />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone *</label>
                <input {...register("phone", { required: "Phone required" })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="9876543210" />
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
              </div>
              {(selectedType === "bulk_order" || selectedType === "corporate") && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Company Name</label>
                  <input {...register("companyName")}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="Company Ltd" />
                </div>
              )}
            </div>
          </div>

          {/* Scheduling */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold mb-6">Preferred Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Calendar className="h-4 w-4" /> Date *</label>
                <input {...register("preferredDate", { required: "Date required" })} type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" />
                {errors.preferredDate && <p className="text-destructive text-xs mt-1">{errors.preferredDate.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Clock className="h-4 w-4" /> Time *</label>
                <select {...register("preferredTime", { required: "Time required" })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm">
                  <option value="">Select a time slot</option>
                  {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.preferredTime && <p className="text-destructive text-xs mt-1">{errors.preferredTime.message}</p>}
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold mb-4">Tell us more *</h2>
            <textarea {...register("message", { required: "Please provide details" })} rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm resize-none"
              placeholder="Describe what you need, quantity, special requirements..." />
            {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
          </div>

          <button type="submit" disabled={createBooking.isPending}
            className="w-full py-5 bg-primary text-primary-foreground font-bold text-lg rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-60">
            {createBooking.isPending ? "Submitting..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
