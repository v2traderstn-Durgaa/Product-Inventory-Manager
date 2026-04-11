import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        imageUrl: categoriesTable.imageUrl,
        isActive: categoriesTable.isActive,
        productCount: sql<number>`(SELECT COUNT(*) FROM products WHERE category_id = ${categoriesTable.id} AND is_active = true)`.as("product_count"),
      })
      .from(categoriesTable)
      .where(eq(categoriesTable.isActive, true));

    res.json({ categories });
  } catch (err) {
    req.log.error({ err }, "Error fetching categories");
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
