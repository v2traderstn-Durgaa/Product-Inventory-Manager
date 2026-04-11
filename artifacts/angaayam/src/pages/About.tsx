import { motion } from "framer-motion";
import { Leaf, Heart, Award, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/Angaayam_logo_1775894700558.png";

const values = [
  { icon: Leaf, title: "Natural Ingredients", desc: "We source only the finest natural ingredients from trusted farms and suppliers across India." },
  { icon: Heart, title: "Health First", desc: "Every product is crafted with your wellness in mind — no compromises on nutrition or quality." },
  { icon: Award, title: "Artisan Quality", desc: "Small-batch production ensures each product meets our exacting standards of taste and nutrition." },
  { icon: Users, title: "Community Focused", desc: "We support local farmers and traditional food artisans, building a healthier food ecosystem." },
];

const milestones = [
  { year: "2020", event: "Founded with a vision to make healthy snacking accessible to Indian families." },
  { year: "2021", event: "Launched our first millet snack range, received overwhelming response from health enthusiasts." },
  { year: "2022", event: "Expanded to organic foods — honey, ghee, and spices from verified organic farms." },
  { year: "2023", event: "Built a community of 10,000+ health-conscious families across India." },
  { year: "2024", event: "Launched bulk and corporate wellness programs for offices and schools." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <img src={logoUrl} alt="Angaayam Foods" className="h-20 w-auto object-contain mx-auto mb-8 brightness-0 invert" />
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary-foreground mb-6">Our Story</h1>
            <p className="text-primary-foreground/70 text-xl max-w-2xl mx-auto leading-relaxed">
              Born from a deep passion for wholesome food and a belief that healthy eating should be a joy, not a sacrifice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="text-accent font-semibold uppercase tracking-widest text-sm">Our Mission</span>
            <h2 className="font-serif text-4xl font-bold text-foreground mt-3 mb-6">Pure. Wholesome. Extraordinary.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Angaayam Foods was founded with one simple belief: that the ancient wisdom of Indian nutrition — millets, natural sweeteners, organic spices, and traditional preparation methods — holds the key to modern wellness. We set out to bridge the gap between ancestral food knowledge and contemporary healthy living.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              Every product we make is a tribute to this philosophy. We work directly with farmers, use no artificial ingredients, and craft our foods in small batches to ensure the highest quality in every pack that reaches your home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">What We Stand For</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Our Journey</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div key={m.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 pl-12 relative">
                  <div className="absolute left-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 bg-accent rounded-full" />
                  </div>
                  <div>
                    <span className="text-accent font-bold text-lg">{m.year}</span>
                    <p className="text-muted-foreground mt-1">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-4xl font-bold text-primary-foreground mb-6">Join Our Wellness Journey</h2>
            <p className="text-primary-foreground/70 text-lg mb-8">Experience the difference of truly wholesome food</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-bold rounded-2xl hover:bg-accent/90 transition-all text-lg">
              Shop Our Products <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
