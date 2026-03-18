// app/admin/data/page.tsx
// Server Component — mockup data อยู่ที่นี่
// ตอน connect Supabase แก้แค่ mockData array ด้านล่างครับ

import DataTable, { type DataRow } from "@/components/Data/DataTable";
import styles from "./page.module.css";

// ── Mockup data 20 rows ───────────────────────────────────
const mockData: DataRow[] = [
  { id: "1",  rfidUid: "A1B2C3D4", studentId: "64010001", name: "Somchai Jaidee",    bottles: 72, tokens: 144 },
  { id: "2",  rfidUid: "B2C3D4E5", studentId: "64010002", name: "Malee Srisuwan",    bottles: 45, tokens: 90  },
  { id: "3",  rfidUid: "C3D4E5F6", studentId: "64010003", name: "Nattapong Khamdi",  bottles: 8,  tokens: 16  },
  { id: "4",  rfidUid: "D4E5F6G7", studentId: "64010004", name: "Pornpan Rodpai",    bottles: 91, tokens: 182 },
  { id: "5",  rfidUid: "E5F6G7H8", studentId: "64010005", name: "Wichai Thongdee",   bottles: 33, tokens: 66  },
  { id: "6",  rfidUid: "F6G7H8I9", studentId: "64010006", name: "Siriporn Kaewjai",  bottles: 5,  tokens: 10  },
  { id: "7",  rfidUid: "G7H8I9J0", studentId: "64010007", name: "Anuwat Ponsri",     bottles: 60, tokens: 120 },
  { id: "8",  rfidUid: "H8I9J0K1", studentId: "64010008", name: "Kanokwan Sombut",   bottles: 22, tokens: 44  },
  { id: "9",  rfidUid: "I9J0K1L2", studentId: "64010009", name: "Teerawat Janta",    bottles: 88, tokens: 176 },
  { id: "10", rfidUid: "J0K1L2M3", studentId: "64010010", name: "Rujira Phanomwan",  bottles: 14, tokens: 28  },
  { id: "11", rfidUid: "K1L2M3N4", studentId: "65010001", name: "Piyaphat Charoен",  bottles: 55, tokens: 110 },
  { id: "12", rfidUid: "L2M3N4O5", studentId: "65010002", name: "Supansa Wongpan",   bottles: 3,  tokens: 6   },
  { id: "13", rfidUid: "M3N4O5P6", studentId: "65010003", name: "Thanakorn Srisuk",  bottles: 77, tokens: 154 },
  { id: "14", rfidUid: "N4O5P6Q7", studentId: "65010004", name: "Warunee Khamphoo",  bottles: 41, tokens: 82  },
  { id: "15", rfidUid: "O5P6Q7R8", studentId: "65010005", name: "Kritsana Buakaew",  bottles: 19, tokens: 38  },
  { id: "16", rfidUid: "P6Q7R8S9", studentId: "65010006", name: "Naphat Rodsamran",  bottles: 66, tokens: 132 },
  { id: "17", rfidUid: "Q7R8S9T0", studentId: "65010007", name: "Monthon Saelee",    bottles: 7,  tokens: 14  },
  { id: "18", rfidUid: "R8S9T0U1", studentId: "65010008", name: "Patcharee Jaiboon", bottles: 52, tokens: 104 },
  { id: "19", rfidUid: "S9T0U1V2", studentId: "65010009", name: "Noppadon Srirak",   bottles: 38, tokens: 76  },
  { id: "20", rfidUid: "T0U1V2W3", studentId: "65010010", name: "Orathai Phetkrai",  bottles: 95, tokens: 190 },
];

export default function DataPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Data</h1>
        <p className={styles.sub}>RFID & Student records — {mockData.length} total</p>
      </div>

      {/* ส่ง data ลงไปให้ DataTable จัดการ search/sort/filter/pagination */}
      <DataTable data={mockData} />
    </div>
  );
}