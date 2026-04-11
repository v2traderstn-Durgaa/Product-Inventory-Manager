import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";
import { eq, and, ilike, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, search, featured } = req.query;

    const conditions = [eq(productsTable.isActive, true)];

    if (featured === "true") {
      conditions.push(eq(productsTable.isFeatured, true));
    }

    if (search && typeof search === "string") {
      conditions.push(ilike(productsTable.name, `%${search}%`));
    }

    let products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        slug: productsTable.slug,
        description: productsTable.description,
        shortDescription: productsTable.shortDescription,
        price: productsTable.price,
        salePrice: productsTable.salePrice,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        images: productsTable.images,
        ingredients: productsTable.ingredients,
        tags: productsTable.tags,
        weightOptions: productsTable.weightOptions,
        isFeatured: productsTable.isFeatured,
        isActive: productsTable.isActive,
        stockQuantity: productsTable.stockQuantity,
        sku: productsTable.sku,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(and(...conditions));

    if (category && typeof category === "string") {
      products = products.filter((p) => {
        const catSlug = p.categoryName?.toLowerCase().replace(/\s+/g, "-");
        return catSlug === category || p.categoryId === category;
      });
    }

    res.json({ products });
  } catch (err) {
    req.log.error({ err }, "Error fetching products");
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        slug: productsTable.slug,
        description: productsTable.description,
        shortDescription: productsTable.shortDescription,
        price: productsTable.price,
        salePrice: productsTable.salePrice,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        images: productsTable.images,
        ingredients: productsTable.ingredients,
        tags: productsTable.tags,
        weightOptions: productsTable.weightOptions,
        isFeatured: productsTable.isFeatured,
        isActive: productsTable.isActive,
        stockQuantity: productsTable.stockQuantity,
        sku: productsTable.sku,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(and(eq(productsTable.isActive, true), eq(productsTable.isFeatured, true)));

    res.json({ products });
  } catch (err) {
    req.log.error({ err }, "Error fetching featured products");
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.isActive, true));
    res.json({ categories });
  } catch (err) {
    req.log.error({ err }, "Error fetching categories");
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const results = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        slug: productsTable.slug,
        description: productsTable.description,
        shortDescription: productsTable.shortDescription,
        price: productsTable.price,
        salePrice: productsTable.salePrice,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        images: productsTable.images,
        ingredients: productsTable.ingredients,
        nutritionalInfo: productsTable.nutritionalInfo,
        tags: productsTable.tags,
        weightOptions: productsTable.weightOptions,
        isFeatured: productsTable.isFeatured,
        isActive: productsTable.isActive,
        stockQuantity: productsTable.stockQuantity,
        sku: productsTable.sku,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(and(eq(productsTable.slug, slug), eq(productsTable.isActive, true)));

    if (!results[0]) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(results[0]);
  } catch (err) {
    req.log.error({ err }, "Error fetching product");
    return res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;
