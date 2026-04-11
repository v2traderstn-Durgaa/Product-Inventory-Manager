import { Router } from "express";
import { db } from "@workspace/db";
import { promoCodesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/validate", async (req, res) => {
  try {
    const { code, orderValue } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Promo code is required" });
    }

    const [promo] = await db.select().from(promoCodesTable).where(eq(promoCodesTable.code, code.toUpperCase()));

    if (!promo || !promo.isActive) {
      return res.status(400).json({ valid: false, message: "Invalid or expired promo code" });
    }

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, message: "This promo code has expired" });
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ valid: false, message: "This promo code has reached its usage limit" });
    }

    const minOrder = parseFloat(promo.minOrderValue);
    if (orderValue && orderValue < minOrder) {
      return res.status(400).json({ valid: false, message: `Minimum order value of Rs ${minOrder} required` });
    }

    const discountValue = parseFloat(promo.discountValue);
    let discountAmount = 0;

    if (promo.discountType === "percentage") {
      discountAmount = (orderValue * discountValue) / 100;
    } else {
      discountAmount = discountValue;
    }

    return res.json({
      valid: true,
      discountType: promo.discountType,
      discountValue,
      discountAmount: Math.min(discountAmount, orderValue),
      message: `Promo applied! You save Rs ${discountAmount.toFixed(0)}`,
    });
  } catch (err) {
    req.log.error({ err }, "Error validating promo");
    return res.status(500).json({ error: "Failed to validate promo code" });
  }
});

export default router;
