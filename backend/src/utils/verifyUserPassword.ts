import { comparePassword } from "./comparePassword.js";

export async function verifyUserPassword(password: string, hashPassword: string): Promise<boolean> {
    const isMatch = await comparePassword(password, hashPassword);
    if (!isMatch) {
        throw new Error("Incorrect password");
    }
    return true;
}