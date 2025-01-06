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
            className="text-lg"
            style={{ color: previewData.product_description_text_color }}
          >
            {product.description}
          </p>
        )}
      </div>

      <div 
        className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3"
        style={{ backgroundColor: `${previewData.product_price_button_color}40` }}
      >
        <div 
          className="flex items-center gap-3"
          style={{ color: previewData.product_price_color }}
        >
          <span className="text-2xl font-bold">${product.in_town_price}</span>
        </div>
        {product.shipping_price > 0 && (
          <div 
            className="flex items-center gap-3"
            style={{ color: previewData.product_price_color }}
          >
            <span className="text-2xl font-bold">${product.shipping_price}</span>
          </div>
        )}
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