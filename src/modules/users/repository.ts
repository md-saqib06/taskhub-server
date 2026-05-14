import prisma from "../../shared/prisma/prisma";

export const searchUsersByUsername = async (
    username: string
) => {
    return prisma.user.findMany({
        where: {
            username: {
                contains: username,
                mode: "insensitive",
            },
        },
        select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
        },
        take: 10,
    });
};