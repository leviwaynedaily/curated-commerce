import { supabase } from "@/integrations/supabase/client";

export const saveManifest = async (storefrontId: string, manifestData: any) => {
  console.log("Saving manifest for storefront:", storefrontId);
  
  try {
    // Create manifest.json file
    const manifestBlob = new Blob([JSON.stringify(manifestData, null, 2)], {
      type: 'application/json'
    });

    // Save to storage using storefront ID in the path
    const manifestPath = `${storefrontId}/manifest/manifest.json`;
    console.log("Saving manifest to storage path:", manifestPath);
    
    const { error: storageError, data: storageData } = await supabase.storage
      .from('storefront-assets')
      .upload(manifestPath, manifestBlob, {
        contentType: 'application/json',
        upsert: true
      });

    if (storageError) {
      console.error("Error saving manifest file to storage:", storageError);
      throw storageError;
    }

    console.log("Storage response:", storageData);

    // Get the public URL for the manifest - using the direct storage URL format
    const publicUrl = `${supabase.storageUrl}/object/public/storefront-assets/${manifestPath}`;
    console.log("Generated manifest URL:", publicUrl);

    // Save the manifest data to the manifests table
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

    // Update PWA settings with the manifest URL
    const { error: pwaError } = await supabase
      .from("pwa_settings")
      .update({ 
        manifest_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('storefront_id', storefrontId);

    if (pwaError) {
      console.error("Error updating PWA settings with manifest URL:", pwaError);
      throw pwaError;
    }

    console.log("Manifest saved successfully with URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error in saveManifest:", error);
    throw error;
  }
};