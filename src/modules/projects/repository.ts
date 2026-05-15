import prisma from "../../shared/prisma/prisma";

export const createProject = async (data: {
    name: string;
    description?: string;
    ownerId: string;
}) => {
    return prisma.project.create({
        data,
    });
};

export const createProjectMembership = async (
    projectId: string,
    userId: string
) => {
    return prisma.projectMember.create({
        data: {
            projectId,
            userId,
            role: "OWNER",
        },
    });
};

export const getProjectsByUserId = async (
    userId: string
) => {
    return prisma.projectMember.findMany({
        where: {
            userId,
        },
        include: {
            project: true,
        },
    });
};

export const getProjectById = async (
    projectId: string
) => {
    return prisma.project.findUnique({
        where: {
            id: projectId,
        },
    });
};

export const findProjectById = async (
    projectId: string
) => {
    return prisma.project.findUnique({
        where: {
            id: projectId,
        },
    });
};

export const findProjectMembership = async (
    projectId: string,
    userId: string
) => {
    return prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId,
            },
        },
        include: {
            user: {
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

export const addProjectMember = async (
    projectId: string,
    userId: string
) => {
    return prisma.projectMember.create({
        data: {
            projectId,
            userId,
            role: "MEMBER",
        },
    });
};

export const getProjectMembers = async (
    projectId: string
) => {
    return prisma.projectMember.findMany({
        where: {
            projectId,
        },
        include: {
            user: {
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