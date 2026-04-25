import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { HackathonRoutes } from "../modules/hackathon/hackathon.route";
import { SubmissionRoutes } from "../modules/submission/submission.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { organizerApplicationRoutes } from "../modules/organizerApplication/organizerApplication.route";

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
