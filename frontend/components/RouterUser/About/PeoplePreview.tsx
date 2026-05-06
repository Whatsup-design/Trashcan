import PersonAvatar from "./PersonAvatar";
import styles from "./PeoplePreview.module.css";
import type { CSSProperties } from "react";

export type PersonPreviewItem = {
  id: string;
  name: string;
  image: string;
  alt: string;
  bgColor?: string;
};

type Props = {
  title: string;
  people: PersonPreviewItem[];
  desktopColumns?: number;
  desktopGap?: number;
  avatarWidth?: number;
};

export default function PeoplePreview({
  title,
  people,
  desktopColumns = 4,
  desktopGap = 2,
  avatarWidth = 218,
}: Props) {
  return (
    <section
      className={styles.peopleStage}
      style={
        {
          "--desktop-cols": desktopColumns,
          "--desktop-gap": `${desktopGap}px`,
          "--avatar-width": `${avatarWidth}px`,
        } as CSSProperties
      }
    >
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>

      <div className={styles.peopleGrid}>
        {people.map((person) => (
          <div key={person.id} className={styles.personStage}>
            <PersonAvatar
              src={person.image}
              alt={person.alt}
              bgColor={person.bgColor}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
