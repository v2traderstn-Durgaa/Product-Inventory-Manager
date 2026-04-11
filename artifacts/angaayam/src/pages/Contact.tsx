import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ContactForm { name: string; email: string; phone?: string; subject: string; message: string; }

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const submitContact = useSubmitContact();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>();

  const onSubmit = (data: ContactForm) => {
    submitContact.mutate({ data }, {
      onSuccess: () => { setSubmitted(true); reset(); },
      onError: () => toast({ title: "Error", description: "Could not send message. Please try again.", variant: "destructive" }),
    });
  };

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "822 080 7063", href: "tel:8220807063" },
    { icon: Mail, label: "Email", value: "v2traderstn@gmail.com", href: "mailto:v2traderstn@gmail.com" },
    { icon: MapPin, label: "Location", value: "Tamil Nadu, India", href: null },
    { icon: Clock, label: "Business Hours", value: "Mon–Sat, 9AM–6PM IST", href: null },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl font-bold text-primary-foreground mb-4">Contact Us</motion.h1>
          <p className="text-primary-foreground/70 text-lg">We'd love to hear from you</p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Get in Touch</h2>
            <div className="space-y-6">
              {contactInfo.map(info => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="font-semibold text-foreground hover:text-primary transition-colors">{info.value}</a>
                    ) : (
                      <p className="font-semibold text-foreground">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <h3 className="font-serif font-semibold text-lg mb-2">Wholesale & Bulk Orders</h3>
              <p className="text-muted-foreground text-sm">For corporate orders, bulk purchases, and wholesale inquiries, please mention it in your message or visit our <a href="/bookings" className="text-primary underline">Bookings page</a>.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="font-serif text-3xl font-bold mb-4">Message Sent!</h2>
                <p className="text-muted-foreground mb-6">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-all">Send Another</button>
              </motion.div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="font-serif text-2xl font-bold mb-8">Send us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone</label>
                    <input {...register("phone")}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="9876543210 (optional)" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Subject *</label>
                    <input {...register("subject", { required: "Subject required" })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="How can we help?" />
                    {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Message *</label>
                    <textarea {...register("message", { required: "Message required" })} rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm resize-none"
                      placeholder="Your message..." />
                    {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={submitContact.isPending}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-60 text-lg">
                    {submitContact.isPending ? "Sending..." : "Send Message"}
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
