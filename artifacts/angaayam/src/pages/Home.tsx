import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Shield, Award, Heart } from "lucide-react";
import { useGetFeaturedProducts, useGetCategories, useGetTestimonials } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Star } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const features = [
  { icon: Leaf, title: "100% Natural", desc: "No artificial flavours, colours or preservatives — just pure, wholesome goodness." },
  { icon: Shield, title: "Quality Assured", desc: "Every batch is tested for purity and safety before it reaches your table." },
  { icon: Award, title: "Award Winning", desc: "Recognised by leading nutrition experts for our commitment to health." },
  { icon: Heart, title: "Made with Love", desc: "Small-batch crafted by passionate food artisans who care about your health." },
];

export default function HomePage() {
  const { data: featuredData } = useGetFeaturedProducts();
  const { data: categoriesData } = useGetCategories();
  const { data: testimonialsData } = useGetTestimonials();

  const featured = featuredData?.products ?? [];
  const categories = categoriesData?.categories ?? [];
  const testimonials = testimonialsData?.testimonials ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] bg-primary overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full bg-accent" style={{ transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-white" style={{ transform: "translate(-30%, 30%)" }} />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
              <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent border border-accent/30 rounded-full text-sm font-semibold tracking-wide mb-6">
                Pure. Wholesome. Extraordinary.
              </span>
            </motion.div>
            <motion.h1 {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              Nourish Your <br />
              <span className="text-accent">Body & Soul</span>
            </motion.h1>
            <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Premium millet-based snacks and natural organic foods crafted for wellness. Healthy choices that your whole family will love.
            </motion.p>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-4">
              <Link href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-bold rounded-2xl hover:bg-accent/90 transition-all hover:scale-105 shadow-lg text-lg">
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground/10 text-primary-foreground font-semibold rounded-2xl border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all text-lg">
                Our Story
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Shop by Category</h2>
              <p className="text-muted-foreground text-lg">Explore our carefully curated range of natural foods</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((cat, i) => (
                <motion.div key={cat.id} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link href={`/products?category=${cat.slug}`}>
                    <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary/70 p-10 min-h-[220px] flex flex-col justify-end cursor-pointer hover:shadow-xl transition-all duration-300">
                      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-accent" style={{ transform: "translate(30%, -30%)" }} />
                      </div>
                      <div className="relative z-10">
                        <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-2 block">{cat.productCount} Products</span>
                        <h3 className="font-serif text-3xl font-bold text-white mb-2">{cat.name}</h3>
                        {cat.description && <p className="text-white/60 text-sm">{cat.description}</p>}
                        <div className="mt-4 flex items-center gap-2 text-accent font-semibold">
                          Shop Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Featured Products</h2>
              <p className="text-muted-foreground text-lg">Our most loved products, handpicked for you</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.slice(0, 8).map((product, i) => (
                <ProductCard key={product.id} product={{ ...product, price: Number(product.price), salePrice: product.salePrice ? Number(product.salePrice) : null }} index={i} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-all">
                View All Products <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
              <p className="text-muted-foreground text-lg">Real stories from real families</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`h-4 w-4 ${s <= t.rating ? "fill-accent text-accent" : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">"{t.review}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-serif">
                      {t.customerName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{t.customerName}</p>
                      {t.location && <p className="text-muted-foreground text-xs">{t.location}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Banner */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-4xl font-bold text-primary-foreground mb-4">Join the Angaayam Community</h2>
            <p className="text-primary-foreground/70 text-lg mb-8">Get exclusive recipes, wellness tips, and early access to new products</p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-bold rounded-2xl hover:bg-accent/90 transition-all text-lg">
              Get in Touch <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
