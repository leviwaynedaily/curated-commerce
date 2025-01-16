import Papa from 'papaparse'
import { toast } from 'sonner'

interface ProductCSVRow {
  name: string
  description?: string
  in_town_price?: string | number
  shipping_price?: string | number
  category?: string
  status?: 'active' | 'inactive'
  stock_number?: string
}

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
    in_town_price: product.in_town_price || '0',
    shipping_price: product.shipping_price || '0',
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

export const parseAndValidateCSV = (file: File): Promise<ProductCSVRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validProducts: ProductCSVRow[] = []
        const errors: string[] = []

        results.data.forEach((row: any, index: number) => {
          try {
            // Convert empty strings to null or appropriate default values
            const category = row.category ? row.category.split(',').map((c: string) => c.trim()) : []
            
            // Validate and convert numeric fields
            const in_town_price = row.in_town_price ? parseFloat(row.in_town_price) : 0
            const shipping_price = row.shipping_price ? parseFloat(row.shipping_price) : 0

            if (isNaN(in_town_price)) {
              throw new Error(`Invalid in-town price at row ${index + 1}`)
            }
            if (isNaN(shipping_price)) {
              throw new Error(`Invalid shipping price at row ${index + 1}`)
            }

            // Required field validation
            if (!row.name) {
              throw new Error(`Missing product name at row ${index + 1}`)
            }

            // Status validation
            const status = row.status?.toLowerCase() || 'active'
            if (status !== 'active' && status !== 'inactive') {
              throw new Error(`Invalid status at row ${index + 1}. Must be either 'active' or 'inactive'`)
            }

            validProducts.push({
              name: row.name,
              description: row.description || null,
              in_town_price,
              shipping_price,
              category,
              status,
              stock_number: row.stock_number || null
            })
          } catch (error) {
            if (error instanceof Error) {
              errors.push(error.message)
            }
          }
        })

        if (errors.length > 0) {
          toast.error(`Validation errors in CSV: ${errors.join(', ')}`)
          reject(new Error('CSV validation failed'))
          return
        }

        if (validProducts.length === 0) {
          reject(new Error('No valid products found in CSV'))
          return
        }

        resolve(validProducts)
      },
      error: (error) => {
        console.error('Error parsing CSV:', error)
        reject(new Error('Failed to parse CSV file'))
      }
    })
  })
}