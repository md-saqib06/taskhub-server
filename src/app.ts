import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/routes";
import projectRoutes from "./modules/projects/routes";
import userRoutes from "./modules/users/routes";
import taskRoutes from "./modules/tasks/routes";
import activityRoutes from "./modules/activity/routes";

const app = express();

const origins = process.env.FRONTEND_ORIGINS?.split(",");
app.use(
    cors({
        origin: origins,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/activities", activityRoutes);

app.get("/", (_req, res) => {
    res.json({
        message: "TaskHub API running",
    });
});

export default app;