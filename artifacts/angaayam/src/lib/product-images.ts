import crunchetsImg from "@assets/i5_1776164274081.jpeg";
import almondPopsImg from "@assets/i4_1776164331820.jpeg";
import cookiesImg from "@assets/cookies_1_1776164741489.webp";
import cheesyMintImg from "@assets/i1_1776164741490.jpeg";
import chocosImg from "@assets/i2_1776164741490.jpeg";
import peanutPopsImg from "@assets/i3_1776164741490.jpeg";
import pepperImg from "@assets/pepper_1776164741491.jpg";
import ruskImg from "@assets/rusk_1776164741491.webp";
import gheeImg from "@assets/ghee_1776165031027.jpg";
import lbHoneyImg from "@assets/lb_honey_1776165031028.jpg";
import mountainHoneyImg from "@assets/moun_honey_1776165031028.jpg";

export const PRODUCT_IMAGES: Record<string, string> = {
  "crunchets": crunchetsImg,
  "almond-pops": almondPopsImg,
  "honey-infused-cookies": cookiesImg,
  "cheesy-mint": cheesyMintImg,
  "chocos": chocosImg,
  "peanut-pops": peanutPopsImg,
  "organic-pepper": pepperImg,
  "millet-rusk": ruskImg,
  "traditional-ghee": gheeImg,
  "little-bee-honey": lbHoneyImg,
  "mountain-bee-honey": mountainHoneyImg,
  "mountain-honey": mountainHoneyImg,
};

export function getProductImage(slug: string): string | undefined {
  return PRODUCT_IMAGES[slug];
}
