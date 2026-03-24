import { Router } from "express";
import { HackathonControllers } from "./hackathon.controller";
import validateRequest from "../../middlewares/validation/validateRequest";
import { verifyAuth } from "../../middlewares/auth/verifyAuth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { createHackathonSchema } from "./hackathon.validation";

const router = Router();

router.post(
  "/",
  verifyAuth(UserRole.ORGANIZER, UserRole.ADMIN),
  validateRequest(createHackathonSchema),
  HackathonControllers.createHackathon,
);

router.get("/", HackathonControllers.getAllHackathons);
router.get(
  "/my-hackathons",
  verifyAuth(UserRole.ORGANIZER, UserRole.ADMIN),
  HackathonControllers.getOwnHackathons,
);

router.patch(
  "/:id",
  verifyAuth(UserRole.ORGANIZER, UserRole.ADMIN),
  HackathonControllers.updateHackathon,
);

export const HackathonRoutes = router;
