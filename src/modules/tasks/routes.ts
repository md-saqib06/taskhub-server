import { Router } from "express";

import {
    createTaskController,
    deleteTaskController,
    getProjectTasksController,
    updateTaskController,
    updateTaskStatusController,
} from "./controller";

import { authMiddleware } from "../../shared/middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createTaskController);

router.patch("/:id/status", updateTaskStatusController);
router.patch("/:id", updateTaskController);

router.get("/project/:projectId", getProjectTasksController);

router.delete("/:id", deleteTaskController);

export default router;