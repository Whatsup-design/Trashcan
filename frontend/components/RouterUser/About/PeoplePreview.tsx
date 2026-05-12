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
  featuredFirstId?: string;
  variant?: "green" | "blue";
};

export default function PeoplePreview({
  title,
  people,
  desktopColumns = 4,
  desktopGap = 2,
  avatarWidth = 218,
  featuredFirstId,
  variant = "green",
}: Props) {
  const featuredPerson = featuredFirstId
    ? people.find((person) => person.id === featuredFirstId)
    : undefined;
  const gridPeople = featuredPerson
    ? people.filter((person) => person.id !== featuredPerson.id)
    : people;

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
      <div className={styles.sectionHeader} data-variant={variant}>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>

      {featuredPerson && (
        <div className={styles.featuredRow}>
          <div className={styles.personStage}>
            <PersonAvatar
              src={featuredPerson.image}
              alt={featuredPerson.alt}
              bgColor={featuredPerson.bgColor}
            />
          </div>
        </div>
      )}

      <div className={styles.peopleGrid}>
        {gridPeople.map((person) => (
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
