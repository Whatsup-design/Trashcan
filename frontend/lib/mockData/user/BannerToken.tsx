// components/user/Banner/types.ts

export type BannerItem = {
  id: string;
  image: string;      // path ใน public/ เช่น "/banners/banner1.jpg"
  alt: string;
  title?: string;     // optional overlay text
  subtitle?: string;
};

// components/user/Market/types.ts

export type Product = {
  id: string;
  image: string;
  name: string;
  description: string;
  isLimited: boolean;
  dateFrom?: string;
  dateTo?: string;
  claimPerMonth: number;
  price: number;        // tokens
};

{/*MockData User Banner */}

const BANNERS: BannerItem[] = [
  { id: "1", image: "/BannerImg/imgTest_1.jpg", alt: "Banner 1", title: "Collect bottles, earn tokens!", subtitle: "Drop at any Trashcan Smart" },
  { id: "2", image: "/BannerImg/imgTest_2.jpg", alt: "Banner 2", title: "Redeem your tokens",           subtitle: "Exchange for amazing rewards" },
  { id: "3", image: "/BannerImg/imgTest_3.jpg", alt: "Banner 3", title: "Sports Day Pass",              subtitle: "Limited time — ends March 31" },
  { id: "4", image: "/BannerImg/imgTest_4.jpg", alt: "Banner 4", title: "Free Coffee",                  subtitle: "Only 20 tokens" },
  { id: "5", image: "/BannerImg/imgTest_5.jpg", alt: "Banner 5", title: "New rewards added",            subtitle: "Check out the latest" },
];

// ── Mockup products ───────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: "1", image: "", name: "Free Coffee",      description: "Redeem for 1 free coffee at the school canteen", isLimited: false, claimPerMonth: 2, price: 20 },
  { id: "2", image: "", name: "Sports Day Pass",  description: "Free entry to the annual sports day event",      isLimited: true,  dateFrom: "2025-03-01", dateTo: "2025-03-31", claimPerMonth: 1, price: 50 },
  { id: "3", image: "", name: "Stationery Set",   description: "1 set of school stationery (pen, pencil, ruler)", isLimited: false, claimPerMonth: 1, price: 30 },
  { id: "4", image: "", name: "Movie Ticket",     description: "1 free movie ticket at the school cinema",        isLimited: true,  dateFrom: "2025-04-01", dateTo: "2025-04-30", claimPerMonth: 1, price: 80 },
  { id: "5", image: "", name: "Canteen Voucher",  description: "50 baht canteen voucher",                         isLimited: false, claimPerMonth: 3, price: 40 },
  { id: "6", image: "", name: "Library Pass",     description: "Priority borrowing pass for 1 week",             isLimited: false, claimPerMonth: 2, price: 15 },
  { id: "7", image: "", name: "PE Class Skip",    description: "Skip 1 PE class (with teacher approval)",         isLimited: true,  dateFrom: "2025-03-15", dateTo: "2025-05-15", claimPerMonth: 1, price: 100 },
  { id: "8", image: "", name: "School Badge",     description: "Exclusive eco-warrior school badge",              isLimited: false, claimPerMonth: 1, price: 60 },
];

export default {BANNERS, PRODUCTS}
