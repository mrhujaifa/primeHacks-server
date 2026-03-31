import express from "express";
import { verifyAuth } from "../../middlewares/auth/verifyAuth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { AdminControllers } from "./admin.controller";

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
