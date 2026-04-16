import jwt from "jsonwebtoken";

type UserPayload = {
    id: string | number;
    role: string;
};

export const generateToken = (user: UserPayload): string => {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) throw new Error("Missing JWT_SECRET_KEY environment variable");

    const payload = {
        id: user.id,
        role: user.role,
    };

    return jwt.sign(payload, secret, { expiresIn: "7d" });
};