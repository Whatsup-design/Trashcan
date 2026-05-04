"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CouponForm from "./CouponForm";
import CloseConfirm from "./CloseConfirm";
import type { CouponFormData } from "../../../../lib/mockData/admin/Coupon";
import styles from "./CouponSlidePanel.module.css";

type Props = {
  initialDraft?: CouponFormData | null;
  onSubmit: (data: CouponFormData) => Promise<void> | void;
  onSaveDraft: (data: CouponFormData) => void;
  onDiscardDraft: () => void;
  onClose: () => void;
};

function isDraftDirty(data: CouponFormData | null) {
  if (!data) return false;

  return Boolean(
    data.Product_name.trim() ||
      data.Product_Description.trim() ||
      data.Product_ImgUrl ||
      data.Product_ImgFile ||
      data.Product_Limited ||
      data.Product_Price !== 10 ||
      data.Product_limit !== 1 ||
      data.Product_StartDate ||
      data.Product_EndDate
  );
}

export default function CouponAddPanel({
  initialDraft,
  onSubmit,
  onSaveDraft,
  onDiscardDraft,
  onClose,
}: Props) {
  const [animateIn, setAnimateIn] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [draftData, setDraftData] = useState<CouponFormData | null>(
    initialDraft ?? null
  );
  const [submitError, setSubmitError] = useState("");
  const formId = "coupon-add-form";

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  function closeWithTransition() {
    setAnimateIn(false);
    setIsClosing(true);
    window.setTimeout(onClose, 280);
  }

  function requestClose() {
    if (isDraftDirty(draftData)) {
      setShowCloseConfirm(true);
      return;
    }

    closeWithTransition();
  }

  function handleDiscard() {
    onDiscardDraft();
    closeWithTransition();
  }

  function handleSaveDraft() {
    if (draftData) {
      onSaveDraft(draftData);
    }
    closeWithTransition();
  }

  async function handleSubmit(data: CouponFormData) {
    try {
      setSubmitError("");
      await onSubmit(data);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to add coupon");
      throw error;
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        className={`${styles.backdrop} ${animateIn ? styles.backdropOpen : ""}`}
        onClick={closeWithTransition}
      />

      <div
        className={`${styles.panel} ${animateIn ? styles.panelOpen : ""} ${
          isClosing ? styles.panelClosing : ""
        }`}
      >
        <div className={styles.panelHeader}>
          <p className={styles.panelTitle}>Add Coupon</p>
          <button className={styles.closeBtn} onClick={requestClose} aria-label="Close">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={styles.panelBody}>
          <CouponForm
            initialData={initialDraft ?? undefined}
            formId={formId}
            submitError={submitError}
            onSubmit={handleSubmit}
            onCancel={requestClose}
            onDraftChange={setDraftData}
          />
        </div>
      </div>

      {showCloseConfirm ? (
        <CloseConfirm
          formId={formId}
          onClose={() => setShowCloseConfirm(false)}
          onDiscard={handleDiscard}
          onSaveDraft={handleSaveDraft}
        />
      ) : null}
    </>,
    document.body
  );
}
