import { Badge } from "@/components/ui/badge";

interface ProductGridProps {
  products: any[];
  gridSize: 'small' | 'medium' | 'large';
  onProductClick: (product: any) => void;
}

export function ProductGrid({ products, gridSize, onProductClick }: ProductGridProps) {
  const getGridColumns = () => {
    switch (gridSize) {
      case 'small':
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
      case 'large':
        return 'grid-cols-1';
      default: // medium
        return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  const getCardSize = () => {
    switch (gridSize) {
      case 'small':
        return 'aspect-[3/4]';
      case 'large':
        return 'aspect-square max-w-3xl mx-auto';
      default: // medium
        return 'aspect-[4/5]';
    }
  };

  return (
    <div className={`grid ${getGridColumns()} gap-4`}>
      {products?.map((product) => (
        <div 
          key={product.id}
          className={`group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${getCardSize()} bg-card cursor-pointer`}
          onClick={() => onProductClick(product)}
        >
          {product.images?.[0] && (
            <div className="relative h-full">
              <img
                src={product.images[0]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex gap-2 flex-wrap mb-2">
                  {product.category && (
                    <Badge variant="outline" className="bg-transparent border-white/40 text-white">
                      {product.category}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-white mb-1">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-white/80 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="text-sm font-medium mt-2 text-white">
                  ${product.in_town_price}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}