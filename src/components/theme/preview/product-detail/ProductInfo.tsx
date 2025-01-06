import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ProductInfoProps {
  product: any;
  previewData: any;
  onDownload: (url: string) => void;
}

export function ProductInfo({ product, previewData, onDownload }: ProductInfoProps) {
  const isVideo = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return ['mp4', 'webm', 'ogg', 'mov'].includes(extension || '');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex gap-2 mb-4">
          {product.category && (
            <Badge 
              variant="outline"
              style={{
                backgroundColor: previewData.product_category_background_color,
                color: previewData.product_category_text_color,
                borderColor: 'transparent'
              }}
            >
              {product.category}
            </Badge>
          )}
        </div>
        <h1 
          className="text-4xl font-bold mb-4"
          style={{ color: previewData.product_title_text_color }}
        >
          {product.name}
        </h1>
        {product.description && (
          <p 
            className="text-lg mb-6"
            style={{ color: previewData.product_description_text_color }}
          >
            {product.description}
          </p>
        )}

        <div className="space-y-2">
          <p className="text-lg" style={{ color: previewData.product_title_text_color }}>
            <span className="font-medium">In Town Price:</span>{' '}
            <span className="font-bold">{formatPrice(product.in_town_price)}</span>
          </p>
          {product.shipping_price > 0 && (
            <p className="text-lg" style={{ color: previewData.product_title_text_color }}>
              <span className="font-medium">Shipping Price:</span>{' '}
              <span className="font-bold">{formatPrice(product.shipping_price)}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {product.images?.some((url: string) => !isVideo(url)) && (
          <Button
            className="flex items-center gap-2"
            style={{ 
              backgroundColor: previewData.product_category_background_color,
              color: previewData.product_category_text_color
            }}
            onClick={() => onDownload(product.images.find((url: string) => !isVideo(url)))}
          >
            <Download className="h-4 w-4" />
            Download Image
          </Button>
        )}
        {product.images?.some((url: string) => isVideo(url)) && (
          <Button
            className="flex items-center gap-2"
            style={{ 
              backgroundColor: previewData.product_category_background_color,
              color: previewData.product_category_text_color
            }}
            onClick={() => onDownload(product.images.find((url: string) => isVideo(url)))}
          >
            <Download className="h-4 w-4" />
            Download Video
          </Button>
        )}
      </div>
    </div>
  );
}