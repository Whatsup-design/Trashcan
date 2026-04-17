import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    return hashPassword;
};

export const comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashPassword);
};