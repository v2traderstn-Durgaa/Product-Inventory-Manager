import { Link } from "wouter";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import logoUrl from "@assets/Angaayam_logo_1775894700558.png";
import { useState } from "react";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const subscribeMutation = useSubscribeNewsletter();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ data: { email } }, {
      onSuccess: () => {
        toast({ title: "Subscribed!", description: "Thank you for joining our newsletter." });
        setEmail("");
      },
      onError: () => {
        toast({ title: "Error", description: "Could not subscribe. Try again.", variant: "destructive" });
      },
    });
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/">
              <img src={logoUrl} alt="Angaayam Foods" className="h-16 w-auto object-contain brightness-0 invert mb-4" />
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              Pure. Wholesome. Extraordinary. Premium millet-based snacks and natural organic foods crafted for wellness.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-5 text-accent">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Shop Products", href: "/products" },
                { label: "Events & Workshops", href: "/events" },
                { label: "Our Blog", href: "/blog" },
                { label: "Book a Consultation", href: "/bookings" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-5 text-accent">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>822 080 7063</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>v2traderstn@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>Tamil Nadu, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-5 text-accent">Stay Updated</h3>
            <p className="text-primary-foreground/70 text-sm mb-4">Get recipes, wellness tips and exclusive offers delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-2.5 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-sm focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="px-4 py-2.5 bg-accent text-accent-foreground font-semibold rounded-lg text-sm hover:bg-accent/90 transition-colors disabled:opacity-60"
              >
                {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-primary-foreground/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Angaayam Foods. All rights reserved.</p>
          <p>Use code <span className="text-accent font-semibold">ANGAAYAM10</span> for 10% off your first order</p>
        </div>
      </div>
    </footer>
  );
}
