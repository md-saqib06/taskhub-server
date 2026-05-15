import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const cookieToken = req.cookies.token;

        const bearerToken = req.headers.authorization?.split(" ")[1];

        const token = isProduction
            ? cookieToken
            : cookieToken || bearerToken;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {
            userId: string;
        };

        req.user = {
            userId: decoded.userId,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};