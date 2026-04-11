import { Router } from "express";
import { db } from "@workspace/db";
import { contactMessagesTable } from "@workspace/db";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.insert(contactMessagesTable).values({
      name,
      email,
      phone: phone || null,
      subject,
      message,
    });

    return res.status(201).json({ success: true, message: "Your message has been received. We will get back to you shortly." });
  } catch (err) {
    req.log.error({ err }, "Error saving contact message");
    return res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
