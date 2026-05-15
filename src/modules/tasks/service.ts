import {
    createTask,
    getProjectTasks,
    updateTaskStatus,
} from "./repository";

import { CreateTaskInput } from "./validation";

import { requireProjectMember } from "../../shared/utils/project-permissions";
import prisma from "../../shared/prisma/prisma";

export const createTaskService = async (
    data: CreateTaskInput,
    userId: string
) => {
    await requireProjectMember(
        data.projectId,
        userId
    );

    return createTask({
        ...data,

        createdById: userId,

        dueDate: data.dueDate
            ? new Date(data.dueDate)
            : undefined,
    });
};

export const getProjectTasksService = async (
    projectId: string,
    userId: string
) => {
    await requireProjectMember(
        projectId,
        userId
    );

    return getProjectTasks(
        projectId
    );
};

export const updateTaskStatusService = async (
    taskId: string,
    status:
        | "TODO"
        | "IN_PROGRESS"
        | "DONE",
    userId: string
) => {
    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
        },
    });

    if (!task) {
        throw new Error(
            "Task not found"
        );
    }

    await requireProjectMember(
        task.projectId,
        userId
    );

    return updateTaskStatus(
        taskId,
        status
    );
};