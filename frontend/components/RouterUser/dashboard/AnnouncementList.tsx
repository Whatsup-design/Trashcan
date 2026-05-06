import styles from "./AnnouncementList.module.css";

type AnnouncementHeaderType = "ANNOUNCEMENT" | "WARNING" | "NEW_REWARD";

export type UserAnnouncement = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: AnnouncementHeaderType;
};

type Props = {
  data: UserAnnouncement[];
};

const typeIcon: Record<AnnouncementHeaderType, string> = {
  ANNOUNCEMENT: "📢",
  WARNING: "⚠️",
  NEW_REWARD: "🎁",
};

const typeClass: Record<AnnouncementHeaderType, string> = {
  ANNOUNCEMENT: "announcement",
  WARNING: "warning",
  NEW_REWARD: "reward",
};

export default function AnnouncementList({ data }: Props) {
  return (
    <div className={styles.wrap}>
      <p className={styles.title}>Announcements</p>

      {data.length === 0 ? (
        <p className={styles.empty}>No announcements</p>
      ) : (
        <div className={styles.list}>
          {data.map((item) => (
            <div key={item.id} className={`${styles.item} ${styles[typeClass[item.type]]}`}>
              <span className={styles.icon}>{typeIcon[item.type]}</span>
              <div className={styles.content}>
                <p className={styles.itemTitle}>{item.title}</p>
                <p className={styles.itemMsg}>{item.message}</p>
                <p className={styles.itemDate}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
