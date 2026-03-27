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


export const INITIAL_COUPONS: Coupon[] = [
  { id: "1", picture: "", name: "Free Coffee",    description: "Redeem for 1 free coffee at the school canteen", status: "permanent", claimPerMonth: 2, price: 20 },
  { id: "2", picture: "", name: "Sports Day Pass", description: "Free entry to the annual sports day event",       status: "temporary", dateFrom: "2025-03-01", dateTo: "2025-03-31", claimPerMonth: 1, price: 50 },
  { id: "3", picture: "", name: "Stationery Set",  description: "1 set of school stationery (pen, pencil, ruler)", status: "permanent", claimPerMonth: 1, price: 30 },
];