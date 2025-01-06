import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

interface ProductMediaCarouselProps {
  images: string[];
  productName: string;
  onDownload: (url: string) => void;
  previewData: any;
}

export function ProductMediaCarousel({ images, productName, onDownload, previewData }: ProductMediaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const isVideo = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return ['mp4', 'webm', 'ogg', 'mov'].includes(extension || '');
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images?.[0] && (
            <div className="aspect-square relative rounded-lg overflow-hidden min-w-full">
              {isVideo(images[0]) ? (
                <video
                  src={images[0]}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <img
                  src={images[0]}
                  alt={productName}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDownload(images[0])}
                style={{ backgroundColor: previewData.product_category_background_color }}
              >
                <Download 
                  className="h-4 w-4"
                  style={{ color: previewData.product_category_text_color }}
                />
              </Button>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80"
              onClick={scrollPrev}
            >
              ←
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80"
              onClick={scrollNext}
            >
              →
            </Button>
          </>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images?.slice(1).map((image: string, index: number) => (
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
                alt={`${productName} ${index + 2}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDownload(image)}
              style={{ backgroundColor: previewData.product_category_background_color }}
            >
              <Download 
                className="h-4 w-4"
                style={{ color: previewData.product_category_text_color }}
              />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}