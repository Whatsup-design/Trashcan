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
};

type Props = {
  item: UserCartItem;
  onUse?: (id: string) => void;
  onCancel?: (id: string) => void;
};

export default function CartItem({ item, onUse, onCancel }: Props) {
  return (
    <article className={styles.card}>
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
        </div>
      </div>

      <div className={styles.actions}>
        <p className={styles.timeLeft}>{item.timeLeft} left</p>

        <button
          className={styles.primaryButton}
          type="button"
          onClick={() => onUse?.(item.id)}
        >
          Use
        </button>

        <button
          className={styles.cancelButton}
          type="button"
          onClick={() => onCancel?.(item.id)}
        >
          Cancel
        </button>
      </div>
    </article>
  );
}
