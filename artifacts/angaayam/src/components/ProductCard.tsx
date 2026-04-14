import { Link } from "wouter";
import { ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { getProductImage } from "@/lib/product-images";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    salePrice?: number | string | null;
    images?: string[];
    tags?: string[];
    shortDescription?: string;
    weightOptions?: { weight: string; price: number }[];
    categoryName?: string;
    stockQuantity: number;
  };
  index?: number;
}

function ProductImage({ product }: { product: ProductCardProps["product"] }) {
  const imgSrc = getProductImage(product.slug);

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={product.name}
        className="w-full h-full object-cover"
      />
    );
  }

  const categoryColors: Record<string, string> = {
    "Millet Snacks": "from-green-800 to-green-600",
    "Organic Foods": "from-amber-800 to-amber-600",
  };
  const gradient = categoryColors[product.categoryName ?? ""] ?? "from-green-900 to-green-700";

  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-4 relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10">
        <div className="w-32 h-32 rounded-full bg-white absolute -top-8 -right-8" />
        <div className="w-20 h-20 rounded-full bg-white absolute -bottom-4 -left-4" />
      </div>
      <div className="text-center z-10">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Angaayam</p>
        <p className="text-white font-serif font-bold text-xl leading-tight">{product.name}</p>
        {product.weightOptions?.[0] && (
          <p className="text-white/60 text-xs mt-2">{product.weightOptions[0].weight}</p>
        )}
      </div>
    </div>
  );
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const price = Number(product.salePrice ?? product.price);
  const originalPrice = Number(product.price);
  const hasDiscount = product.salePrice && Number(product.salePrice) < originalPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const weightOpt = product.weightOptions?.[0];
    addItem(product, 1, weightOpt);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="relative overflow-hidden aspect-square">
            <ProductImage product={product} />
            {hasDiscount && (
              <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
                Sale
              </span>
            )}
            {product.tags?.includes("kids-friendly") && (
              <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
                Kids
              </span>
            )}
          </div>
          <div className="p-4">
            {product.categoryName && (
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{product.categoryName}</p>
            )}
            <h3 className="font-serif font-semibold text-foreground text-lg leading-tight mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
            {product.shortDescription && (
              <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{product.shortDescription}</p>
            )}
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="h-3 w-3 fill-accent text-accent" />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-primary font-bold text-lg">Rs {price}</span>
                {product.weightOptions?.[0] && (
                  <span className="text-muted-foreground text-xs ml-1">/ {product.weightOptions[0].weight}</span>
                )}
                {hasDiscount && (
                  <span className="text-muted-foreground text-sm line-through ml-2">Rs {originalPrice}</span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn"
              >
                <ShoppingBag className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
            {product.stockQuantity === 0 && (
              <p className="text-destructive text-xs mt-2 font-medium">Out of stock</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
