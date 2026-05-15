import { Router } from "express";

import {
    addProjectMemberController,
    createProjectController,
    getProjectByIdController,
    getProjectMembersController,
    getProjectsController,
} from "./controller";

import { authMiddleware } from "../../shared/middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createProjectController);
router.post("/:id/members", addProjectMemberController);

router.get("/:id/members", getProjectMembersController);
router.get("/", getProjectsController);
router.get("/:id", getProjectByIdController);

export default router;