import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Phone } from "lucide-react";
import { useGetOrderByNumber } from "@workspace/api-client-react";

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { data: order } = useGetOrderByNumber(orderNumber);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-14 w-14 text-green-600" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Order Placed!</h1>
          <p className="text-muted-foreground text-lg mb-2">Thank you for your order. We've received it and will process it shortly.</p>
          {orderNumber && (
            <div className="bg-secondary/40 rounded-2xl px-6 py-4 inline-block mt-4 mb-8">
              <p className="text-muted-foreground text-sm">Order Number</p>
              <p className="font-bold text-2xl text-primary">{orderNumber}</p>
            </div>
          )}

          {order && (
            <div className="bg-card border border-border rounded-2xl p-6 text-left mb-8">
              <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Order Details</h2>
              <div className="space-y-2 text-sm mb-4">
                {(order.items as any[])?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                    <span className="font-medium">Rs {(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">Rs {Number(order.total).toFixed(0)}</span>
              </div>
              {order.shippingAddress && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-semibold mb-1">Delivering to:</p>
                  <p className="text-muted-foreground text-sm">
                    {(order.shippingAddress as any).line1}, {(order.shippingAddress as any).city}, {(order.shippingAddress as any).state} - {(order.shippingAddress as any).pincode}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> Need Help?</h3>
            <p className="text-muted-foreground text-sm">Call us at <span className="text-primary font-semibold">822 080 7063</span> or email at <span className="text-primary font-semibold">v2traderstn@gmail.com</span></p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-all">
              Continue Shopping <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-2xl hover:bg-secondary/80 transition-all">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
