import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";
import bookingsRouter from "./bookings";
import eventsRouter from "./events";
import blogRouter from "./blog";
import contactRouter from "./contact";
import newsletterRouter from "./newsletter";
import testimonialsRouter from "./testimonials";
import promoRouter from "./promo";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/v1/products", productsRouter);
router.use("/v1/categories", categoriesRouter);
router.use("/v1/orders", ordersRouter);
router.use("/v1/bookings", bookingsRouter);
router.use("/v1/events", eventsRouter);
router.use("/v1/blog", blogRouter);
router.use("/v1/contact", contactRouter);
router.use("/v1/newsletter", newsletterRouter);
router.use("/v1/testimonials", testimonialsRouter);
router.use("/v1/promo", promoRouter);
router.use("/v1/admin", adminRouter);

export default router;
