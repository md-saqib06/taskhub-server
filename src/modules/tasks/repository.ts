import prisma from "../../shared/prisma/prisma";

export const createTask = async (
    data: any
) => {
    return prisma.task.create({
        data,

        include: {
            assignedUser: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatarUrl: true,
                },
            },
        },
    });
};

export const getProjectTasks = async (
    projectId: string
) => {
    return prisma.task.findMany({
        where: {
            projectId,
        },

        include: {
            assignedUser: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatarUrl: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};

export const updateTaskStatus = async (
    taskId: string,
    status:
        | "TODO"
        | "IN_PROGRESS"
        | "DONE"
) => {
    return prisma.task.update({
        where: {
            id: taskId,
        },

        data: {
            status,
        },
    });
};