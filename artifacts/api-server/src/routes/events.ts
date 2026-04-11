import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, eventRegistrationsTable } from "@workspace/db";
import { eq, gte, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const events = await db
      .select({
        id: eventsTable.id,
        title: eventsTable.title,
        slug: eventsTable.slug,
        description: eventsTable.description,
        eventType: eventsTable.eventType,
        eventDate: eventsTable.eventDate,
        endDate: eventsTable.endDate,
        location: eventsTable.location,
        isOnline: eventsTable.isOnline,
        meetingLink: eventsTable.meetingLink,
        maxAttendees: eventsTable.maxAttendees,
        price: eventsTable.price,
        imageUrl: eventsTable.imageUrl,
        isActive: eventsTable.isActive,
        registrationCount: sql<number>`(SELECT COUNT(*) FROM event_registrations WHERE event_id = ${eventsTable.id})`.as("registration_count"),
      })
      .from(eventsTable)
      .where(eq(eventsTable.isActive, true))
      .orderBy(eventsTable.eventDate);

    res.json({ events });
  } catch (err) {
    req.log.error({ err }, "Error fetching events");
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [event] = await db
      .select({
        id: eventsTable.id,
        title: eventsTable.title,
        slug: eventsTable.slug,
        description: eventsTable.description,
        eventType: eventsTable.eventType,
        eventDate: eventsTable.eventDate,
        endDate: eventsTable.endDate,
        location: eventsTable.location,
        isOnline: eventsTable.isOnline,
        meetingLink: eventsTable.meetingLink,
        maxAttendees: eventsTable.maxAttendees,
        price: eventsTable.price,
        imageUrl: eventsTable.imageUrl,
        isActive: eventsTable.isActive,
        registrationCount: sql<number>`(SELECT COUNT(*) FROM event_registrations WHERE event_id = ${eventsTable.id})`.as("registration_count"),
      })
      .from(eventsTable)
      .where(eq(eventsTable.slug, slug));

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.json(event);
  } catch (err) {
    req.log.error({ err }, "Error fetching event");
    return res.status(500).json({ error: "Failed to fetch event" });
  }
});

router.post("/:id/register", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, attendees = 1 } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const [registration] = await db.insert(eventRegistrationsTable).values({
      eventId: id,
      name,
      email,
      phone,
      attendees,
      paymentStatus: parseFloat(event.price) === 0 ? "free" : "pending",
    }).returning();

    return res.status(201).json(registration);
  } catch (err) {
    req.log.error({ err }, "Error registering for event");
    return res.status(500).json({ error: "Failed to register for event" });
  }
});

export default router;
