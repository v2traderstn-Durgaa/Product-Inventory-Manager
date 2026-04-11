import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const conditions = [eq(blogPostsTable.isPublished, true)];
    if (category && typeof category === "string") {
      conditions.push(eq(blogPostsTable.category, category));
    }

    const posts = await db
      .select()
      .from(blogPostsTable)
      .where(and(...conditions))
      .orderBy(desc(blogPostsTable.publishedAt))
      .limit(Number(limit))
      .offset(offset);

    const total = posts.length;

    res.json({ posts, total });
  } catch (err) {
    req.log.error({ err }, "Error fetching blog posts");
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [post] = await db.select().from(blogPostsTable).where(and(eq(blogPostsTable.slug, slug), eq(blogPostsTable.isPublished, true)));

    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    return res.json(post);
  } catch (err) {
    req.log.error({ err }, "Error fetching blog post");
    return res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

export default router;
