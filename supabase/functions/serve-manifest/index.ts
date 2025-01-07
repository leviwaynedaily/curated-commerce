import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const slug = url.searchParams.get('slug')

    if (!slug) {
      console.error('No slug provided in request')
      return new Response(
        JSON.stringify({ error: 'No slug provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Fetching manifest for storefront with slug: ${slug}`)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get manifest directly from manifests table by joining with storefronts
    const { data: manifest, error: manifestError } = await supabaseClient
      .from('manifests')
      .select('manifest_json')
      .eq('storefront_id', (
        await supabaseClient
          .from('storefronts')
          .select('id')
          .eq('slug', slug)
          .maybeSingle()
      )?.data?.id)
      .maybeSingle()

    if (manifestError) {
      console.error('Error fetching manifest:', manifestError)
      return new Response(
        JSON.stringify({ error: 'Error fetching manifest' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!manifest) {
      console.error('No manifest found for slug:', slug)
      return new Response(
        JSON.stringify({ error: 'Manifest not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Successfully retrieved manifest')
    
    // Return the stored manifest with proper headers
    return new Response(
      JSON.stringify(manifest.manifest_json),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})