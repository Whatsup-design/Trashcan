"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CartItem, {
  type UserCartItem,
} from "@/components/RouterUser/TokenMarket/CartItem";
import CartStatusConfirm from "@/components/RouterUser/TokenMarket/CartStatusConfirm";
import LoadingScreen from "@/components/Ui/Loadingscreen";
import { ApiError, apiFetch, apiPatch } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import styles from "./page.module.css";

type UserRedeemApiRow = {
  Reedeem_ID: number;
  Reedem_Date: string;
  Product_ID: number;
  Product_name: string | null;
  Product_Description: string | null;
  Product_Price: number | null;
  Product_ImgUrl: string | null;
  Redeem_Status?: string | null;
};

type CartFilter = "ALL" | UserCartItem["status"];
type CartStatusAction = "USED" | "CANCELLED";
type PendingAction = {
  item: UserCartItem;
  action: CartStatusAction;
} | null;

const filterOptions: Array<{ value: CartFilter; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "USED", label: "Used" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "EXPIRED", label: "Expired" },
];

function formatRedeemedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Redeemed recently";
  }

  return `Redeemed ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function normalizeStatus(value: string | null | undefined): UserCartItem["status"] {
  if (
    value === "PENDING" ||
    value === "USED" ||
    value === "CANCELLED" ||
    value === "EXPIRED"
  ) {
    return value;
  }

  return "PENDING";
}

function mapRedeemRows(rows: UserRedeemApiRow[]): UserCartItem[] {
  return rows.map((row) => ({
    id: String(row.Reedeem_ID),
    image: row.Product_ImgUrl ?? "",
    name: row.Product_name ?? "Unknown reward",
    description: row.Product_Description ?? "",
    tokenPrice: row.Product_Price ?? 0,
    redeemedAt: formatRedeemedDate(row.Reedem_Date),
    timeLeft: "23h 45m",
    status: normalizeStatus(row.Redeem_Status),
  }));
}

export default function TokenMarketCartPage() {
  const router = useRouter();
  const [items, setItems] = useState<UserCartItem[]>([]);
  const [filter, setFilter] = useState<CartFilter>("ALL");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const filteredItems =
    filter === "ALL" ? items : items.filter((item) => item.status === filter);

  useEffect(() => {
    apiFetch("/user/Redeem")
      .then((res: unknown) => {
        setItems(mapRedeemRows((res as UserRedeemApiRow[] | null) ?? []));
        setError("");
      })
      .catch((err) => {
        logDevError("user-token-market-cart", err);

        if (err instanceof ApiError) {
          setError(err.message);
          return;
        }

        setError("Failed to load redeemed rewards");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function updateRedeemStatus(id: string, status: CartStatusAction) {
    try {
      await apiPatch(`/user/Redeem/${id}`, { status });
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
                timeLeft: status === "USED" ? "Used" : "Cancelled",
              }
            : item
        )
      );
    } catch (err) {
      logDevError("user-token-market-cart-status", err);
      throw err;
    }
  }

  return (
    <div className={styles.page}>
      <button
        className={styles.backButton}
        type="button"
        onClick={() => router.back()}
        aria-label="Go back to previous page"
      >
        <svg
          className={styles.backIcon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M15 18l-6-6 6-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
        </svg>
        <span>Back</span>
      </button>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Cart</h1>
          <p className={styles.description}>
            Rewards you have redeemed will appear here.
          </p>
        </div>

        <label className={styles.filterWrap}>
          <span className={styles.filterLabel}>Status</span>
          <select
            className={styles.filterSelect}
            value={filter}
            onChange={(event) => setFilter(event.target.value as CartFilter)}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      {loading ? <LoadingScreen /> : null}

      {!loading && error ? <p className={styles.error}>{error}</p> : null}

      {!loading && !error && items.length === 0 ? (
        <p className={styles.empty}>No redeemed rewards yet.</p>
      ) : null}

      {!loading && !error && items.length > 0 && filteredItems.length === 0 ? (
        <p className={styles.empty}>No rewards match this filter.</p>
      ) : null}

      {!loading && !error && filteredItems.length > 0 ? (
        <section className={styles.list} aria-label="Redeemed reward list">
          {filteredItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUse={() => setPendingAction({ item, action: "USED" })}
              onCancel={() => setPendingAction({ item, action: "CANCELLED" })}
            />
          ))}
        </section>
      ) : null}

      {pendingAction ? (
        <CartStatusConfirm
          item={pendingAction.item}
          action={pendingAction.action}
          onConfirm={updateRedeemStatus}
          onClose={() => setPendingAction(null)}
        />
      ) : null}
    </div>
  );
}
