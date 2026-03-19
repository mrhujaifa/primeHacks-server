import { Router } from "express";
import { AuthController } from "./auth.controller";
import { verifyAuth } from "../../middlewares/auth/verifyAuth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("/profile", verifyAuth(UserRole.USER), AuthController.getMe);

export const AuthRoutes = router;
