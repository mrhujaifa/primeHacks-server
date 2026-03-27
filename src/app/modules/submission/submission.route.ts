import { Router } from "express";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { verifyAuth } from "../../middlewares/auth/verifyAuth";
import { SubmissionControllers } from "./submission.controller";

const router = Router();

router.post(
  "/hackathon/:id",
  verifyAuth(UserRole.USER, UserRole.ORGANIZER, UserRole.ADMIN),
  SubmissionControllers.createSubmission,
);

router.get(
  "/me",
  verifyAuth(UserRole.USER, UserRole.ORGANIZER, UserRole.ADMIN),
  SubmissionControllers.getMySubmissions,
);
export const SubmissionRoutes = router;
