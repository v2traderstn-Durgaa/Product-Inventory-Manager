import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: "cod" | "razorpay";
  notes?: string;
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const discount = Number(params.get("discount") ?? 0);
  const shippingCost = Number(params.get("shipping") ?? (subtotal > 499 ? 0 : 60));
  const total = subtotal - discount + shippingCost;

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutForm>({
    defaultValues: { paymentMethod: "cod" }
  });
  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }

    const orderPayload = {
      customerName: data.name,
      customerEmail: data.email,
      customerPhone: data.phone,
      items: items.map(i => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, weight: i.weight })),
      subtotal,
      discount,
      shippingCost,
      total,
      paymentMethod: data.paymentMethod,
      shippingAddress: { name: data.name, line1: data.line1, line2: data.line2, city: data.city, state: data.state, pincode: data.pincode, phone: data.phone },
      notes: data.notes,
    };

    createOrder.mutate({ data: orderPayload }, {
      onSuccess: (response) => {
        const order = response.order;
        if (data.paymentMethod === "razorpay" && response.razorpayOrderId && (window as any).Razorpay) {
          const rzpOptions = {
            key: response.keyId,
            amount: Math.round(total * 100),
            currency: "INR",
            name: "Angaayam Foods",
            description: `Order ${order.orderNumber}`,
            order_id: response.razorpayOrderId,
            prefill: { name: data.name, email: data.email, contact: data.phone },
            theme: { color: "#1B4D2E" },
            handler: async (paymentRes: any) => {
              clearCart();
              setLocation(`/order-confirmation/${order.orderNumber}`);
              toast({ title: "Payment successful!", description: `Order ${order.orderNumber} confirmed.` });
            },
          };
          const rzp = new (window as any).Razorpay(rzpOptions);
          rzp.open();
        } else {
          clearCart();
          setLocation(`/order-confirmation/${order.orderNumber}`);
          toast({ title: "Order placed!", description: `Order ${order.orderNumber} placed successfully.` });
        }
      },
      onError: () => {
        toast({ title: "Order failed", description: "Could not place your order. Please try again.", variant: "destructive" });
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Link href="/products" className="text-primary underline">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-14">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-serif text-4xl font-bold text-primary-foreground">Checkout</h1>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-serif text-xl font-bold mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                    <input {...register("name", { required: "Name is required" })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="Priya Sharma" />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                    <input {...register("email", { required: "Email is required" })} type="email"
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="priya@email.com" />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Phone *</label>
                    <input {...register("phone", { required: "Phone is required" })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="9876543210" />
                    {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-1 block">Address Line 1 *</label>
                    <input {...register("line1", { required: "Address is required" })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="House / Flat No, Street" />
                    {errors.line1 && <p className="text-destructive text-xs mt-1">{errors.line1.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-1 block">Address Line 2</label>
                    <input {...register("line2")}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="Area, Landmark" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">City *</label>
                    <input {...register("city", { required: "City is required" })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="Chennai" />
                    {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">State *</label>
                    <input {...register("state", { required: "State is required" })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="Tamil Nadu" />
                    {errors.state && <p className="text-destructive text-xs mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Pincode *</label>
                    <input {...register("pincode", { required: "Pincode is required" })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm" placeholder="600001" />
                    {errors.pincode && <p className="text-destructive text-xs mt-1">{errors.pincode.message}</p>}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-serif text-xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <input {...register("paymentMethod")} type="radio" value="cod" className="w-4 h-4 accent-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Cash on Delivery</p>
                      <p className="text-muted-foreground text-sm">Pay when your order arrives</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "razorpay" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <input {...register("paymentMethod")} type="radio" value="razorpay" className="w-4 h-4 accent-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Online Payment</p>
                      <p className="text-muted-foreground text-sm">UPI, Cards, Net Banking via Razorpay</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-serif text-xl font-bold mb-4">Order Notes (Optional)</h2>
                <textarea {...register("notes")} rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-sm resize-none"
                  placeholder="Special instructions for delivery..." />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-28">
                <h2 className="font-serif text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={`${item.productId}-${item.weight}`} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name} {item.weight && `(${item.weight})`} × {item.quantity}</span>
                      <span className="font-medium">Rs {(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>Rs {subtotal.toFixed(0)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−Rs {discount.toFixed(0)}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : `Rs ${shippingCost}`}</span></div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span><span className="text-primary">Rs {total.toFixed(0)}</span>
                  </div>
                </div>
                <button type="submit" disabled={createOrder.isPending}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-60 text-lg">
                  <Lock className="h-5 w-5" />
                  {createOrder.isPending ? "Placing Order..." : "Place Order"}
                </button>
                <p className="text-center text-muted-foreground text-xs mt-3 flex items-center justify-center gap-1">
                  <Lock className="h-3 w-3" /> Secure checkout
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
