import {
    createProject,
    createProjectMembership,
    getProjectsByUserId,
    addProjectMember,
    getProjectMembers,
    findProjectMembership,
    getProjectById,
} from "./repository";
import { CreateProjectInput } from "./validation";
import { requireProjectMember, requireProjectOwner } from "../../shared/utils/project-permissions";
import { createActivity } from "../../shared/services/activity.service";

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

    await createActivity({
        type: "PROJECT_CREATED",
        message: `Created project "${project.name}"`,
        userId: ownerId,
        projectId: project.id,
    });

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
    const result = await addProjectMember(
        projectId,
        targetUserId
    );
    const projectMembership = await findProjectMembership(projectId, targetUserId);

    await createActivity({
        type: "MEMBER_ADDED",
        message: `Added ${projectMembership?.user?.username || "new member"} to the project`,
        userId: currentUserId,
        projectId,
    });

    return result;
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