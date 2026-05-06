import PersonAvatar from "./PersonAvatar";
import styles from "./PeoplePreview.module.css";

const peoplePreview = [
  {
    id: "sonson",
    image: "/aboutpic/Sonson.png",
    alt: "Sonson portrait",
  },
];

export default function PeoplePreview() {
  return (
    <section className={styles.peopleStage}>
      <div className={styles.peopleGrid}>
        {peoplePreview.map((person) => (
          <div key={person.id} className={styles.personStage}>
            <PersonAvatar
              src={person.image}
              alt={person.alt}
              bgColor="linear-gradient(0deg, #7db27f 0%, #7db27f 74%, rgba(125, 178, 127, 0) 100%)"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
