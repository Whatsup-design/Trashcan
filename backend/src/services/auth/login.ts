import { supabase } from "../../lib/supabase.js";
import { verifyUserPassword } from "../../utils/verifyUserPassword.js";

export async function PostLogin(student_id: string, password: string) {
    // normalize incoming id to number when possible
    const sid = Number(student_id);
    //DB query to get user by student id
    const { data: user, error } = await supabase
        .from("User")
        .select(
            "ID, role, Student_ID, Student_FullNameT, Student_FullNameE, Student_NickNameT, Student_NickNameE, password_hash, status"
        )
        .eq("Student_ID", sid)
        .maybeSingle();

    if (error) {
        console.error("Supabase error fetching user:", error);
        const devMsg = error?.message ?? JSON.stringify(error);
        const message = process.env.NODE_ENV === "production" ? "Error occurred while fetching user data" : `Supabase error: ${devMsg}`;
        throw new Error(message);
    }

    if (!user) {
        throw new Error("User not found");
    }

    if (user.status === "deactivated") {
        throw new Error("Account is deactivated");
    }

    if (!user.password_hash) {
        throw new Error("No password set for this user");
    }

    // verify password
    await verifyUserPassword(password, user.password_hash);
    
    const sanitizedUser = {
        id: user.id,
        student_id: user.Student_ID,
        role: user.role,
    };
    // return token payload data (without password hash)
    return sanitizedUser;
}