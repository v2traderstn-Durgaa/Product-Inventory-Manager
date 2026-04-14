import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Tag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { useValidatePromo } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { getProductImage } from "@/lib/product-images";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState("");
  const { toast } = useToast();
  const validatePromo = useValidatePromo();

  const shipping = subtotal > 499 ? 0 : 60;
  const total = subtotal - discount + shipping;

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    validatePromo.mutate({ data: { code: promoCode, orderValue: subtotal } }, {
      onSuccess: (data) => {
        if (data.valid) {
          setDiscount(data.discountAmount ?? 0);
          setPromoApplied(promoCode.toUpperCase());
          toast({ title: "Promo applied!", description: data.message ?? "Discount applied." });
        } else {
          toast({ title: "Invalid promo", description: data.message ?? "Promo code is not valid.", variant: "destructive" });
        }
      },
      onError: () => toast({ title: "Error", description: "Could not validate promo code.", variant: "destructive" }),
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Explore our wholesome products and add something you'll love.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-all">
            Shop Now <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-14">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-serif text-4xl font-bold text-primary-foreground">Your Cart</h1>
          <p className="text-primary-foreground/70 mt-2">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
            {items.map((item, i) => (
              <motion.div key={`${item.productId}-${item.weight}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-secondary/40">
                  {getProductImage(item.slug) ? (
                    <img src={getProductImage(item.slug)} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <p className="text-white font-serif font-bold text-xs text-center px-1">{item.name}</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  {item.weight && <p className="text-muted-foreground text-xs">{item.weight}</p>}
                  <p className="text-primary font-bold mt-1">Rs {item.price}</p>
                </div>
                <div className="flex items-center border border-border rounded-xl overflow-hidden shrink-0">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.weight)}
                    className="px-3 py-2 hover:bg-secondary transition-colors text-sm font-bold">−</button>
                  <span className="px-3 py-2 font-semibold text-sm min-w-[2.5rem] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.weight)}
                    className="px-3 py-2 hover:bg-secondary transition-colors text-sm font-bold">+</button>
                </div>
                <p className="font-bold text-foreground shrink-0 min-w-[5rem] text-right">Rs {(item.price * item.quantity).toFixed(0)}</p>
                <button onClick={() => removeItem(item.productId, item.weight)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-2 shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-28">
              <h2 className="font-serif text-xl font-bold text-foreground mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Promo code"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                  />
                  <button onClick={handleApplyPromo} disabled={validatePromo.isPending}
                    className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
                    <Tag className="h-4 w-4" />
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-xs mt-2 font-medium">Code "{promoApplied}" applied!</p>
                )}
                <p className="text-muted-foreground text-xs mt-1">Try: ANGAAYAM10 or WELCOME50</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>Rs {subtotal.toFixed(0)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−Rs {discount.toFixed(0)}</span></div>}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `Rs ${shipping}`}</span>
                </div>
                {subtotal < 500 && shipping > 0 && (
                  <p className="text-muted-foreground text-xs">Add Rs {(500 - subtotal).toFixed(0)} more for free shipping</p>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">Rs {total.toFixed(0)}</span>
                </div>
              </div>

              <Link href={`/checkout?discount=${discount}&promoCode=${promoApplied}&shipping=${shipping}`}
                className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all text-lg">
                Proceed to Checkout <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
