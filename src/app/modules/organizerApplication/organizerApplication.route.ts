import { Router } from "express";
import { verifyAuth } from "../../middlewares/auth/verifyAuth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import validateRequest from "../../middlewares/validation/validateRequest";
import { createOrganizerApplicationValidationSchema } from "./organizerApplication.validation";
import { OrganizerApplicationControllers } from "./organizerApplication.controller";

const router = Router();

router.post(
  "/",
  verifyAuth(UserRole.USER, UserRole.ADMIN),
  // validateRequest(createOrganizerApplicationValidationSchema),
  OrganizerApplicationControllers.createOrganizerApplication,
);

router.get(
  "/me",
  verifyAuth(UserRole.USER, UserRole.ORGANIZER, UserRole.ADMIN),
  OrganizerApplicationControllers.getMyOrganizerApplication,
);

export const organizerApplicationRoutes = router;
