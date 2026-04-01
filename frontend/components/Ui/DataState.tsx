"use client";

import type { ReactNode } from "react";
import LoadingScreen from "./Loadingscreen";

type Props = {
  loading: boolean;
  error?: string;
  isEmpty?: boolean;
  emptyText?: string;
  children: ReactNode;
};

export default function DataState({
  loading,
  error,
  isEmpty = false,
  emptyText = "No data",
  children,
}: Props) {
  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (isEmpty) {
    return <div>{emptyText}</div>;
  }

  return <>{children}</>;
}
