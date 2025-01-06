import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect } from "react";

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

  // Re-initialize carousel when images change
  useEffect(() => {
    if (emblaApi) {
      console.log("Reinitializing carousel with images:", images);
      emblaApi.reInit();
    }
  }, [emblaApi, images]);

  const isVideo = (url: string) => {
    console.log("Checking if media is video:", url);
    const extension = url.split('.').pop()?.toLowerCase();
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];
    const isVideoFile = videoExtensions.includes(extension || '');
    console.log("Is video file:", isVideoFile, "Extension:", extension);
    return isVideoFile;
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((media, index) => (
            <div key={index} className="relative min-w-full flex-shrink-0">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                {isVideo(media) ? (
                  <video
                    key={media}
                    src={media}
                    controls
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => console.error("Video error:", e)}
                  />
                ) : (
                  <img
                    src={media}
                    alt={`${productName} ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(media);
                  }}
                  style={{ backgroundColor: previewData.product_category_background_color }}
                >
                  <Download 
                    className="h-4 w-4"
                    style={{ color: previewData.product_category_text_color }}
                  />
                </Button>
              </div>
            </div>
          ))}
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
        {images.map((media, index) => (
          <div
            key={index}
            className="aspect-square relative rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => emblaApi?.scrollTo(index)}
          >
            {isVideo(media) ? (
              <video
                src={media}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={media}
                alt={`${productName} ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(media);
              }}
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