import { Request, Response } from "express";

import { searchUsersService } from "./service";

export const searchUsersController = async (
    req: Request,
    res: Response
) => {
    try {
        const username = req.query.username as string;

        const users = await searchUsersService(
            username
        );

        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};