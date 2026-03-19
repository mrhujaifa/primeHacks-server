import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";

const router = Router();
// root routes

// auth
router.use("/auth", AuthRoutes);

export const IndexRoutes = router;
