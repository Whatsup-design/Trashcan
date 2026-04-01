export type ProductStatus = "Permanent" | "Temporary";

export type Coupon = {
  Product_ID: number;
  Product_name: string;
  Product_Description: string;
  Product_Price: number;
  Product_Status: ProductStatus;
  Product_limit: number;
  Product_ImgUrl: string | null;
  Product_StartDate?: string;
  Product_EndDate?: string;
};

export type CouponFormData = Omit<Coupon, "Product_ID">;

export const INITIAL_COUPONS: Coupon[] = [
  {
    Product_ID: 1,
    Product_name: "Free Coffee",
    Product_Description: "Redeem for 1 free coffee at the school canteen",
    Product_Price: 20,
    Product_Status: "Permanent",
    Product_limit: 2,
    Product_ImgUrl: null,
  },
  {
    Product_ID: 2,
    Product_name: "Stationary",
    Product_Description: "This is the Stationary",
    Product_Price: 10,
    Product_Status: "Temporary",
    Product_limit: 2,
    Product_ImgUrl: null,
    Product_StartDate: "2026-04-01",
    Product_EndDate: "2026-04-29",
  },
];
