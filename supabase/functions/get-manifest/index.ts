import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  console.log('get-manifest function called with request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const storefrontId = url.searchParams.get('storefrontId');

    console.log('Processing request for storefrontId:', storefrontId);

    if (!storefrontId) {
      console.error('Missing storefrontId parameter');
      return new Response(
        JSON.stringify({ error: 'Storefront ID is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('Initializing Supabase client with URL:', supabaseUrl);
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch PWA settings
    console.log('Fetching PWA settings for storefront:', storefrontId);
    const { data: pwaSettings, error } = await supabase
      .from('pwa_settings')
      .select('*')
      .eq('storefront_id', storefrontId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching PWA settings:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch PWA settings', details: error.message }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (!pwaSettings) {
      console.error('PWA settings not found for storefront:', storefrontId);
      return new Response(
        JSON.stringify({ error: 'PWA settings not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    console.log('Successfully fetched PWA settings:', pwaSettings);

    // Construct icons array - only include icons that have been uploaded
    const icons = [
      { src: pwaSettings.icon_72x72, sizes: '72x72', type: 'image/png' },
      { src: pwaSettings.icon_96x96, sizes: '96x96', type: 'image/png' },
      { src: pwaSettings.icon_128x128, sizes: '128x128', type: 'image/png' },
      { src: pwaSettings.icon_144x144, sizes: '144x144', type: 'image/png' },
      { src: pwaSettings.icon_152x152, sizes: '152x152', type: 'image/png' },
      { src: pwaSettings.icon_192x192, sizes: '192x192', type: 'image/png' },
      { src: pwaSettings.icon_384x384, sizes: '384x384', type: 'image/png' },
      { src: pwaSettings.icon_512x512, sizes: '512x512', type: 'image/png' },
    ].filter(icon => icon.src); // Only include icons that have been uploaded

    // Construct screenshots array
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

    // Construct the manifest
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
    console.error('Error in get-manifest function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});