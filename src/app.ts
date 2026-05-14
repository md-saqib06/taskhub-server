import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/routes";
import projectRoutes from "./modules/projects/routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);

app.get("/", (_req, res) => {
    res.json({
        message: "TaskHub API running",
    });
});

export default app;