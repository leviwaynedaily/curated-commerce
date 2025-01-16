import { z } from "zod"
import { productFormSchema } from "@/components/products/ProductFormTypes"
import Papa from "papaparse"
import { toast } from "sonner"
import { ProductCSVRow } from "@/types/product"

export const CSV_HEADERS = [
  "name",
  "description",
  "in_town_price",
  "shipping_price",
  "category",
  "status",
  "stock_number"
]

export const generateTemplate = () => {
  return Papa.unparse({
    fields: CSV_HEADERS,
    data: []
  })
}

export const exportProducts = (products: any[]) => {
  const csvData = products.map(product => ({
    name: product.name,
    description: product.description || "",
    in_town_price: product.in_town_price,
    shipping_price: product.shipping_price,
    category: (product.category || []).join(", "),
    status: product.status,
    stock_number: product.stock_number || ""
  }))

  const csv = Papa.unparse({
    fields: CSV_HEADERS,
    data: csvData
  })

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `products_export_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const parseAndValidateCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<ProductCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const headers = results.meta.fields || []
          const missingHeaders = CSV_HEADERS.filter(h => !headers.includes(h))
          if (missingHeaders.length > 0) {
            throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
          }

          const validProducts = []
          for (const row of results.data) {
            try {
              const categoryArray = row.category
                ? row.category.split(",").map((c: string) => c.trim()).filter(Boolean)
                : []

              const productData = {
                name: row.name,
                description: row.description,
                in_town_price: row.in_town_price,
                shipping_price: row.shipping_price,
                category: categoryArray,
                status: row.status || "active",
                stock_number: row.stock_number,
              }

              const validated = productFormSchema.parse(productData)
              validProducts.push(validated)
            } catch (error) {
              console.error("Row validation error:", error)
              toast.error(`Error in row ${results.data.indexOf(row) + 1}: Invalid data`)
            }
          }

          resolve(validProducts)
        } catch (error) {
          console.error("CSV validation error:", error)
          reject(error)
        }
      },
      error: (error) => {
        console.error("CSV parsing error:", error)
        reject(error)
      }
    })
  })
}