import { searchUsersByUsername } from "./repository";

export const searchUsersService = async (
    username: string
) => {
    if (!username) {
        return [];
    }

    return searchUsersByUsername(username);
};