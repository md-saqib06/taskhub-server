import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(2),
    avatarUrl: z.string().optional(),
    username: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = Omit<z.infer<typeof signupSchema>, "password"> & {
    passwordHash: string;
};