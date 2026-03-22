import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { HackathonRoutes } from "../modules/hackathon/hackathon.route";

const router = Router();
// root routes

// auth
router.use("/auth", AuthRoutes);
router.use("/hackathons", HackathonRoutes);

export const IndexRoutes = router;
