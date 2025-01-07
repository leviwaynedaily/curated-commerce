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
  enforceFilename?: string;
}

export function ImageUpload({ value, onChange, bucket, path, storefrontId, enforceFilename }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const fileType = file.type.toLowerCase();
    
    // If enforceFilename is used (for PWA icons), only allow PNG
    if (enforceFilename && fileType !== 'image/png') {
      toast({
        title: "Invalid file type",
        description: "PWA icons must be PNG files. Please convert your image to PNG format.",
        variant: "destructive",
      });
      return;
    } else if (!fileType.match(/^image\/(png|jpeg|jpg|svg\+xml|x-icon|vnd.microsoft.icon)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPEG, SVG, or ICO file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Use enforced filename if provided, otherwise generate a random one
      const filename = enforceFilename || `${Math.random()}.${fileType === 'image/svg+xml' ? 'svg' : 
                     fileType.includes('icon') ? 'ico' : 
                     file.name.split('.').pop()}`;
                     
      const filePath = storefrontId 
        ? `${storefrontId}/${path}/${filename}`
        : `${path}/${filename}`;

      console.log("Uploading file to path:", filePath);

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          contentType: fileType,
          upsert: true // Always overwrite if enforceFilename is used
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      onChange(publicUrl);

      if (storefrontId) {
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
    onChange(null);
    if (storefrontId) {
      await queryClient.invalidateQueries({ queryKey: ["storefront", storefrontId] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept={enforceFilename ? "image/png" : "image/png,image/jpeg,image/jpg,image/svg+xml,image/x-icon,image/vnd.microsoft.icon"}
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