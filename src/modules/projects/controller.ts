import { Request, Response } from "express";

import {
    createProjectService,
    getProjectsService,
} from "./service";

import { createProjectSchema } from "./validation";

export const createProjectController = async (
    req: Request,
    res: Response
) => {
    try {
        const validatedData =
            createProjectSchema.parse(req.body);

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const project = await createProjectService(
            validatedData,
            userId
        );

        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};

export const getProjectsController = async (
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

        const projects = await getProjectsService(
            userId
        );

        res.status(200).json(projects);
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};