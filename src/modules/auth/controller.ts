import { Request, Response } from "express";

import {
    loginService,
    signupService,
} from "./service";

import {
    loginSchema,
    signupSchema,
} from "./validation";

export const signupController = async (
    req: Request,
    res: Response
) => {
    try {
        const validatedData = signupSchema.parse(req.body);

        const result = await signupService(validatedData);

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};

export const loginController = async (
    req: Request,
    res: Response
) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const result = await loginService(validatedData);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};

import { getCurrentUserService } from "./service";

export const getCurrentUserController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const user = await getCurrentUserService(userId);

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};