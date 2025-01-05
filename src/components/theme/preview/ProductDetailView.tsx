import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface ProductDetailViewProps {
  product: any;
  onBack: () => void;
}

export function ProductDetailView({ product, onBack }: ProductDetailViewProps) {
  if (!product) return null;

  return (
    <div className="min-h-screen bg-background">
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
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {product.images?.slice(1).map((image: string, index: number) => (
                <div
                  key={index}
                  className="aspect-square relative rounded-lg overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-4">
                {product.category && (
                  <Badge variant="outline">{product.category}</Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              {product.description && (
                <p className="text-lg text-muted-foreground">
                  {product.description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold">
                ${product.in_town_price}
              </div>
              {product.shipping_price > 0 && (
                <p className="text-sm text-muted-foreground">
                  Shipping: ${product.shipping_price}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}