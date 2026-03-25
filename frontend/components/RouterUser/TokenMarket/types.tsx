// components/user/Market/types.ts

export type Product = {
  id: string;
  image: string;
  name: string;
  description: string;
  status: "permanent" | "temporary";
  dateFrom?: string;
  dateTo?: string;
  claimPerMonth: number;
  price: number;        // tokens
};