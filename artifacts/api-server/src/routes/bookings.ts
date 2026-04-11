import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

function generateBookingNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `ABK-${year}-${random}`;
}

router.post("/", async (req, res) => {
  try {
    const { type, name, email, phone, companyName, preferredDate, preferredTime, message } = req.body;

    if (!type || !name || !email || !phone || !preferredDate || !preferredTime || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const bookingNumber = generateBookingNumber();

    const [booking] = await db.insert(bookingsTable).values({
      bookingNumber,
      type,
      name,
      email,
      phone,
      companyName: companyName || null,
      preferredDate,
      preferredTime,
      message,
      status: "pending",
    }).returning();

    return res.status(201).json(booking);
  } catch (err) {
    req.log.error({ err }, "Error creating booking");
    return res.status(500).json({ error: "Failed to create booking" });
  }
});

router.get("/", async (req, res) => {
  try {
    const bookings = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
    res.json({ bookings });
  } catch (err) {
    req.log.error({ err }, "Error fetching bookings");
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

export default router;
