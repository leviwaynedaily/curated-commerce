import { Badge } from "@/components/ui/badge"

interface ProductGridProps {
  products: any[]
  layout: string
  textPlacement: string
  onProductClick: (product: any) => void
  mainColor: string
  fontColor: string
}

export function ProductGrid({ 
  products, 
  layout, 
  textPlacement,
  onProductClick,
  mainColor,
  fontColor
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
        return 'aspect-[3/4]'
      case 'large':
        return 'aspect-video'
      case 'list':
        return 'h-48 md:h-64'
      default: // medium
        return 'aspect-[4/5]'
    }
  }

  const getTextPlacementStyles = (product: any) => {
    if (textPlacement === 'below') {
      return {
        imageContainer: "h-2/3 relative",
        textContainer: "p-4 bg-white",
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
            className={`group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${getCardSize()} ${layout === 'list' ? 'flex' : ''} bg-card cursor-pointer`}
            onClick={() => onProductClick(product)}
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
              className={`${layout === 'list' ? 'flex-1 flex flex-col justify-between' : ''} ${styles.textContainer}`}
              style={{
                color: textPlacement === 'overlay' ? fontColor : mainColor,
                backgroundColor: textPlacement === 'below' ? 'white' : 'transparent'
              }}
            >
              <div>
                <div className="flex gap-2 flex-wrap mb-2">
                  {product.category && (
                    <Badge 
                      variant="outline" 
                      className={textPlacement === 'overlay' ? 'bg-transparent border-white/40 text-white' : ''}
                    >
                      {product.category}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-1">
                  {product.name}
                </h3>
                {product.description && (
                  <p className={`text-sm ${textPlacement === 'overlay' ? 'text-white/80' : 'text-muted-foreground'} line-clamp-2`}>
                    {product.description}
                  </p>
                )}
              </div>
              <div className="text-sm font-medium mt-2">
                ${product.in_town_price}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}