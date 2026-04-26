import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { verifyAuth } from "../../middlewares/auth/verifyAuth.js";
import { UserRole } from "../../../../prisma/generated/prisma/enums.js";

const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get(
  "/me",
  verifyAuth(UserRole.USER, UserRole.ORGANIZER, UserRole.ADMIN),
  AuthController.getMe,
);

router.get("/logout", AuthController.logoutUser);
router.post("/verify-email-otp", AuthController.signUpOtpVerification);

export const AuthRoutes = router;
