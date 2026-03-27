// components/user/About/PersonCard.tsx
// ─────────────────────────────────────────────────────────
// Card แต่ละคน — รูปวงกลม + ชื่อ
// คลิก → popup individual via dynamic route
// ─────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { Person } from "@/lib/mockData/user/About";
import styles from "./PersonCard.module.css";

type Props = { person: Person };

// ── Popup modal ───────────────────────────────────────────
function PersonModal({ person, onClose }: { person: Person; onClose: () => void }) {
  const positionLabel = person.position === "teacher" ? "อาจารย์" : "นักเรียน";

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>

        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Photo — rounded rectangle */}
        <div className={styles.modalImgWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={person.photo} alt={person.name} className={styles.modalImg} />
        </div>

        {/* Info */}
        <div className={styles.modalInfo}>
          <p className={styles.modalName}>{person.name}</p>
          {person.nameEn && <p className={styles.modalNameEn}>{person.nameEn}</p>}

          <div className={styles.modalTags}>
            <span className={`${styles.tag} ${person.position === "teacher" ? styles.tagTeacher : styles.tagStudent}`}>
              {positionLabel}
            </span>
          </div>

          <div className={styles.modalDetail}>
            <p className={styles.modalDutyLabel}>หน้าที่</p>
            <p className={styles.modalDuty}>{person.duty}</p>
          </div>
        </div>

      </div>
    </>,
    document.body
  );
}

// ── Card ──────────────────────────────────────────────────
export default function PersonCard({ person }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={styles.card} onClick={() => setOpen(true)}>
        {/* Circle photo */}
        <div className={styles.circle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={person.photo} alt={person.name} className={styles.circleImg} />
        </div>
        <p className={styles.name}>{person.name}</p>
      </button>

      {open && <PersonModal person={person} onClose={() => setOpen(false)} />}
    </>
  );
}