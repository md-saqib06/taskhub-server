import { Request, Response } from "express";

import {
    createTaskService,
    getProjectTasksService,
} from "./service";

import {
    createTaskSchema,
} from "./validation";

export const createTaskController = async (
    req: Request,
    res: Response
) => {
    try {
        const validatedData = createTaskSchema.parse(req.body);

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message:
                    "Unauthorized",
            });
        }

        const task = await createTaskService(
            validatedData,
            userId
        );

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};

export const getProjectTasksController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message:
                    "Unauthorized",
            });
        }

        const projectId = req.params.projectId as string;

        if (!projectId) {
            return res.status(400).json({
                message:
                    "Project ID is required",
            });
        }

        const tasks = await getProjectTasksService(
            projectId,
            userId
        );

        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};