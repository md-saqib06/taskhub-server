import { Router } from "express";

import {
    getCurrentUserController,
    loginController,
    signupController,
} from "./controller";
import { authMiddleware } from "../../shared/middleware/auth.middleware";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);

router.get("/me", authMiddleware, getCurrentUserController);

export default router;