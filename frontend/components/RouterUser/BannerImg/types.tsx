// components/user/Banner/types.ts

export type BannerItem = {
  id: string;
  image: string;      // path ใน public/ เช่น "/banners/banner1.jpg"
  alt: string;
  title?: string;     // optional overlay text
  subtitle?: string;
};