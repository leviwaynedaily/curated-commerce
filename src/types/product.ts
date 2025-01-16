export type ProductStatus = "active" | "inactive" | "all";

export interface ProductCSVRow {
  name: string;
  description?: string;
  in_town_price: string;
  shipping_price: string;
  category?: string;
  status?: string;
  stock_number?: string;
}