import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { storefrontId } = await req.json()
    console.log('Generating static files for storefront:', storefrontId)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get storefront details
    const { data: storefront, error: storefrontError } = await supabase
      .from('storefronts')
      .select('*, pwa_settings(*)')
      .eq('id', storefrontId)
      .single()

    if (storefrontError || !storefront) {
      console.error('Error fetching storefront:', storefrontError)
      throw new Error('Storefront not found')
    }

    console.log('Found storefront:', storefront.slug)

    // Generate manifest URL using the predictable pattern
    const manifestUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/storefront-assets/pwa/${storefront.slug}/manifest.json`

    // Generate index.html content with the manifest URL
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="${storefront.favicon_url || '/favicon.ico'}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${storefront.page_title || storefront.name}</title>
    <link rel="manifest" href="${manifestUrl}" />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
    <script type="module" src="/src/main.tsx"></script>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              console.log('ServiceWorker registration successful:', registration);
            })
            .catch(error => {
              console.error('ServiceWorker registration failed:', error);
            });
        });
      }
    </script>
  </body>
</html>`

    // Save the index.html file to storage
    const filePath = `storefronts/${storefront.slug}/index.html`
    const { error: uploadError } = await supabase.storage
      .from('storefront-assets')
      .upload(filePath, new Blob([indexHtml], { type: 'text/html' }), {
        contentType: 'text/html',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading index.html:', uploadError)
      throw uploadError
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('storefront-assets')
      .getPublicUrl(filePath)

    console.log('Generated static files successfully:', publicUrl)

    return new Response(
      JSON.stringify({ 
        message: 'Static files generated successfully',
        indexUrl: publicUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating static files:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})