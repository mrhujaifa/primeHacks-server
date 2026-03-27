import { Router } from "express";
import { HackathonControllers } from "./hackathon.controller";
import validateRequest from "../../middlewares/validation/validateRequest";
import { verifyAuth } from "../../middlewares/auth/verifyAuth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import {
  createHackathonSchema,
  // updateHackathonValidationSchema,
} from "./hackathon.validation";

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
router.get("/category", HackathonControllers.getAllHackathonCategories);

router.get(
  "/:id",
  verifyAuth(UserRole.ADMIN, UserRole.ORGANIZER),
  HackathonControllers.getHackathonById,
);

router.delete(
  "/:id",
  verifyAuth(UserRole.ORGANIZER, UserRole.ADMIN),
  HackathonControllers.deleteHackathon,
);

router.patch(
  "/:id",
  verifyAuth(UserRole.ORGANIZER, UserRole.ADMIN),
  // validateRequest(updateHackathonValidationSchema),
  HackathonControllers.updateHackathon,
);

export const HackathonRoutes = router;
