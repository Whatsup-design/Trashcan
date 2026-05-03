"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper/types";
import type { UserBannerItem } from "@/lib/types/user/Banner";
import styles from "./BannerCarousel.module.css";
import "swiper/css";

const DESKTOP_BREAKPOINT = 768;
const DESKTOP_SLIDES_VISIBLE = 3;
const MIN_LOOPABLE_SLIDES = DESKTOP_SLIDES_VISIBLE + 1;

type Props = {
  banners: UserBannerItem[];
  autoPlayDelay?: number;
};

function buildLoopableBanners(items: UserBannerItem[]) {
  if (items.length === 0) {
    return [];
  }

  if (items.length >= MIN_LOOPABLE_SLIDES) {
    return items;
  }

  return Array.from({ length: MIN_LOOPABLE_SLIDES }, (_, index) => {
    const source = items[index % items.length];
    return {
      ...source,
      id: `${source.id}-loop-${index}`,
    };
  });
}

export default function BannerCarousel({ banners, autoPlayDelay = 6000 }: Props) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const renderedBanners = useMemo(() => buildLoopableBanners(banners), [banners]);

  if (renderedBanners.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.realIndex);
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        loop={renderedBanners.length > 1}
        autoplay={{
          delay: autoPlayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={650}
        slidesPerView={1}
        slidesPerGroup={1}
        spaceBetween={0}
        breakpoints={{
          [DESKTOP_BREAKPOINT]: {
            slidesPerView: DESKTOP_SLIDES_VISIBLE,
            slidesPerGroup: 1,
          },
        }}
        className={styles.swiperRoot}
      >
        {renderedBanners.map((banner) => (
          <SwiperSlide key={banner.id} className={styles.swiperSlide}>
            <div className={styles.imgWrap}>
              <Image
                src={banner.image}
                alt={banner.alt}
                fill
                className={styles.img}
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={banner.id === renderedBanners[0]?.id}
              />
              {banner.title && (
                <div className={styles.overlay}>
                  <p className={styles.overlayTitle}>{banner.title}</p>
                  {banner.subtitle && (
                    <p className={styles.overlaySub}>{banner.subtitle}</p>
                  )}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {banners.length > 1 && (
        <div className={styles.dots}>
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ""}`}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
