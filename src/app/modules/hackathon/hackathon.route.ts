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

<<<<<<< HEAD
router.get("/", HackathonControllers.getAllHackathons);

=======
>>>>>>> eae79c10a2eee6011026327ba61f96ed3757200e
export const HackathonRoutes = router;
