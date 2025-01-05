import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket: string;
  path: string;
  storefrontId?: string;
}

export function ImageUpload({ value, onChange, bucket, path, storefrontId }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const fileType = file.type.toLowerCase();
    if (!fileType.match(/^image\/(png|jpeg|jpg|svg\+xml|x-icon|vnd.microsoft.icon)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPEG, SVG, or ICO file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      console.log("Starting file upload for storefront:", storefrontId);

      const fileExt = fileType === 'image/svg+xml' ? 'svg' : 
                     fileType.includes('icon') ? 'ico' : 
                     file.name.split('.').pop();
                     
      // Include storefrontId in the path if available
      const filePath = storefrontId 
        ? `${storefrontId}/${path}/${Math.random()}.${fileExt}`
        : `${path}/${Math.random()}.${fileExt}`;

      console.log("Uploading file to path:", filePath);

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          contentType: fileType // Explicitly set content type for proper handling
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log("File uploaded successfully, public URL:", publicUrl);
      
      // Update the form value
      onChange(publicUrl);

      // Force an immediate invalidation of the storefront query
      if (storefrontId) {
        console.log("Invalidating storefront query after file upload");
        await queryClient.invalidateQueries({ queryKey: ["storefront", storefrontId] });
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    console.log("Removing image, current value:", value);
    onChange(null);
    // Force an immediate invalidation of the storefront query
    if (storefrontId) {
      console.log("Invalidating storefront query after image removal");
      await queryClient.invalidateQueries({ queryKey: ["storefront", storefrontId] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/x-icon,image/vnd.microsoft.icon"
          onChange={handleUpload}
          disabled={isUploading}
          className="hidden"
          id={`image-upload-${path}`}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(`image-upload-${path}`)?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ImagePlus className="h-4 w-4 mr-2" />
          )}
          Upload Image
        </Button>
      </div>

      {value && (
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 w-full h-full bg-white dark:bg-white rounded-md p-2">
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-full object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 z-10"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}