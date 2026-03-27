// components/user/About/PersonGroup.tsx
// ─────────────────────────────────────────────────────────
// Section สำหรับแต่ละกลุ่ม — ชื่อกลุ่ม + grid cards
// Desktop max 3/row, Mobile max 2/row
// ─────────────────────────────────────────────────────────
import type { Person, PersonGroup as GroupType } from "@/lib/mockData/user/About";
import { GROUP_CONFIG } from "@/lib/mockData/user/About";
import PersonCard from "./PersonCard";
import styles     from "./PersonGroup.module.css";

type Props = {
  group: GroupType;
  people: Person[];
};

export default function PersonGroup({ group, people }: Props) {
  const config = GROUP_CONFIG[group];
  const filtered = people.filter((p) => p.group === group);

  if (filtered.length === 0) return null;

  return (
    <div className={styles.section}>
      {/* Section title */}
      <h2 className={styles.title}>{config.label}</h2>

      {/* Grid */}
      <div className={styles.grid}>
        {filtered.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
}