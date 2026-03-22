import { Router } from "express";
import { HackathonControllers } from "./hackathon.controller";
import validateRequest from "../../middlewares/validation/validateRequest";
import { verifyAuth } from "../../middlewares/auth/verifyAuth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { createHackathonSchema } from "./hackathon.validation";

const router = Router();

router.post(
  "/",
  verifyAuth(UserRole.ORGANIZER),
  validateRequest(createHackathonSchema),
  HackathonControllers.createHackathon,
);

export const HackathonRoutes = router;
