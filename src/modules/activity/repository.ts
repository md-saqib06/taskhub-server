import prisma from "../../shared/prisma/prisma";

export const getProjectActivities = async (
    projectId: string
) => {
    return prisma.activityLog.findMany({
        where: {
            projectId,
        },

        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },

        take: 50,
    });
};