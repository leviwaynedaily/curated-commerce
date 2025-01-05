import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import { PreviewData } from "@/types/preview";

interface ProductDetailViewProps {
  product: any;
  onBack: () => void;
  previewData: PreviewData;
}

export function ProductDetailView({ product, onBack, previewData }: ProductDetailViewProps) {
  if (!product) return null;

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const fileExtension = url.split('.').pop() || '';
      const fileName = `${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExtension}`;
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const isVideo = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return ['mp4', 'webm', 'ogg'].includes(extension || '');
  };

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: previewData.storefront_background_color }}
    >
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {product.images?.[0] && (
              <div className="aspect-square relative rounded-lg overflow-hidden group">
                {isVideo(product.images[0]) ? (
                  <video
                    src={product.images[0]}
                    controls
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDownload(product.images[0])}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {product.images?.slice(1).map((image: string, index: number) => (
                <div
                  key={index}
                  className="aspect-square relative rounded-lg overflow-hidden group"
                >
                  {isVideo(image) ? (
                    <video
                      src={image}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDownload(image)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

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

            <div className="space-y-4">
              <div className="space-y-2">
                <div 
                  className="flex items-center gap-2 text-2xl font-bold"
                  style={{ color: previewData.product_price_color }}
                >
                  <span className="text-sm font-medium">In Town:</span>
                  <span>${product.in_town_price}</span>
                </div>
                {product.shipping_price > 0 && (
                  <div 
                    className="flex items-center gap-2 text-xl"
                    style={{ color: previewData.product_price_color }}
                  >
                    <span className="text-sm font-medium">Ship:</span>
                    <span>${product.shipping_price}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}