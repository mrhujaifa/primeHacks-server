import { Router } from "express";
import { verifyAuth } from "../../middlewares/auth/verifyAuth.js";
import { UserRole } from "../../../../prisma/generated/prisma/enums.js";
import validateRequest from "../../middlewares/validation/validateRequest.js";
import { createOrganizerApplicationValidationSchema } from "./organizerApplication.validation.js";
import { OrganizerApplicationControllers } from "./organizerApplication.controller.js";

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
