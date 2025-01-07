import { supabase } from "@/integrations/supabase/client";

export const saveManifest = async (storefrontId: string, manifestData: any) => {
  console.log("Saving manifest for storefront:", storefrontId);
  
  try {
    // Save to database
    const { error: dbError } = await supabase
      .from("manifests")
      .upsert({
        storefront_id: storefrontId,
        manifest_json: manifestData
      }, {
        onConflict: 'storefront_id'
      });

    if (dbError) {
      console.error("Error saving manifest to database:", dbError);
      throw dbError;
    }

    // Create manifest.json file
    const manifestBlob = new Blob([JSON.stringify(manifestData, null, 2)], {
      type: 'application/json'
    });

    // Save to storage
    const { error: storageError } = await supabase.storage
      .from('storefront-assets')
      .upload(`${storefrontId}/manifest/manifest.json`, manifestBlob, {
        contentType: 'application/json',
        upsert: true
      });

    if (storageError) {
      console.error("Error saving manifest file to storage:", storageError);
      throw storageError;
    }

    console.log("Manifest saved successfully");
  } catch (error) {
    console.error("Error in saveManifest:", error);
    throw error;
  }
};