export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: number | string;
        student_id?: number | string;
        role?: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}
