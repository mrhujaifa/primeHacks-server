import express from "express";
import { verifyAuth } from "../../middlewares/auth/verifyAuth.js";
import { UserRole } from "../../../../prisma/generated/prisma/enums.js";
import { AdminControllers } from "./admin.controller.js";

const router = express.Router();

router.get("/users", verifyAuth(UserRole.ADMIN), AdminControllers.getAllUsers);

router.patch(
  "/users/:id/role",
  verifyAuth(UserRole.ADMIN),
  AdminControllers.updateUserRole,
);

router.patch(
  "/users/:id/status",
  verifyAuth(UserRole.ADMIN),
  AdminControllers.updateUserStatus,
);

export const AdminRoutes = router;
