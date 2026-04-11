import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Package, CheckCircle } from "lucide-react";
import { useGetProductBySlug } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useGetProductBySlug(slug);
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedWeight, setSelectedWeight] = useState<{ weight: string; price: number } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-muted rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-6 bg-muted rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 text-center">
        <p className="text-muted-foreground text-lg mb-4">Product not found</p>
        <Link href="/products" className="text-primary underline">Back to products</Link>
      </div>
    );
  }

  const weightOptions = (product.weightOptions as { weight: string; price: number }[]) ?? [];
  const effectiveWeight = selectedWeight ?? (weightOptions[0] ?? null);
  const price = effectiveWeight?.price ?? Number(product.salePrice ?? product.price);

  const handleAddToCart = () => {
    addItem({ ...product, price: Number(product.price), salePrice: product.salePrice ? Number(product.salePrice) : null }, quantity, effectiveWeight ?? undefined);
    setAdded(true);
    toast({ title: "Added to cart!", description: `${quantity}x ${product.name} added to your cart.` });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square bg-gradient-to-br from-primary to-primary/60 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent" style={{ transform: "translate(30%, -30%)" }} />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white" style={{ transform: "translate(-30%, 30%)" }} />
              </div>
              <div className="text-center z-10 p-8">
                <p className="text-white/40 text-sm uppercase tracking-widest mb-4">Angaayam Foods</p>
                <p className="text-white font-serif font-bold text-4xl leading-tight mb-4">{product.name}</p>
                {effectiveWeight && (
                  <p className="text-white/60 text-lg">{effectiveWeight.weight}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            {product.categoryName && (
              <span className="text-sm text-muted-foreground uppercase tracking-widest mb-2">{product.categoryName}</span>
            )}
            <h1 className="font-serif text-4xl font-bold text-foreground mb-4">{product.name}</h1>

            {product.shortDescription && (
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">{product.shortDescription}</p>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-primary font-bold text-4xl">Rs {price}</span>
              {effectiveWeight && <span className="text-muted-foreground">/ {effectiveWeight.weight}</span>}
            </div>

            {/* Weight Options */}
            {weightOptions.length > 1 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-3">Weight</p>
                <div className="flex gap-3 flex-wrap">
                  {weightOptions.map(opt => (
                    <button
                      key={opt.weight}
                      onClick={() => setSelectedWeight(opt)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${effectiveWeight?.weight === opt.weight ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                    >
                      {opt.weight} — Rs {opt.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {(product.tags as string[]).map(tag => (
                  <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                    {tag.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-3 text-foreground hover:bg-secondary transition-colors font-bold">−</button>
                <span className="px-4 py-3 font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-3 text-foreground hover:bg-secondary transition-colors font-bold">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-lg transition-all ${added ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"} disabled:opacity-50`}
              >
                {added ? <><CheckCircle className="h-5 w-5" /> Added!</> : <><ShoppingBag className="h-5 w-5" /> Add to Cart</>}
              </button>
            </div>

            {product.stockQuantity === 0 && <p className="text-destructive text-sm font-medium mb-4">Currently out of stock</p>}

            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
              <Package className="h-4 w-4" />
              <span>{product.stockQuantity > 0 ? `In stock (${product.stockQuantity} available)` : "Out of stock"}</span>
            </div>

            {/* Ingredients */}
            {product.ingredients && (
              <div className="bg-secondary/40 rounded-2xl p-5 mb-4">
                <h3 className="font-semibold text-foreground mb-2">Ingredients</h3>
                <p className="text-muted-foreground text-sm">{product.ingredients}</p>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="border-t border-border pt-6">
                <h3 className="font-serif font-semibold text-lg mb-3">About this product</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
