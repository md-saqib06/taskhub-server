import {
    createTask,
    deleteTask,
    getProjectTasks,
    updateTask,
    updateTaskStatus,
} from "./repository";

import { CreateTaskInput, UpdateTaskInput } from "./validation";

import { requireProjectMember } from "../../shared/utils/project-permissions";
import prisma from "../../shared/prisma/prisma";
import { createActivity } from "../../shared/services/activity.service";

export const createTaskService = async (
    data: CreateTaskInput,
    userId: string
) => {
    await requireProjectMember(
        data.projectId,
        userId
    );

    const task = await createTask({
        ...data,
        createdById: userId,
        dueDate: data.dueDate
            ? new Date(data.dueDate)
            : undefined,
    });

    await createActivity({
        type: "TASK_CREATED",
        message: `Created task "${task.title}"`,
        userId,
        projectId: task.projectId,
        taskId: task.id,
    });

    return task;
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

    const updatedTask = await updateTaskStatus(
        taskId,
        status
    );

    await createActivity({
        type: "TASK_STATUS_UPDATED",
        message: `Moved task "${task.title}" to ${status.toLowerCase()}`,
        userId,
        projectId: task.projectId,
        taskId: task.id,
    });

    return updatedTask;
};

export const updateTaskService = async (
    taskId: string,
    data: UpdateTaskInput,
    userId: string
) => {
    const existingTask =
        await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });

    if (!existingTask) {
        throw new Error(
            "Task not found"
        );
    }

    await requireProjectMember(
        existingTask.projectId,
        userId
    );

    const updatedTask =
        await updateTask(taskId, {
            ...data,

            dueDate: data.dueDate
                ? new Date(
                    data.dueDate
                )
                : undefined,
        });

    await createActivity({
        type: "TASK_UPDATED",
        message: `Updated task "${updatedTask.title}"`,
        userId,
        projectId: updatedTask.projectId,
        taskId: updatedTask.id,
    });

    return updatedTask;
};

export const deleteTaskService = async (
    taskId: string,
    userId: string
) => {
    const existingTask =
        await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });

    if (!existingTask) {
        throw new Error(
            "Task not found"
        );
    }

    await requireProjectMember(
        existingTask.projectId,
        userId
    );

    await createActivity({
        type: "TASK_DELETED",
        message: `Deleted task "${existingTask.title}"`,
        userId,
        projectId: existingTask.projectId,
    });

    return deleteTask(taskId);
};