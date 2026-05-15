import {
    createTask,
    getProjectTasks,
} from "./repository";

import { CreateTaskInput } from "./validation";

import { requireProjectMember } from "../../shared/utils/project-permissions";

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