import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a valid number",
  }),
  category: z.string().optional(),
  images: z.array(z.string()).optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>