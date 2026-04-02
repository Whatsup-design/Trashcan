import { supabase } from "../../lib/supabase.js";

export async function getOverview(){
    const { data, error } = await supabase
        .from("User")
        .select("Student_Bottles, Student_Tokens");
    if (error) {
        throw new Error(error.message);
    }
    return data;
}