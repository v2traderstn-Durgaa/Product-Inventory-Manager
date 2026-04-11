import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, bookingsTable, newsletterSubscribersTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const [ordersResult] = await db.select({ count: sql<number>`count(*)`, revenue: sql<number>`COALESCE(SUM(total::numeric), 0)` }).from(ordersTable);
    const [bookingsResult] = await db.select({ count: sql<number>`count(*)` }).from(bookingsTable);
    const [subscribersResult] = await db.select({ count: sql<number>`count(*)` }).from(newsletterSubscribersTable).where(eq(newsletterSubscribersTable.isActive, true));
    const [pendingResult] = await db.select({ count: sql<number>`count(*)` }).from(ordersTable).where(eq(ordersTable.status, "pending"));

    const recentOrders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(5);

    res.json({
      totalOrders: Number(ordersResult?.count ?? 0),
      totalRevenue: Number(ordersResult?.revenue ?? 0),
      totalBookings: Number(bookingsResult?.count ?? 0),
      totalSubscribers: Number(subscribersResult?.count ?? 0),
      pendingOrders: Number(pendingResult?.count ?? 0),
      recentOrders,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching admin stats");
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

export default router;
