import { requireProjectMember } from "../../shared/utils/project-permissions";
import { getProjectActivities } from "./repository";

export const getProjectActivitiesService = async (
    projectId: string,
    userId: string
) => {
    await requireProjectMember(
        projectId,
        userId
    );

    return getProjectActivities(
        projectId
    );
};