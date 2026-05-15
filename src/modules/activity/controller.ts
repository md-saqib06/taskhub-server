import { Request, Response } from "express";

import { getProjectActivitiesService } from "./service";

export const getProjectActivitiesController = async (
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

        const activities = await getProjectActivitiesService(
            req.params.projectId as string,
            userId
        );

        res.status(200).json(
            activities
        );
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};