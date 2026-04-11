import { Router } from "express";
import { db } from "@workspace/db";
import { newsletterSubscribersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existing = await db.select().from(newsletterSubscribersTable).where(eq(newsletterSubscribersTable.email, email));

    if (existing[0]) {
      if (existing[0].isActive) {
        return res.status(200).json({ success: true, message: "You are already subscribed!" });
      }
      await db.update(newsletterSubscribersTable).set({ isActive: true, name: name || existing[0].name }).where(eq(newsletterSubscribersTable.email, email));
      return res.status(201).json({ success: true, message: "Welcome back! You have been re-subscribed." });
    }

    await db.insert(newsletterSubscribersTable).values({
      email,
      name: name || null,
    });

    return res.status(201).json({ success: true, message: "Thank you for subscribing to Angaayam Foods newsletter!" });
  } catch (err) {
    req.log.error({ err }, "Error subscribing to newsletter");
    return res.status(500).json({ error: "Failed to subscribe" });
  }
});

router.post("/unsubscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await db.update(newsletterSubscribersTable).set({ isActive: false }).where(eq(newsletterSubscribersTable.email, email));

    return res.json({ success: true, message: "You have been unsubscribed." });
  } catch (err) {
    req.log.error({ err }, "Error unsubscribing");
    return res.status(500).json({ error: "Failed to unsubscribe" });
  }
});

export default router;
