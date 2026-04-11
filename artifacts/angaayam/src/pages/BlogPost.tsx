import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, User, ArrowLeft, Calendar } from "lucide-react";
import { useGetBlogPostBySlug } from "@workspace/api-client-react";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useGetBlogPostBySlug(slug);

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" /></div>;
  if (!post) return <div className="text-center py-20"><p className="text-muted-foreground">Post not found</p><Link href="/blog" className="text-primary underline mt-4 block">Back to Blog</Link></div>;

  const formatDate = (dateStr?: string | null) => dateStr ? new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gradient-to-br from-primary to-primary/60 rounded-3xl h-72 flex items-center justify-center mb-8 p-8">
            <p className="text-white font-serif font-bold text-4xl text-center leading-snug">{post.title}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold capitalize">{post.category.replace(/-/g, " ")}</span>
            <div className="flex items-center gap-1 text-muted-foreground text-sm"><Clock className="h-4 w-4" /> {post.readTimeMinutes} min read</div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm"><User className="h-4 w-4" /> {post.authorName}</div>
            {post.publishedAt && <div className="flex items-center gap-1 text-muted-foreground text-sm"><Calendar className="h-4 w-4" /> {formatDate(post.publishedAt)}</div>}
          </div>

          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-muted-foreground text-xl leading-relaxed mb-8 italic border-l-4 border-primary pl-4">{post.excerpt}</p>}

          <div className="prose max-w-none text-foreground/80 leading-relaxed [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:text-foreground [&>h2]:mt-8 [&>h2]:mb-4 [&>p]:mb-4">
            {post.content}
          </div>

          {post.tags && (post.tags as string[]).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
              {(post.tags as string[]).map(tag => (
                <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
