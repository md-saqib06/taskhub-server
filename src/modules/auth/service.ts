import {
    createUser,
    findUserByEmail,
    findUserByUsername,
} from "./repository";

import {
    comparePassword,
    hashPassword,
} from "../../shared/utils/hash";

import { generateToken } from "../../shared/utils/jwt";
import { SignupInput, LoginInput } from "./validation";

export const signupService = async (data: SignupInput) => {
    const existingEmail = await findUserByEmail(data.email);

    if (existingEmail) {
        throw new Error("Email already exists");
    }

    const existingUsername = await findUserByUsername(
        data.username
    );

    if (existingUsername) {
        throw new Error("Username already exists");
    }

    const passwordHash = await hashPassword(data.password);
    const avatarUrl = data.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${data.username}`;

    const user = await createUser({
        name: data.name,
        username: data.username,
        email: data.email,
        password: passwordHash,
        avatarUrl,
    });

    const token = generateToken(user.id);

    return {
        user,
        token,
    };
};

export const loginService = async (data: LoginInput) => {
    const user = await findUserByEmail(data.email);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = await comparePassword(
        data.password,
        user.passwordHash
    );

    if (!isPasswordCorrect) {
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id);

    return {
        user,
        token,
    };
};