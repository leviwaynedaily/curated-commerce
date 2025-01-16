export type ProductStatus = "active" | "inactive" | "all";

export interface ProductCSVRow {
  name: string;
  description?: string;
  in_town_price: number;
  shipping_price: number;
  category?: string[];
  status?: "active" | "inactive";
  stock_number?: string;
}