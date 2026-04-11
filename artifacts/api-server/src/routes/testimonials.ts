import { Router } from "express";
import { db } from "@workspace/db";
import { testimonialsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const testimonials = await db
      .select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.isApproved, true))
      .orderBy(desc(testimonialsTable.createdAt));

    res.json({ testimonials });
  } catch (err) {
    req.log.error({ err }, "Error fetching testimonials");
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { customerName, location, rating, review, productId } = req.body;

    if (!customerName || !rating || !review) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [testimonial] = await db.insert(testimonialsTable).values({
      customerName,
      location: location || null,
      rating,
      review,
      productId: productId || null,
      isApproved: false,
    }).returning();

    return res.status(201).json(testimonial);
  } catch (err) {
    req.log.error({ err }, "Error submitting testimonial");
    return res.status(500).json({ error: "Failed to submit testimonial" });
  }
});

export default router;
