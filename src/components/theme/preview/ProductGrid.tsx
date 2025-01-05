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
  const getGridColumns = () => {
    switch (layout) {
      case 'small':
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
      case 'large':
        return 'grid-cols-1 md:grid-cols-2'
      case 'list':
        return 'grid-cols-1'
      default: // medium
        return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    }
  }

  const getCardSize = () => {
    switch (layout) {
      case 'small':
        return 'aspect-[3/5]'
      case 'large':
        return 'aspect-video'
      case 'list':
        return 'min-h-[20rem] md:min-h-[24rem]'
      default: // medium
        return 'aspect-[2/3]'
    }
  }

  const getTextPlacementStyles = (product: any) => {
    if (textPlacement === 'below') {
      return {
        imageContainer: "h-3/5 relative",
        textContainer: `p-4 flex flex-col justify-between flex-grow`,
        overlay: "hidden"
      }
    } else {
      return {
        imageContainer: "h-full relative",
        textContainer: "absolute bottom-0 left-0 right-0 p-4",
        overlay: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
      }
    }
  }

  return (
    <div className={`grid ${getGridColumns()} gap-4`}>
      {products?.map((product) => {
        const styles = getTextPlacementStyles(product)
        
        return (
          <div 
            key={product.id}
            className={`group relative rounded-lg overflow-hidden transition-all duration-200 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)] transform hover:scale-[1.01] ${getCardSize()} ${layout === 'list' ? 'flex' : ''}`}
            onClick={() => onProductClick(product)}
            style={{ backgroundColor: productCardBackgroundColor }}
          >
            {product.images?.[0] && (
              <div className={`${layout === 'list' ? 'w-1/3' : 'w-full'} ${styles.imageContainer}`}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className={styles.overlay} />
              </div>
            )}
            
            <div 
              className={`${layout === 'list' ? 'flex-1 flex flex-col justify-between' : 'flex flex-col h-2/5'} ${styles.textContainer}`}
            >
              <div>
                <div className="flex gap-2 flex-wrap mb-2">
                  {product.category && (
                    <Badge 
                      variant="outline" 
                      className={textPlacement === 'overlay' ? 'bg-transparent border-white/40 text-white' : ''}
                      style={{
                        backgroundColor: productCategoryBackgroundColor,
                        color: productCategoryTextColor,
                        borderColor: 'transparent'
                      }}
                    >
                      {product.category}
                    </Badge>
                  )}
                </div>
                <h3 
                  className="text-sm font-medium mb-1 line-clamp-2"
                  style={{ 
                    color: productTitleTextColor,
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                    fontSize: '14px'
                  }}
                >
                  {product.name}
                </h3>
                {product.description && (
                  <p 
                    className="font-open-sans text-xs sm:text-sm line-clamp-2 mb-2"
                    style={{ 
                      color: productDescriptionTextColor,
                      fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                      fontSize: '12px'
                    }}
                  >
                    {product.description}
                  </p>
                )}
              </div>
              <div 
                className="space-y-1 text-sm font-open-sans mt-auto"
                style={{ color: productPriceColor }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">In Town:</span>
                  <span>${product.in_town_price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Ship:</span>
                  <span>${product.shipping_price}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}