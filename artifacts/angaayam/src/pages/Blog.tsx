import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, User, Tag, ArrowRight } from "lucide-react";
import { useGetBlogPosts } from "@workspace/api-client-react";

const categories = ["All", "nutrition", "wellness", "kids-health", "millets", "recipes"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data, isLoading } = useGetBlogPosts(
    { category: selectedCategory || undefined },
    { query: { queryKey: ["blog", selectedCategory] } }
  );
  const posts = data?.posts ?? [];

  const formatDate = (dateStr?: string | null) => dateStr ? new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl font-bold text-primary-foreground mb-4">Our Blog</motion.h1>
          <p className="text-primary-foreground/70 text-lg">Nutrition insights, recipes and wellness wisdom</p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="border-b bg-background sticky top-20 z-10 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button key={cat}
                onClick={() => setSelectedCategory(cat === "All" ? "" : cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${(cat === "All" && !selectedCategory) || selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No blog posts found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={`/blog/${post.slug}`}>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group h-full flex flex-col">
                    <div className="h-48 bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center p-6">
                      <p className="text-white font-serif font-bold text-xl text-center leading-snug">{post.title}</p>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-2.5 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold capitalize">{post.category.replace(/-/g, " ")}</span>
                        <span className="flex items-center gap-1 text-muted-foreground text-xs"><Clock className="h-3 w-3" /> {post.readTimeMinutes} min read</span>
                      </div>
                      <h2 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">{post.title}</h2>
                      {post.excerpt && <p className="text-muted-foreground text-sm line-clamp-3 flex-1">{post.excerpt}</p>}
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground">{post.authorName}</span>
                        </div>
                        {post.publishedAt && <span className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</span>}
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-primary text-sm font-semibold">
                        Read More <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
