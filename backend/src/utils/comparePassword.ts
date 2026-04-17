import bcrpyt from 'bcrypt';

export const comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
    return await bcrpyt.compare(password, hashPassword);
};