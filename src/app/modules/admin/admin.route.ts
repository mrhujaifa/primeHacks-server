import express from "express";
import { verifyAuth } from "../../middlewares/auth/verifyAuth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { AdminControllers } from "./admin.controller";

const router = express.Router();

router.get("/users", verifyAuth(UserRole.ADMIN), AdminControllers.getAllUsers);

// router.patch(
//   "/users/:id",
//   verifyAuth(UserRole.ADMIN),
//   AdminControllers.updateUser,
// );

// router.get(
//   "/submissions",
//   verifyAuth(UserRole.ADMIN),
//   AdminControllers.getAllSubmissions,
// );

// router.patch(
//   "/submissions/:id/status",
//   verifyAuth(UserRole.ADMIN),
//   AdminControllers.updateSubmissionStatus,
// );

export const AdminRoutes = router;
