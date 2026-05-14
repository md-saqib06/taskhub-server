import { Router } from "express";

import { searchUsersController } from "./controller";

import { authMiddleware } from "../../shared/middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/search", searchUsersController);

export default router;