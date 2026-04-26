import { Router } from "express";
import { HackathonControllers } from "./hackathon.controller.js";
import validateRequest from "../../middlewares/validation/validateRequest.js";
import { verifyAuth } from "../../middlewares/auth/verifyAuth.js";
import { UserRole } from "../../../../prisma/generated/prisma/enums.js";
import { createHackathonSchema } from "./hackathon.validation.js";

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
  verifyAuth(UserRole.ORGANIZER, UserRole.USER, UserRole.ADMIN),
  HackathonControllers.getOwnHackathons,
);
router.get("/category", HackathonControllers.getAllHackathonCategories);

router.get(
  "/:id",
  verifyAuth(UserRole.ADMIN, UserRole.USER, UserRole.ORGANIZER),
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
  HackathonControllers.updateHackathon,
);

export const HackathonRoutes = router;
