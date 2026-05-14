import { findProjectMembership } from "../../modules/projects/repository";

export const requireProjectOwner = async (
    projectId: string,
    userId: string
) => {
    const membership =
        await findProjectMembership(
            projectId,
            userId
        );

    if (!membership || membership.role !== "OWNER") {
        throw new Error("Only project owner can perform this action");
    }
};

export const requireProjectMember = async (
    projectId: string,
    userId: string
) => {
    const membership =
        await findProjectMembership(
            projectId,
            userId
        );

    if (!membership) {
        throw new Error("Unauthorized");
    }
};