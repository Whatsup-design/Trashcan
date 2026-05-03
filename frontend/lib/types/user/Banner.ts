export type UserBannerApiRow = {
  Banner_ID: number;
  Banner_Img: string | null;
  Banner_ImgUrl: string | null;
  Banner_IsActive: boolean;
  created_at: string;
  updated_at: string;
};

export type UserBannerItem = {
  id: string;
  image: string;
  alt: string;
  title?: string;
  subtitle?: string;
};
