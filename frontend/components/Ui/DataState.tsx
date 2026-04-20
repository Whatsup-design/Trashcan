"use client";

import type { ReactNode } from "react";
import LoadingScreen from "./Loadingscreen";

type Props = {
  loading: boolean;
  error?: string;
  isEmpty?: boolean;
  emptyText?: string;
  onRetry?: () => void;
  children: ReactNode;
};

export default function DataState({
  loading,
  error,
  isEmpty = false,
  emptyText = "No data",
  onRetry,
  children,
}: Props) {
  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        {onRetry ? <button onClick={onRetry}>Try again</button> : null}
      </div>
    );
  }

  if (isEmpty) {
    return <div>{emptyText}</div>;
  }

  return <>{children}</>;
}
