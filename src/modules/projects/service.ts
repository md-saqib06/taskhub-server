import {
    createProject,
    createProjectMembership,
    getProjectsByUserId,
} from "./repository";

import { CreateProjectInput } from "./validation";

export const createProjectService = async (
    data: CreateProjectInput,
    ownerId: string
) => {
    const project = await createProject({
        ...data,
        ownerId,
    });

    await createProjectMembership(
        project.id,
        ownerId
    );

    return project;
};

export const getProjectsService = async (
    userId: string
) => {
    const memberships = await getProjectsByUserId(
        userId
    );
    console.log({ memberships });

    return memberships.map((membership: any) => ({
        ...membership.project,
        role: membership.role,
    }));
};