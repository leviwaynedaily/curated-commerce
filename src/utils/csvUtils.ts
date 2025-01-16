import { z } from "zod"
import { productFormSchema } from "@/components/products/ProductFormTypes"
import Papa from "papaparse"
import { toast } from "sonner"

// CSV template headers based on product schema
export const CSV_HEADERS = [
  "name",
  "description",
  "in_town_price",
  "shipping_price",
  "category",
  "status",
  "stock_number"
]

// Generate empty template
export const generateTemplate = () => {
  return Papa.unparse({
    fields: CSV_HEADERS,
    data: []
  })
}

// Export products to CSV
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

  // Create and trigger download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `products_export_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Parse and validate CSV data
export const parseAndValidateCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Validate headers
          const headers = results.meta.fields || []
          const missingHeaders = CSV_HEADERS.filter(h => !headers.includes(h))
          if (missingHeaders.length > 0) {
            throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
          }

          // Validate and transform each row
          const validProducts = []
          for (const row of results.data) {
            try {
              // Transform category string to array
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

              // Validate against schema
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