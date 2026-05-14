import { Router } from "express";

import {
    createProjectController,
    getProjectsController,
} from "./controller";

import { authMiddleware } from "../../shared/middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createProjectController);

router.get("/", getProjectsController);

export default router;