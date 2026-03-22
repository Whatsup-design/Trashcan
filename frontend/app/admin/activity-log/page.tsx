// app/admin/activity-log/page.tsx
// ─────────────────────────────────────────────────────────
// Activity Log — แสดงข้อมูลรายวัน
// ข้อมูลจะถูกล้างทุกวัน (daily reset)
// ตอน connect Supabase แก้แค่ mockData ครับ
// ─────────────────────────────────────────────────────────

import ActivityLogTable, { type ActivityLog } from "@/components/RouterAdmin/activity-log/ActivityLogTable";
import styles from "./page.module.css";

// ── วันที่วันนี้ ───────────────────────────────────────────
const TODAY = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// ── Mockup data ───────────────────────────────────────────
const mockData: ActivityLog[] = [
  { id: "1",  studentId: "64010001", name: "Somchai Jaidee",    action: "Bottle collected", time: "08:12", tokenReceived: 2,  gramOfBottle: 35  },
  { id: "2",  studentId: "64010002", name: "Malee Srisuwan",    action: "Bottle collected", time: "08:45", tokenReceived: 2,  gramOfBottle: 42  },
  { id: "3",  studentId: "64010003", name: "Nattapong Khamdi",  action: "Token redeemed",   time: "09:10", tokenReceived: 0,  gramOfBottle: 0   },
  { id: "4",  studentId: "64010004", name: "Pornpan Rodpai",    action: "Bottle collected", time: "09:33", tokenReceived: 2,  gramOfBottle: 38  },
  { id: "5",  studentId: "65010001", name: "Piyaphat Charoen",  action: "Bottle collected", time: "10:05", tokenReceived: 2,  gramOfBottle: 44  },
  { id: "6",  studentId: "64010005", name: "Wichai Thongdee",   action: "Bottle collected", time: "10:22", tokenReceived: 2,  gramOfBottle: 31  },
  { id: "7",  studentId: "65010002", name: "Supansa Wongpan",   action: "Bottle collected", time: "10:48", tokenReceived: 2,  gramOfBottle: 39  },
  { id: "8",  studentId: "64010001", name: "Somchai Jaidee",    action: "Bottle collected", time: "11:15", tokenReceived: 2,  gramOfBottle: 36  },
  { id: "9",  studentId: "65010003", name: "Thanakorn Srisuk",  action: "Token redeemed",   time: "11:30", tokenReceived: 0,  gramOfBottle: 0   },
  { id: "10", studentId: "64010006", name: "Siriporn Kaewjai",  action: "Bottle collected", time: "11:52", tokenReceived: 2,  gramOfBottle: 41  },
  { id: "11", studentId: "65010004", name: "Warunee Khamphoo",  action: "Bottle collected", time: "12:08", tokenReceived: 2,  gramOfBottle: 33  },
  { id: "12", studentId: "64010007", name: "Anuwat Ponsri",     action: "Bottle collected", time: "12:34", tokenReceived: 2,  gramOfBottle: 47  },
  { id: "13", studentId: "65010005", name: "Kritsana Buakaew",  action: "Token redeemed",   time: "13:10", tokenReceived: 0,  gramOfBottle: 0   },
  { id: "14", studentId: "64010008", name: "Kanokwan Sombut",   action: "Bottle collected", time: "13:25", tokenReceived: 2,  gramOfBottle: 40  },
  { id: "15", studentId: "65010006", name: "Naphat Rodsamran",  action: "Bottle collected", time: "13:50", tokenReceived: 2,  gramOfBottle: 35  },
  { id: "16", studentId: "64010009", name: "Teerawat Janta",    action: "Bottle collected", time: "14:12", tokenReceived: 2,  gramOfBottle: 43  },
  { id: "17", studentId: "65010007", name: "Monthon Saelee",    action: "Bottle collected", time: "14:40", tokenReceived: 2,  gramOfBottle: 38  },
  { id: "18", studentId: "64010010", name: "Rujira Phanomwan",  action: "Token redeemed",   time: "15:05", tokenReceived: 0,  gramOfBottle: 0   },
  { id: "19", studentId: "65010008", name: "Patcharee Jaiboon", action: "Bottle collected", time: "15:22", tokenReceived: 2,  gramOfBottle: 36  },
  { id: "20", studentId: "65010009", name: "Noppadon Srirak",   action: "Bottle collected", time: "15:48", tokenReceived: 2,  gramOfBottle: 44  },
];

export default function ActivityLogPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Activity Log</h1>
        <p className={styles.sub}>Daily records — resets every midnight</p>
      </div>

      <ActivityLogTable data={mockData} date={TODAY} />
    </div>
  );
}