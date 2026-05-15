import prisma from "../prisma/prisma";

export const createActivity = async ({
    type,
    message,
    userId,
    projectId,
    taskId,
}: {
    type:
    | "PROJECT_CREATED"
    | "MEMBER_ADDED"
    | "TASK_CREATED"
    | "TASK_STATUS_UPDATED";

    message: string;

    userId: string;

    projectId: string;

    taskId?: string;
}) => {
    return prisma.activityLog.create({
        data: {
            type,
            message,
            userId,
            projectId,
            taskId,
        },
    });
};