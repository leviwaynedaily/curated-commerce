import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache'
};

serve(async (req) => {
  console.log('Serve manifest function called:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      console.error('No slug provided in request');
      return new Response(
        JSON.stringify({ error: 'Storefront slug is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('Processing manifest request for slug:', slug);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching storefront data for slug:', slug);
    const { data: storefront, error: storefrontError } = await supabase
      .from('storefronts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (storefrontError || !storefront) {
      console.error('Storefront not found for slug:', slug);
      return new Response(
        JSON.stringify({ error: 'Storefront not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    console.log('Found storefront:', storefront.id);
    console.log('Fetching manifest for storefront:', storefront.id);
    
    const { data: manifest, error: manifestError } = await supabase
      .from('manifests')
      .select('manifest_json')
      .eq('storefront_id', storefront.id)
      .single();

    if (manifestError || !manifest) {
      console.error('Manifest not found for storefront:', storefront.id);
      return new Response(
        JSON.stringify({ error: 'Manifest not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    console.log('Found manifest, serving');

    return new Response(
      JSON.stringify(manifest.manifest_json),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in serve-manifest function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});