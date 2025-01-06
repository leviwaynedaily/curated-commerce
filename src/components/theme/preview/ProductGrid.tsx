import { Badge } from "@/components/ui/badge"
import { Home, Truck } from "lucide-react"

interface ProductGridProps {
  products: any[]
  layout: string
  textPlacement: string
  onProductClick: (product: any) => void
  mainColor: string
  fontColor: string
  productCardBackgroundColor: string
  productTitleTextColor: string
  productDescriptionTextColor: string
  productPriceColor: string
  productPriceButtonColor: string
  productCategoryBackgroundColor: string
  productCategoryTextColor: string
}

export function ProductGrid({ 
  products, 
  layout, 
  textPlacement,
  onProductClick,
  productCardBackgroundColor,
  productTitleTextColor,
  productDescriptionTextColor,
  productPriceColor,
  productPriceButtonColor,
  productCategoryBackgroundColor,
  productCategoryTextColor
}: ProductGridProps) {
  const getGridStyles = () => {
    switch (layout) {
      case 'small':
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
      case 'large':
        return 'grid-cols-1 md:grid-cols-2 gap-6'
      case 'list':
        return 'grid-cols-1 gap-6'
      default: // medium
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    }
  }

  const getCardDimensions = () => {
    switch (layout) {
      case 'small':
        return 'w-full h-[300px]' // Reduced height since we're showing less content
      case 'large':
        return 'w-full h-[400px]'
      case 'list':
        return 'w-full h-[200px] flex'
      default: // medium
        return 'w-full h-[350px]'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className={`grid ${getGridStyles()} auto-rows-auto`}>
      {products?.map((product) => (
        <div 
          key={product.id}
          className={`group relative overflow-hidden transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)] transform hover:scale-[1.02] rounded-lg ${getCardDimensions()}`}
          onClick={() => onProductClick(product)}
          style={{ backgroundColor: productCardBackgroundColor }}
        >
          <div className={`relative ${layout === 'list' ? 'w-1/3' : 'w-full'} h-4/5`}>
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
              />
            )}
            
            {product.category && (
              <div className="absolute top-3 left-3 z-10">
                <Badge 
                  variant="outline"
                  className="text-xs backdrop-blur-md bg-opacity-70"
                  style={{
                    backgroundColor: `${productCategoryBackgroundColor}CC`,
                    color: productCategoryTextColor,
                    borderColor: 'transparent'
                  }}
                >
                  {product.category}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm">
            <div className="flex flex-wrap gap-2 justify-center">
              <div 
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white/90"
                style={{ color: productPriceColor }}
              >
                <Home className="h-3.5 w-3.5" />
                <span className="text-sm font-semibold whitespace-nowrap">
                  {formatPrice(product.in_town_price)}
                </span>
              </div>

              {product.shipping_price > 0 && (
                <div 
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white/90"
                  style={{ color: productPriceColor }}
                >
                  <Truck className="h-3.5 w-3.5" />
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {formatPrice(product.shipping_price)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}