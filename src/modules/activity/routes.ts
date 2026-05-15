import { Router } from "express";

import { authMiddleware } from "../../shared/middleware/auth.middleware";

import { getProjectActivitiesController } from "./controller";

const router = Router();

router.use(authMiddleware);

router.get("/project/:projectId", getProjectActivitiesController);

export default router;