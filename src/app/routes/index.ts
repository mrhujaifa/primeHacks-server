import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { HackathonRoutes } from "../modules/hackathon/hackathon.route.js";
import { SubmissionRoutes } from "../modules/submission/submission.route.js";
import { PaymentRoutes } from "../modules/payment/payment.route.js";
import { AdminRoutes } from "../modules/admin/admin.route.js";
import { organizerApplicationRoutes } from "../modules/organizerApplication/organizerApplication.route.js";

const router = Router();
// root routes

// auth
router.use("/auth", AuthRoutes);
router.use("/hackathons", HackathonRoutes);
router.use("/submission", SubmissionRoutes);
router.use("/payments", PaymentRoutes);
router.use("/admins", AdminRoutes);
router.use("/organizerApplication", organizerApplicationRoutes);

export const IndexRoutes = router;
