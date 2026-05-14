import prisma from "../../shared/prisma/prisma";
import { CreateUserInput } from "./validation";

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: { email },
    });
};

export const findUserByUsername = async (username: string) => {
    return prisma.user.findUnique({
        where: { username },
    });
};

export const createUser = async (data: CreateUserInput) => {
    return prisma.user.create({
        data,
    });
};

export const findUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: { id },
    });
};