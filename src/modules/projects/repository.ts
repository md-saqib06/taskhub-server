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