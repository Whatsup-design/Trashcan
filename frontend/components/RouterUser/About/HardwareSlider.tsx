// components/user/About/HardwareSlider.tsx
// ─────────────────────────────────────────────────────────
// Photo slider 3-4 รูป พร้อม dot indicator
// ใช้ embla-carousel-react
// ─────────────────────────────────────────────────────────
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { HardwareSlide } from "@/lib/mockData/user/About";
import styles from "./HardwareSlider.module.css";

type Props = { slides: HardwareSlide[] };

export default function HardwareSlider({ slides }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [emblaRef, emblaApi]      = useEmblaCarousel({ loop: true, align: "center" });
  const timerRef                  = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Sync dot with slide ──────────────────────────────
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIdx(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // ── Auto play ────────────────────────────────────────
  const start = useCallback(() => {
    timerRef.current = setInterval(() => emblaApi?.scrollNext(), 5000);
  }, [emblaApi]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    start();
    emblaApi.on("pointerDown", stop);
    emblaApi.on("pointerUp",   start);
    return () => { stop(); };
  }, [emblaApi, start, stop]);

  return (
    <div className={styles.wrap} onMouseEnter={stop} onMouseLeave={start}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {slides.map((s) => (
            <div key={s.id} className={styles.slide}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt={s.caption ?? ""} className={styles.img} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className={styles.dots}>
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`${styles.dot} ${activeIdx === i ? styles.dotActive : ""}`}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}