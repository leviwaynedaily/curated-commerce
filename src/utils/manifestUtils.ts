import { supabase } from "@/integrations/supabase/client";

export const saveManifest = async (storefrontId: string, manifestData: any) => {
  console.log("Saving manifest for storefront:", storefrontId);
  
  const { error } = await supabase
    .from("manifests")
    .upsert({
      storefront_id: storefrontId,
      manifest_json: manifestData
    }, {
      onConflict: 'storefront_id'
    });

  if (error) {
    console.error("Error saving manifest:", error);
    throw error;
  }
  
  console.log("Manifest saved successfully");
};