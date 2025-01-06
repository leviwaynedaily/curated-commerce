import { Badge } from "@/components/ui/badge";
import { Home, Truck } from "lucide-react";

interface ProductCardProps {
  product: any;
  layout: string;
  productCardBackgroundColor: string;
  productTitleTextColor: string;
  productDescriptionTextColor: string;
  productPriceColor: string;
  productPriceButtonColor: string;
  productCategoryBackgroundColor: string;
  productCategoryTextColor: string;
  onProductClick: (product: any) => void;
}

export function ProductCard({
  product,
  layout,
  productCardBackgroundColor,
  productTitleTextColor,
  productDescriptionTextColor,
  productPriceColor,
  productPriceButtonColor,
  productCategoryBackgroundColor,
  productCategoryTextColor,
  onProductClick,
}: ProductCardProps) {
  const getCardDimensions = () => {
    switch (layout) {
      case 'small':
        return 'w-full h-[320px]'
      case 'large':
        return 'w-full h-[440px]'
      case 'list':
        return 'w-full h-[180px] flex'
      default: // medium
        return 'w-full h-[380px]'
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

  const isVideo = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return ['mp4', 'webm', 'ogg', 'mov'].includes(extension || '');
  };

  return (
    <div 
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] transform hover:scale-[1.02] rounded-lg ${getCardDimensions()}`}
      onClick={() => onProductClick(product)}
      style={{ backgroundColor: productCardBackgroundColor }}
    >
      <div className={`relative ${layout === 'list' ? 'w-1/3' : 'w-full'} h-3/5`}>
        {product.images?.[0] && (
          isVideo(product.images[0]) ? (
            <video
              src={product.images[0]}
              className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
              muted
              playsInline
              loop
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          ) : (
            <img
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
            />
          )
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

        <div className="flex flex-nowrap gap-2 justify-start">
          <div 
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
            style={{ 
              backgroundColor: productPriceButtonColor || `${productPriceColor}15`,
              color: productPriceColor
            }}
          >
            <Home className="h-3 w-3" />
            <span className="text-xs font-semibold whitespace-nowrap">
              {formatPrice(product.in_town_price)}
            </span>
          </div>

          {product.shipping_price > 0 && (
            <div 
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
              style={{ 
                backgroundColor: productPriceButtonColor || `${productPriceColor}15`,
                color: productPriceColor
              }}
            >
              <Truck className="h-3 w-3" />
              <span className="text-xs font-semibold whitespace-nowrap">
                {formatPrice(product.shipping_price)}
              </span>
            </div>
          )}
        </div>

        {product.description && (
          <p 
            className="text-xs line-clamp-1 transition-all duration-300"
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
  );
}