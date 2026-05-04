"use client";

import styles from "./CartItem.module.css";

export type UserCartItem = {
  id: string;
  image: string;
  name: string;
  description: string;
  tokenPrice: number;
  redeemedAt: string;
  timeLeft: string;
  status: "PENDING" | "USED" | "CANCELLED" | "EXPIRED";
};

type Props = {
  item: UserCartItem;
  onUse?: (id: string) => void;
  onCancel?: (id: string) => void;
};

const statusLabel: Record<UserCartItem["status"], string> = {
  PENDING: "Pending",
  USED: "Used",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

export default function CartItem({ item, onUse, onCancel }: Props) {
  const isPending = item.status === "PENDING";
  const cardClassName = `${styles.card} ${!isPending ? styles.inactiveCard : ""}`;

  return (
    <article className={cardClassName}>
      <div className={styles.imageWrap}>
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} className={styles.image} />
        ) : (
          <div className={styles.imageFallback}>Reward</div>
        )}
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{item.name}</p>
        <p className={styles.description}>{item.description}</p>

        <div className={styles.metaRow}>
          <span>{item.tokenPrice} tokens</span>
          <span>{item.redeemedAt}</span>
          <span
            className={`${styles.statusBadge} ${styles[`status${item.status}`]}`}
          >
            {statusLabel[item.status]}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <p className={styles.timeLeft}>{item.timeLeft} left</p>

        <button
          className={styles.primaryButton}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onUse?.(item.id);
          }}
          disabled={!isPending}
        >
          Use
        </button>

        <button
          className={styles.cancelButton}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onCancel?.(item.id);
          }}
          disabled={!isPending}
        >
          Cancel
        </button>
      </div>
    </article>
  );
}
