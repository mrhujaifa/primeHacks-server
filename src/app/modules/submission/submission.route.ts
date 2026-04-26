import { Router } from "express";
import { UserRole } from "../../../../prisma/generated/prisma/enums.js";
import { verifyAuth } from "../../middlewares/auth/verifyAuth.js";
import { SubmissionControllers } from "./submission.controller.js";

const router = Router();

router.post(
  "/hackathon/:id",
  verifyAuth(UserRole.USER, UserRole.ORGANIZER, UserRole.ADMIN),
  SubmissionControllers.createSubmission,
);

router.get(
  "/my-submission",
  verifyAuth(UserRole.USER, UserRole.ORGANIZER, UserRole.ADMIN),
  SubmissionControllers.getMySubmissions,
);
export const SubmissionRoutes = router;
