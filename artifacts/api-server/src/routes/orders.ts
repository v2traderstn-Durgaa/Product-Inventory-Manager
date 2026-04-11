import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, promoCodesTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `AF-${year}-${random}`;
}

router.post("/", async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, subtotal, discount = 0, shippingCost = 0, total, paymentMethod, shippingAddress, promoCode, notes } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !items || !total || !paymentMethod || !shippingAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const orderNumber = generateOrderNumber();

    const [order] = await db.insert(ordersTable).values({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal: subtotal.toString(),
      discount: discount.toString(),
      shippingCost: shippingCost.toString(),
      total: total.toString(),
      status: "pending",
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      paymentMethod,
      shippingAddress,
      notes: notes || null,
    }).returning();

    let razorpayOrderId: string | undefined;
    let amount: number | undefined;
    let keyId: string | undefined;

    if (paymentMethod === "razorpay" && process.env["RAZORPAY_KEY_ID"] && process.env["RAZORPAY_KEY_SECRET"]) {
      try {
        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({
          key_id: process.env["RAZORPAY_KEY_ID"],
          key_secret: process.env["RAZORPAY_KEY_SECRET"],
        });
        const rzOrder = await razorpay.orders.create({
          amount: Math.round(total * 100),
          currency: "INR",
          receipt: orderNumber,
        });
        razorpayOrderId = rzOrder.id;
        amount = total;
        keyId = process.env["RAZORPAY_KEY_ID"];

        await db.update(ordersTable).set({ razorpayOrderId: rzOrder.id }).where(eq(ordersTable.id, order.id));
      } catch (rzErr) {
        req.log.error({ rzErr }, "Razorpay order creation failed");
      }
    }

    return res.status(201).json({
      order,
      razorpayOrderId,
      amount,
      currency: "INR",
      keyId,
    });
  } catch (err) {
    req.log.error({ err }, "Error creating order");
    return res.status(500).json({ error: "Failed to create order" });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    const secret = process.env["RAZORPAY_KEY_SECRET"];
    if (secret) {
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ error: "Invalid payment signature" });
      }
    }

    const [order] = await db
      .update(ordersTable)
      .set({
        status: "confirmed",
        paymentStatus: "paid",
        razorpayPaymentId,
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.id, orderId))
      .returning();

    return res.json(order);
  } catch (err) {
    req.log.error({ err }, "Error verifying payment");
    return res.status(500).json({ error: "Failed to verify payment" });
  }
});

router.get("/my-orders", async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(20);
    res.json({ orders });
  } catch (err) {
    req.log.error({ err }, "Error fetching orders");
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
    res.json({ orders });
  } catch (err) {
    req.log.error({ err }, "Error fetching all orders");
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/:orderNumber", async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.orderNumber, orderNumber));

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json(order);
  } catch (err) {
    req.log.error({ err }, "Error fetching order");
    return res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
