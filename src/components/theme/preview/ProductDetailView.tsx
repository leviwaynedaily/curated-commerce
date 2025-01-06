import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProductMediaCarousel } from "./product-detail/ProductMediaCarousel";
import { ProductInfo } from "./product-detail/ProductInfo";

interface ProductDetailViewProps {
  product: any;
  onBack: () => void;
  previewData: any;
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

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: previewData?.storefront_background_color || '#F1F0FB' }}
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
          <ProductMediaCarousel
            images={product.images || []}
            productName={product.name}
            onDownload={handleDownload}
            previewData={previewData}
          />
          <ProductInfo
            product={product}
            previewData={previewData}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
}