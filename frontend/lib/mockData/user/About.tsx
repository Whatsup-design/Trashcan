// lib/mockData/user/About.ts
// ── Types ──────────────────────────────────────────────────
export type PersonRole = "student" | "teacher";

export type PersonGroup = "manager" | "advisor" | "developer";

export type Person = {
  id: string;
  name: string;
  nameEn?: string;
  position: PersonRole;       // student | teacher
  duty: string;               // หน้าที่
  group: PersonGroup;
  photo: string;              // path เช่น /about/person.jpg
};

export type HardwareSlide = {
  id: string;
  image: string;
  caption?: string;
};

export type AboutData = {
  project: {
    name: string;
    objective: string;
    studyGroup: string;
    projectGroup: string;
    description: string;
  };
  hardwareSlides: HardwareSlide[];
  people: Person[];
};

// ── Mock data ──────────────────────────────────────────────
// ใช้รูปเดียวกันทั้งหมดตาม note
const PLACEHOLDER = "/template.jpg";

export const aboutData: AboutData = {
  project: {
    name: "Smart Trashcan",
    objective: "To promote sustainable waste management through smart recycling technology.",
    studyGroup: "Science-Mathematics Program",
    projectGroup: "Environmental Innovation",
    description:
      "This project focuses on developing a smart trashcan system that encourages recycling behavior using modern technology such as RFID and data tracking. The system aims to improve waste sorting efficiency, reduce environmental impact, and promote sustainability within the community.",
  },

  hardwareSlides: [
    { id: "h1", image: PLACEHOLDER, caption: "Smart Trashcan Device" },
    { id: "h2", image: PLACEHOLDER, caption: "Internal RFID System" },
    { id: "h3", image: PLACEHOLDER, caption: "Display Interface" },
    { id: "h4", image: PLACEHOLDER, caption: "Bottle Storage Compartment" },
  ],

  people: [
    // ── Manager ──────────────────────────────
    { id: "m1", name: "Mr. Somchai Jandee",  nameEn: "Somchai Jandee",  position: "teacher", duty: "Project Manager",            group: "manager",   photo: PLACEHOLDER },
    { id: "m2", name: "Ms. Malee Srisuwan",  nameEn: "Malee Srisuwan",  position: "teacher", duty: "Project Coordinator",        group: "manager",   photo: PLACEHOLDER },
    { id: "m3", name: "Mr. Wichai Thongdee", nameEn: "Wichai Thongdee", position: "student", duty: "Student Project Leader",     group: "manager",   photo: PLACEHOLDER },

    // ── Advisor ──────────────────────────────
    { id: "a1", name: "Dr. Pornpan Rodpai",   nameEn: "Pornpan Rodpai",  position: "teacher", duty: "Science Advisor",        group: "advisor", photo: PLACEHOLDER },
    { id: "a2", name: "Dr. Anuwat Ponsri",    nameEn: "Anuwat Ponsri",   position: "teacher", duty: "Engineering Advisor",    group: "advisor", photo: PLACEHOLDER },
    { id: "a3", name: "Dr. Kanokwan Sombut",  nameEn: "Kanokwan Sombut", position: "teacher", duty: "Environmental Advisor",  group: "advisor", photo: PLACEHOLDER },

    // ── Developer ────────────────────────────
    { id: "d1", name: "Teerawat Janta",   nameEn: "Teerawat Janta",   position: "student", duty: "Full Stack Developer", group: "developer", photo: PLACEHOLDER },
    { id: "d2", name: "Rujira Phanomwan", nameEn: "Rujira Phanomwan", position: "student", duty: "Frontend Developer",   group: "developer", photo: PLACEHOLDER },
    { id: "d3", name: "Piyaphat Charoen", nameEn: "Piyaphat Charoen", position: "student", duty: "Backend Developer",    group: "developer", photo: PLACEHOLDER },
    { id: "d4", name: "Supansa Wongpan",  nameEn: "Supansa Wongpan",  position: "student", duty: "UI/UX Designer",       group: "developer", photo: PLACEHOLDER },
    { id: "d5", name: "Thanakorn Srisuk", nameEn: "Thanakorn Srisuk", position: "student", duty: "Hardware Engineer",    group: "developer", photo: PLACEHOLDER },
    { id: "d6", name: "Warunee Khamphoo", nameEn: "Warunee Khamphoo", position: "student", duty: "Data Analyst",         group: "developer", photo: PLACEHOLDER },
    { id: "d7", name: "Kritsana Buakaew", nameEn: "Kritsana Buakaew", position: "student", duty: "IoT Developer",        group: "developer", photo: PLACEHOLDER },
  ],
};

// ── Group config ───────────────────────────────────────────
export const GROUP_CONFIG: Record<PersonGroup, { label: string; maxRow: number }> = {
  manager:   { label: "Management Team", maxRow: 3 },
  advisor:   { label: "Advisors",        maxRow: 3 },
  developer: { label: "Developers",      maxRow: 3 },
};