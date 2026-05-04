export type UserMarketProduct = {
  id: string;
  image: string;
  name: string;
  description: string;
  status: "permanent" | "temporary";
  dateFrom?: string;
  dateTo?: string;
  claimPerMonth: number;
  redeemedThisMonth: number;
  remainingThisMonth: number;
  canRedeem: boolean;
  price: number;
};

export type UserMarketApiRow = {
  Product_ID: number;
  Product_name: string;
  Product_Description: string | null;
  Product_Price: number;
  Product_Status: "Permanent" | "Temporary";
  Product_limit: number;
  Product_ImgUrl: string | null;
  Product_StartDate?: string | null;
  Product_EndDate?: string | null;
  redeemedThisMonth?: number;
  remainingThisMonth?: number;
  canRedeem?: boolean;
};
