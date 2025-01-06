import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    console.log('Processing image:', imageUrl)
    console.log('Storefront ID:', storefrontId)

    // Download the original image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
    }

    // Convert the response to an ArrayBuffer first
    const imageBuffer = await imageResponse.arrayBuffer()
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' })

    // Create image bitmap from blob
    const originalImage = await createImageBitmap(imageBlob)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Define icon sizes to generate
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    const icons: Record<string, string> = {}

    // Process each size
    for (const size of sizes) {
      console.log(`Processing size: ${size}x${size}`)

      // Create canvas with target size
      const canvas = new OffscreenCanvas(size, size)
      const ctx = canvas.getContext('2d', { 
        willReadFrequently: true,
        alpha: false // Disable alpha channel to ensure RGB color space
      })

      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      // Set background to white first to ensure proper color space
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, size, size)

      // Draw resized image with proper image smoothing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(originalImage, 0, 0, size, size)

      try {
        // Convert to blob with explicit PNG format
        const resizedBlob = await canvas.convertToBlob({
          type: 'image/png',
        })

        // Upload to Supabase Storage with timestamp for unique filename
        const timestamp = Date.now()
        const filePath = `${storefrontId}/pwa/icons/${size}x${size}/${timestamp}.png`
        
        console.log(`Uploading resized image for size ${size}x${size}`)
        
        const { error: uploadError } = await supabase.storage
          .from('storefront-assets')
          .upload(filePath, resizedBlob, {
            contentType: 'image/png',
            upsert: true
          })

        if (uploadError) {
          console.error(`Error uploading ${size}x${size}:`, uploadError)
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from('storefront-assets')
          .getPublicUrl(filePath)

        icons[`icon_${size}x${size}`] = publicUrl
        console.log(`Generated icon ${size}x${size}:`, publicUrl)
      } catch (error) {
        console.error(`Error processing size ${size}x${size}:`, error)
        throw error
      }
    }

    return new Response(
      JSON.stringify({ icons }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in resize-pwa-icon function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to resize image', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})