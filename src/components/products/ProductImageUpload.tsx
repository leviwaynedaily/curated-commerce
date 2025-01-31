import { ImagePlus, Loader2, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { ProductFormValues } from "./ProductFormTypes"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ProductImageUploadProps {
  form: UseFormReturn<ProductFormValues>
  isUploading: boolean
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}

export function ProductImageUpload({ form, isUploading, onUpload }: ProductImageUploadProps) {
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const isVideo = (url: string) => {
    return url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/i);
  };

  const handleDelete = async (urlToDelete: string) => {
    try {
      setDeletingUrl(urlToDelete);
      
      const filePath = urlToDelete.split('/storefront-assets/')[1];
      if (!filePath) {
        throw new Error('Invalid file path');
      }

      console.log("Deleting file from storage:", filePath);
      
      const { error: storageError } = await supabase.storage
        .from('storefront-assets')
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting from storage:", storageError);
        throw storageError;
      }

      const currentImages = form.getValues("images") || [];
      const updatedImages = currentImages.filter(url => url !== urlToDelete);
      form.setValue("images", updatedImages);

      toast.success("Media file deleted successfully");
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("Failed to delete media file");
    } finally {
      setDeletingUrl(null);
    }
  };

  const handleSetPrimary = (url: string) => {
    const currentImages = form.getValues("images") || [];
    const updatedImages = [
      url,
      ...currentImages.filter(image => image !== url)
    ];
    form.setValue("images", updatedImages);
    toast.success("Primary asset updated");
  };

  const renderMediaPreview = (url: string, index: number) => {
    const isDeleting = deletingUrl === url;
    const isPrimary = index === 0;

    return (
      <div key={index} className="relative w-full h-32 group">
        {isVideo(url) ? (
          <video
            src={url}
            className="w-full h-full object-cover rounded-md"
            controls
          >
            Your browser does not support the video element.
          </video>
        ) : (
          <img
            src={url}
            alt={`Product media ${index + 1}`}
            className="w-full h-full object-cover rounded-md"
          />
        )}
        
        <div className="absolute top-2 right-2 flex gap-2">
          {!isPrimary && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleSetPrimary(url)}
              title="Set as primary"
            >
              <Star className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleDelete(url)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>
        {isPrimary && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Primary
          </div>
        )}
      </div>
    );
  };

  return (
    <FormField
      control={form.control}
      name="images"
      render={() => (
        <FormItem>
          <FormLabel>Media Files</FormLabel>
          <FormControl>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={onUpload}
                disabled={isUploading}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ImagePlus className="h-4 w-4 mr-2" />
                )}
                Upload Images & Videos
              </Button>
            </div>
          </FormControl>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {form.watch("images")?.map((url, index) => renderMediaPreview(url, index))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}