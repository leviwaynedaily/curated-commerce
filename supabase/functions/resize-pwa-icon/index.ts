import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Sharp from 'https://esm.sh/sharp@0.32.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl, storefrontId } = await req.json()

    if (!imageUrl || !storefrontId) {
      return new Response(
        JSON.stringify({ error: 'Image URL and storefront ID are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Download the original image
    const response = await fetch(imageUrl)
    const imageBuffer = await response.arrayBuffer()

    // Define icon sizes
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    const resizedIcons: Record<string, string> = {}

    // Resize for each size
    for (const size of sizes) {
      const resizedBuffer = await Sharp(new Uint8Array(imageBuffer))
        .resize(size, size)
        .png()
        .toBuffer()

      const filePath = `${storefrontId}/pwa/icons/${size}x${size}/${crypto.randomUUID()}.png`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('storefront-assets')
        .upload(filePath, resizedBuffer, {
          contentType: 'image/png',
          upsert: true
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('storefront-assets')
        .getPublicUrl(filePath)

      resizedIcons[`icon_${size}x${size}`] = publicUrl
    }

    return new Response(
      JSON.stringify({ icons: resizedIcons }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to resize image' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})