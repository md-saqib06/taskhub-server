import {
    createProject,
    createProjectMembership,
    getProjectsByUserId,
    addProjectMember,
    getProjectMembers,
    findProjectMembership,
} from "./repository";
import { CreateProjectInput } from "./validation";
import { requireProjectMember, requireProjectOwner } from "../../shared/utils/project-permissions";
import {
    getProjectById,
} from "./repository";

export const getProjectByIdService = async (
    projectId: string,
    userId: string
) => {
    await requireProjectMember(
        projectId,
        userId
    );

    const project =
        await getProjectById(projectId);

    if (!project) {
        throw new Error(
            "Project not found"
        );
    }

    return project;
};

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

    return memberships.map((membership: any) => ({
        ...membership.project,
        role: membership.role,
    }));
};

export const addProjectMemberService = async (
    projectId: string,
    currentUserId: string,
    targetUserId: string
) => {
    await requireProjectOwner(
        projectId,
        currentUserId
    );

    return addProjectMember(
        projectId,
        targetUserId
    );
};

export const getProjectMembersService = async (
    projectId: string,
    userId: string
) => {
    await requireProjectMember(
        projectId,
        userId
    );

    return getProjectMembers(projectId);
};