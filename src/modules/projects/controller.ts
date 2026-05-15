import { Request, Response } from "express";

import {
    addProjectMemberService,
    createProjectService,
    getProjectByIdService,
    getProjectMembersService,
    getProjectsService,
} from "./service";

import { addMemberSchema, createProjectSchema } from "./validation";
import { findProjectMembership } from "./repository";

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

export const getProjectByIdController = async (
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
        const projectId = req.params.id as string;

        if (!projectId) {
            return res.status(400).json({
                message: "Project ID is required",
            });
        }

        const project = await getProjectByIdService(
            projectId,
            userId
        );

        res.status(200).json(project);
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

export const addProjectMemberController = async (req: Request, res: Response) => {
    try {
        const validatedData = addMemberSchema.parse(req.body);

        const currentUserId = req.user?.userId;

        if (!currentUserId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        };

        const projectId = req.params.id as string;

        const existingMembership = await findProjectMembership(
            projectId,
            validatedData.userId
        );

        if (existingMembership) {
            return res.status(409).json({
                message: "User is already a member of this project",
            });
        }

        const member = await addProjectMemberService(
            projectId,
            currentUserId,
            validatedData.userId
        );

        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};

export const getProjectMembersController = async (req: Request, res: Response) => {
    try {
        const currentUserId = req.user?.userId;

        if (!currentUserId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const projectId = req.params.id as string;

        const members = await getProjectMembersService(
            projectId,
            currentUserId
        );

        res.status(200).json(members);
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};