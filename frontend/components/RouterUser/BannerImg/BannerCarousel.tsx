// components/user/Banner/BannerCarousel.tsx
// ─────────────────────────────────────────────────────────
// Banner carousel ใช้ embla-carousel-react
// Desktop: แสดง 3 ใบ, Mobile: แสดง 1 ใบ
// ถ้ารูป < 4 บน desktop → ไม่ loop, ซ่อน dots ที่เกิน
// Mobile ยัง loop ปกติเสมอ
// Auto slide ทุก 6 วิ หยุดเมื่อ user interact
// ─────────────────────────────────────────────────────────
"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import type { BannerItem } from "../../../lib/mockData/user/BannerToken";
import styles from "./BannerCarousel.module.css";

const DESKTOP_SLIDES_VISIBLE = 3;
const DESKTOP_BREAKPOINT     = 768;

type Props = {
  banners: BannerItem[];
  autoPlayDelay?: number;
};

export default function BannerCarousel({ banners, autoPlayDelay = 6000 }: Props) {
  const [isMobile,   setIsMobile]   = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // ── เช็คขนาดหน้าจอ ────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < DESKTOP_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── ถ้า desktop และรูปน้อยกว่า 4 → ไม่ loop ───────────
  // ถ้า mobile → loop เสมอ
  const shouldLoop = isMobile
    ? true
    : banners.length > DESKTOP_SLIDES_VISIBLE;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop:           shouldLoop,
    align:          "start",
    dragFree:       false,
    slidesToScroll: 1,
  });

  // ── Dot active state ──────────────────────────────────
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // ── Auto play ─────────────────────────────────────────
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoverRef = useRef(false);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    timerRef.current = setInterval(() => {
      if (!isHoverRef.current && emblaApi) {
        // ถ้าไม่ loop และอยู่ slide สุดท้าย → ไม่เลื่อน
        if (!shouldLoop && !emblaApi.canScrollNext()) return;
        emblaApi.scrollNext();
      }
    }, autoPlayDelay);
  }, [emblaApi, autoPlayDelay, shouldLoop, stopAutoPlay]);

  const resumeAutoPlay = useCallback(() => {
    setTimeout(() => startAutoPlay(), autoPlayDelay * 1.5);
  }, [startAutoPlay, autoPlayDelay]);

  useEffect(() => {
    if (!emblaApi) return;
    startAutoPlay();
    emblaApi.on("pointerDown", stopAutoPlay);
    emblaApi.on("pointerUp",   resumeAutoPlay);
    return () => {
      stopAutoPlay();
      emblaApi.off("pointerDown", stopAutoPlay);
      emblaApi.off("pointerUp",   resumeAutoPlay);
    };
  }, [emblaApi, startAutoPlay, stopAutoPlay, resumeAutoPlay]);

  // ── Dots count ────────────────────────────────────────
  // Desktop: ถ้าไม่ loop แสดง dot ไม่เกิน (total - visible + 1)
  // Mobile: แสดง dot ทุกใบ
  const dotsCount = isMobile
    ? banners.length
    : shouldLoop
      ? banners.length
      : Math.max(1, banners.length - DESKTOP_SLIDES_VISIBLE + 1);

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => { isHoverRef.current = true; }}
      onMouseLeave={() => { isHoverRef.current = false; }}
    >
      {/* embla viewport */}
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {banners.map((banner) => (
            <div key={banner.id} className={styles.slide}>
              {/* 16:10 ratio */}
              <div className={styles.imgWrap}>
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  className={styles.img}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={banner.id === banners[0].id}
                />
                {/* Overlay text */}
                {banner.title && (
                  <div className={styles.overlay}>
                    <p className={styles.overlayTitle}>{banner.title}</p>
                    {banner.subtitle && (
                      <p className={styles.overlaySub}>{banner.subtitle}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dots ──────────────────────────────────────── */}
      {dotsCount > 1 && (
        <div className={styles.dots}>
          {Array.from({ length: dotsCount }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${activeIndex === i ? styles.dotActive : ""}`}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}