import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    return hashPassword;
};
