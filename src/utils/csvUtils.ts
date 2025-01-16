import Papa from 'papaparse'
import { toast } from 'sonner'
import { ProductCSVRow } from '@/types/product'

export const generateTemplate = () => {
  const headers = [
    'name',
    'description',
    'in_town_price',
    'shipping_price',
    'category',
    'status',
    'stock_number'
  ]
  
  return Papa.unparse([headers])
}

export const exportProducts = (products: any[]) => {
  const exportData = products.map(product => ({
    name: product.name || '',
    description: product.description || '',
    in_town_price: product.in_town_price?.toString() || '0',
    shipping_price: product.shipping_price?.toString() || '0',
    category: Array.isArray(product.category) ? product.category.join(', ') : '',
    status: product.status || 'active',
    stock_number: product.stock_number || ''
  }))

  const csv = Papa.unparse(exportData)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'products.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

interface ParsedProduct extends Omit<ProductCSVRow, 'category'> {
  category: string;
}

export const parseAndValidateCSV = (file: File): Promise<ProductCSVRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log("Parsed CSV data:", results.data)
        const validProducts: ProductCSVRow[] = []
        const errors: string[] = []

        results.data.forEach((row: any, index: number) => {
          try {
            // Required field validation - only name is required
            if (!row.name?.trim()) {
              throw new Error(`Missing product name at row ${index + 1}`)
            }

            // Convert and validate numeric fields with defaults
            const in_town_price = row.in_town_price ? 
              parseFloat(row.in_town_price.toString()) : 
              0
            
            const shipping_price = row.shipping_price ? 
              parseFloat(row.shipping_price.toString()) : 
              0

            // Only validate numeric fields if they're provided
            if (row.in_town_price && isNaN(in_town_price)) {
              throw new Error(`Invalid in-town price at row ${index + 1}`)
            }
            if (row.shipping_price && isNaN(shipping_price)) {
              throw new Error(`Invalid shipping price at row ${index + 1}`)
            }

            // Status validation with default
            const status = row.status?.toLowerCase() || 'active'
            if (row.status && status !== 'active' && status !== 'inactive') {
              throw new Error(`Invalid status at row ${index + 1}. Must be either 'active' or 'inactive'`)
            }

            // Convert category string to array, empty array if not provided
            const category = row.category ? 
              row.category.split(',').map((c: string) => c.trim()).filter(Boolean) : 
              []

            validProducts.push({
              name: row.name.trim(),
              description: row.description?.trim() || undefined,
              in_town_price,
              shipping_price,
              category,
              status: status as 'active' | 'inactive',
              stock_number: row.stock_number?.trim() || undefined
            })

            console.log(`Validated product at row ${index + 1}:`, validProducts[validProducts.length - 1])
          } catch (error) {
            if (error instanceof Error) {
              errors.push(error.message)
            }
          }
        })

        if (errors.length > 0) {
          console.error("CSV validation errors:", errors)
          toast.error(`Validation errors in CSV: ${errors.join(', ')}`)
          reject(new Error('CSV validation failed'))
          return
        }

        if (validProducts.length === 0) {
          console.error("No valid products found in CSV")
          toast.error('No valid products found in CSV')
          reject(new Error('No valid products found in CSV'))
          return
        }

        console.log("Successfully validated products:", validProducts)
        resolve(validProducts)
      },
      error: (error) => {
        console.error('Error parsing CSV:', error)
        toast.error('Failed to parse CSV file')
        reject(new Error('Failed to parse CSV file'))
      }
    })
  })
}