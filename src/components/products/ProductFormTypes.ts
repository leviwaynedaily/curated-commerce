import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  in_town_price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "In-town price must be a valid number",
  }),
  shipping_price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Shipping price must be a valid number",
  }),
  category: z.string().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive"]).default("active"),
})

export type ProductFormValues = z.infer<typeof productFormSchema>