import { Badge } from "@/components/ui/badge"

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
        return 'w-full h-[360px]'
      case 'large':
        return 'w-full h-[480px]'
      case 'list':
        return 'w-full h-[200px] flex'
      default: // medium
        return 'w-full h-[420px]'
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
          <div className={`relative ${layout === 'list' ? 'w-1/3' : 'w-full'} h-3/5`}>
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
          
          <div className="p-4 space-y-3">
            <h3 
              className="font-bold line-clamp-1 transition-colors"
              style={{ 
                color: productTitleTextColor,
                fontSize: layout === 'small' ? '0.875rem' : '1rem'
              }}
            >
              {product.name}
            </h3>

            <div 
              className="inline-block rounded-full px-4 py-1.5"
              style={{ 
                backgroundColor: `${productPriceColor}15`,
                color: productPriceColor
              }}
            >
              <span className="font-semibold">
                {formatPrice(product.in_town_price)}
              </span>
              {product.shipping_price > 0 && (
                <span className="text-xs ml-1 opacity-75">
                  +{formatPrice(product.shipping_price)} ship
                </span>
              )}
            </div>

            {product.description && (
              <p 
                className="text-xs line-clamp-2 group-hover:line-clamp-3 transition-all duration-300"
                style={{ 
                  color: productDescriptionTextColor,
                  opacity: 0.85
                }}
              >
                {product.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}