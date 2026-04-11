# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Angaayam Foods E-Commerce App

### Artifacts
- **Frontend**: `artifacts/angaayam` (React+Vite, path `/`)
- **API Server**: `artifacts/api-server` (Express 5, path `/api-server`)

### Brand
- Theme: Deep Forest Green (`--primary: 143 48% 20%`) + Gold (`--accent: 44 56% 54%`)
- Fonts: Plus Jakarta Sans + Playfair Display
- Logo: `artifacts/angaayam/src/assets/Angaayam_logo_1775894700558.png`
- Contact: phone 822 080 7063, email v2traderstn@gmail.com

### Products (11 total seeded in DB)
- Millet Snacks: Crunchets Rs50, Almond Pops Rs50, Peanut Pops Rs50, Cheesy Mint Rs50, Chocos Rs60, Millet Rusk Rs65, Honey Infused Cookies Rs50
- Organic Foods: Traditional Ghee Rs300/200g, Little Bee Honey Rs350/250g, Mountain Bee Rs250/250g, Organic Pepper Rs350/250g

### Features Implemented
- Product catalog with search and category filters
- Product detail with weight options and add to cart
- Shopping cart with promo code validation (ANGAAYAM10, WELCOME50)
- Checkout with COD + Razorpay payment options
- Order confirmation page
- Bookings page (consultation, bulk, corporate, gift hamper)
- Events listing and registration
- Blog with category filtering and full post view
- Contact form
- About page with brand story
- Admin dashboard with order stats
- Newsletter subscription in footer
- Free shipping on orders > Rs 499

### API Routes (all at `/api/v1/`)
- products, categories, orders, bookings, events, blog, contact, newsletter, testimonials, promo, admin

### Cart
- Stored in `localStorage` key `angaayam_cart`
- CartProvider wraps entire app via `use-cart.tsx` hook
