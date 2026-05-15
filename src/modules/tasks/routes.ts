import { Router } from "express";

import {
    createTaskController,
    getProjectTasksController,
} from "./controller";

import { authMiddleware } from "../../shared/middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createTaskController);

router.get("/project/:projectId", getProjectTasksController);

export default router;