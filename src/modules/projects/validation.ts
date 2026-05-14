import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
});

export const addMemberSchema = z.object({
    userId: z.string(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;