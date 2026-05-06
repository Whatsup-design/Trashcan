import { supabase } from "../../lib/supabase.js";

type CreateAnnouncementInput = {
  title: string;
  message: string;
  headerType: string;
};

const ALLOWED_ANNOUNCEMENT_HEADER_TYPES = [
  "WARNING",
  "ANNOUNCEMENT",
  "NEW_REWARD",
] as const;

const ANNOUNCEMENT_SELECT = [
  "Announcement_ID",
  "Announcement_Title",
  "Announcement_Message",
  "Announcement_HeaderType",
  "Announcement_IsActive",
  "created_at",
  "updated_at",
].join(", ");

export async function getAnnouncements() {
  const { data, error } = await supabase
    .from("Announcement")
    .select(ANNOUNCEMENT_SELECT)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createAnnouncement(input: CreateAnnouncementInput) {
  const title = input.title.trim();
  const message = input.message.trim();
  const headerType = input.headerType.trim().toUpperCase();

  if (!title || !message) {
    throw new Error("Announcement title and message are required");
  }

  if (!ALLOWED_ANNOUNCEMENT_HEADER_TYPES.includes(headerType as (typeof ALLOWED_ANNOUNCEMENT_HEADER_TYPES)[number])) {
    throw new Error("Invalid announcement header type");
  }

  const { data, error } = await supabase
    .from("Announcement")
    .insert({
      Announcement_Title: title,
      Announcement_Message: message,
      Announcement_HeaderType: headerType,
      Announcement_IsActive: true,
    })
    .select(ANNOUNCEMENT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
