// components/tokens/coupon/types.ts
// Shared types สำหรับทุก coupon component

export type CouponStatus = "permanent" | "temporary";

export type Coupon = {
  id: string;
  picture: string;
  name: string;
  description: string;
  status: CouponStatus;
  dateFrom?: string;        // เฉพาะ temporary (YYYY-MM-DD)
  dateTo?: string;
  claimPerMonth: number;
  price: number;            // ราคาเป็น token (ชื่อเดียวกันทั้งหมด)
};

// สำหรับ form (omit id เพราะ generate เอง)
export type CouponFormData = Omit<Coupon, "id">;