import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { PreviewContent } from "./preview/PreviewContent";
import { Database } from "@/integrations/supabase/types";

interface LivePreviewProps {
  storefrontId: string;
}

type StorefrontRow = Database['public']['Tables']['storefronts']['Row'];

export function LivePreview({ storefrontId }: LivePreviewProps) {
  const [previewData, setPreviewData] = useState<PreviewData>({});

  useEffect(() => {
    const fetchStorefrontData = async () => {
      console.log("Fetching storefront data for preview:", storefrontId);
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", storefrontId)
        .single();

      if (error) {
        console.error("Error fetching storefront:", error);
        return;
      }

      console.log("Fetched storefront data:", data);
      setPreviewData(data);
    };

    fetchStorefrontData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`storefront_changes_${storefrontId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'storefronts',
          filter: `id=eq.${storefrontId}`,
        },
        (payload) => {
          console.log("Received realtime update:", payload);
          const newData = payload.new as StorefrontRow;
          setPreviewData(newData);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [storefrontId]);

  if (!previewData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto bg-background">
      <PreviewContent 
        previewData={previewData} 
        onReset={() => {}}
      />
    </div>
  );
}