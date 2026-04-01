// components/ui/LoadingScreen.tsx
// ─────────────────────────────────────────────────────────
// Loading screen แสดง gif ระหว่างรอ
// รับ src จาก props — ยืดหยุ่นใช้ได้หลายที่
// ─────────────────────────────────────────────────────────
import styles from "./Loadingscreen.module.css";

type Props = {
  src?: string; // path ของ gif เช่น "/loading.gif"
};

export default function LoadingScreen({ src = "/LoadingDefault.gif" }: Props) {
  return (
    <div className={styles.wrap}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Loading..." className={styles.gif} />
    </div>
  );
}