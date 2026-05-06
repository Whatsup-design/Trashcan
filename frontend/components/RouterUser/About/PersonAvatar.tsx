import styles from "./PersonAvatar.module.css";

type Props = {
  src: string;
  alt: string;
  bgColor?: string;
};

export default function PersonAvatar({ src, alt, bgColor }: Props) {
  return (
    <div className={styles.wrap}>
      <div
        className={styles.bg}
        style={bgColor ? { background: bgColor } : undefined}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={styles.person}
        draggable={false}
      />
    </div>
  );
}
