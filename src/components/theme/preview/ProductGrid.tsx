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

  const getTextPlacementStyles = (product: any) => {
    if (textPlacement === 'below') {
      return {
        imageContainer: layout === 'small' ? "h-3/4" : "h-4/5",
        textContainer: `p-3 flex flex-col justify-between flex-grow`,
        overlay: "hidden",
        priceContainer: "absolute bottom-3 right-3"
      }
    } else {
      return {
        imageContainer: "h-full",
        textContainer: "absolute bottom-0 left-0 right-0 p-3",
        overlay: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent",
        priceContainer: "absolute top-3 right-3"
      }
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
      {products?.map((product) => {
        const styles = getTextPlacementStyles(product)
        
        return (
          <div 
            key={product.id}
            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)] transform hover:scale-[1.02] rounded-lg ${getCardDimensions()}`}
            onClick={() => onProductClick(product)}
            style={{ backgroundColor: productCardBackgroundColor }}
          >
            {product.images?.[0] && (
              <div className={`relative ${layout === 'list' ? 'w-1/3' : 'w-full'} ${styles.imageContainer}`}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                />
                <div className={styles.overlay} />
                
                {/* Price Badge */}
                <div className={styles.priceContainer}>
                  <div 
                    className="backdrop-blur-md rounded-full px-4 py-2 font-semibold shadow-lg transform transition-transform group-hover:scale-110"
                    style={{ 
                      backgroundColor: `${productPriceColor}dd`,
                      color: '#FFFFFF'
                    }}
                  >
                    {formatPrice(product.in_town_price)}
                  </div>
                  {product.shipping_price > 0 && (
                    <div 
                      className="mt-2 text-xs backdrop-blur-md rounded-full px-3 py-1 text-center"
                      style={{ 
                        backgroundColor: `${productPriceColor}99`,
                        color: '#FFFFFF'
                      }}
                    >
                      +{formatPrice(product.shipping_price)} ship
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div 
              className={`${layout === 'list' ? 'flex-1 flex flex-col justify-between' : ''} ${styles.textContainer}`}
            >
              <div>
                {product.category && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs mb-1.5 ${textPlacement === 'overlay' ? 'bg-transparent border-white/40 text-white' : ''}`}
                    style={{
                      backgroundColor: productCategoryBackgroundColor,
                      color: productCategoryTextColor,
                      borderColor: 'transparent'
                    }}
                  >
                    {product.category}
                  </Badge>
                )}
                <h3 
                  className="font-medium mb-0.5 line-clamp-1 transition-colors"
                  style={{ 
                    color: textPlacement === 'overlay' ? '#fff' : productTitleTextColor,
                    fontSize: layout === 'small' ? '0.875rem' : '1rem'
                  }}
                >
                  {product.name}
                </h3>
                {product.description && (
                  <p 
                    className="line-clamp-1 opacity-85 group-hover:line-clamp-2 transition-all duration-300"
                    style={{ 
                      color: textPlacement === 'overlay' ? '#fff' : productDescriptionTextColor,
                      fontSize: layout === 'small' ? '0.75rem' : '0.875rem'
                    }}
                  >
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}