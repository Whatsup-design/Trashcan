import { supabase } from "../../lib/supbase.js";

export async function getData(){
    const { data, error } = await supabase
        .from("User")
        .select("Student_ID,RFID_ID, Student_Name, Student_Bottles, Student_Tokens, Student_weight");
    if (error) {
        throw new Error(error.message);
    }
    return data;
}