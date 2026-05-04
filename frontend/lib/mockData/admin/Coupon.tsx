export type Coupon = {
  Product_ID: number;
  Product_name: string;
  Product_Description: string;
  Product_Price: number;
  Product_Limited: boolean;
  Product_limit: number;
  Product_Img?: string | null;
  Product_ImgUrl: string | null;
  Product_StartDate?: string;
  Product_EndDate?: string;
};

export type CouponFormData = Omit<Coupon, "Product_ID"> & {
  Product_ImgFile?: File | null;
  removeImage?: boolean;
};

export const INITIAL_COUPONS: Coupon[] = [
  {
    Product_ID: 1,
    Product_name: "Free Coffee",
    Product_Description: "Redeem for 1 free coffee at the school canteen",
    Product_Price: 20,
    Product_Limited: false,
    Product_limit: 2,
    Product_ImgUrl: null,
  },
  {
    Product_ID: 2,
    Product_name: "Stationary",
    Product_Description: "This is the Stationary",
    Product_Price: 10,
    Product_Limited: true,
    Product_limit: 2,
    Product_ImgUrl: null,
    Product_StartDate: "2026-04-01",
    Product_EndDate: "2026-04-29",
  },
];
