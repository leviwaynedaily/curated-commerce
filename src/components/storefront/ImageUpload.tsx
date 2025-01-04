import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      console.log("Starting file upload for storefront:", storefrontId);

      const fileExt = file.name.split('.').pop();
      // Include storefrontId in the path if available
      const filePath = storefrontId 
        ? `${storefrontId}/${path}/${Math.random()}.${fileExt}`
        : `${path}/${Math.random()}.${fileExt}`;

      console.log("Uploading file to path:", filePath);

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log("File uploaded successfully, public URL:", publicUrl);
      onChange(publicUrl);

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

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
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
        <div className="relative w-full max-w-md aspect-square">
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-full object-contain rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}