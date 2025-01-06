import { ImagePlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { ProductFormValues } from "./ProductFormTypes"

interface ProductImageUploadProps {
  form: UseFormReturn<ProductFormValues>
  isUploading: boolean
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}

export function ProductImageUpload({ form, isUploading, onUpload }: ProductImageUploadProps) {
  const isVideo = (url: string) => {
    return url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/i);
  };

  const renderMediaPreview = (url: string, index: number) => {
    if (isVideo(url)) {
      return (
        <div key={index} className="relative w-full h-32">
          <video
            src={url}
            className="w-full h-full object-cover rounded-md"
            controls
          >
            Your browser does not support the video element.
          </video>
        </div>
      );
    }
    return (
      <div key={index} className="relative w-full h-32">
        <img
          src={url}
          alt={`Product media ${index + 1}`}
          className="w-full h-full object-cover rounded-md"
        />
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
  )
}