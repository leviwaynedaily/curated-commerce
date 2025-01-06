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
    console.log('Fetching PWA settings for storefront:', storefront.id);
    
    const { data: pwaSettings, error: pwaError } = await supabase
      .from('pwa_settings')
      .select('*')
      .eq('storefront_id', storefront.id)
      .single();

    if (pwaError || !pwaSettings) {
      console.error('PWA settings not found for storefront:', storefront.id);
      return new Response(
        JSON.stringify({ error: 'PWA settings not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    console.log('Found PWA settings, constructing manifest');

    const icons = [
      pwaSettings.icon_72x72 && { src: pwaSettings.icon_72x72, sizes: '72x72', type: 'image/png' },
      pwaSettings.icon_96x96 && { src: pwaSettings.icon_96x96, sizes: '96x96', type: 'image/png' },
      pwaSettings.icon_128x128 && { src: pwaSettings.icon_128x128, sizes: '128x128', type: 'image/png' },
      pwaSettings.icon_144x144 && { src: pwaSettings.icon_144x144, sizes: '144x144', type: 'image/png' },
      pwaSettings.icon_152x152 && { src: pwaSettings.icon_152x152, sizes: '152x152', type: 'image/png' },
      pwaSettings.icon_192x192 && { src: pwaSettings.icon_192x192, sizes: '192x192', type: 'image/png' },
      pwaSettings.icon_384x384 && { src: pwaSettings.icon_384x384, sizes: '384x384', type: 'image/png' },
      pwaSettings.icon_512x512 && { src: pwaSettings.icon_512x512, sizes: '512x512', type: 'image/png' },
    ].filter(Boolean);

    console.log('Available icons:', icons.map(icon => icon.sizes));

    const screenshots = [];
    if (pwaSettings.screenshot_mobile) {
      screenshots.push({
        src: pwaSettings.screenshot_mobile,
        sizes: '360x640',
        type: 'image/png',
        form_factor: 'narrow'
      });
    }
    if (pwaSettings.screenshot_desktop) {
      screenshots.push({
        src: pwaSettings.screenshot_desktop,
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide'
      });
    }

    const manifest = {
      name: pwaSettings.name,
      short_name: pwaSettings.short_name,
      description: pwaSettings.description,
      start_url: pwaSettings.start_url || '/',
      display: pwaSettings.display || 'standalone',
      orientation: pwaSettings.orientation || 'any',
      theme_color: pwaSettings.theme_color || '#000000',
      background_color: pwaSettings.background_color || '#ffffff',
      icons,
      screenshots: screenshots.length > 0 ? screenshots : undefined,
    };

    console.log('Generated manifest:', manifest);

    return new Response(
      JSON.stringify(manifest),
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