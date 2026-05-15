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

export const updateTaskStatusSchema = z.object({
    status: z.enum([
        "TODO",
        "IN_PROGRESS",
        "DONE",
    ]),
});

export const updateTaskSchema = z.object({
    title: z.string().min(2),

    description: z.string().optional(),

    priority: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
    ]),

    assignedUserId: z.string().optional(),

    dueDate: z.string().optional(),

    status: z.enum([
        "TODO",
        "IN_PROGRESS",
        "DONE",
    ]),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;