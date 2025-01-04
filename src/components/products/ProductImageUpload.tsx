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
  return (
    <FormField
      control={form.control}
      name="images"
      render={() => (
        <FormItem>
          <FormLabel>Images</FormLabel>
          <FormControl>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
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
                Upload Images
              </Button>
            </div>
          </FormControl>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {form.watch("images")?.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Product image ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}