import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(2),

    description: z.string().optional(),

    priority: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
    ]),

    dueDate: z.string().optional(),

    assignedUserId:
        z.string().optional(),

    projectId: z.string(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;