import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from Create Business User function!')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request body
    const { email, businessId } = await req.json()
    console.log(`Processing request for email: ${email} and business: ${businessId}`)

    if (!email || !businessId) {
      throw new Error('Email and businessId are required')
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // First check if user exists in profiles
    console.log('Checking if user exists in profiles')
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .maybeSingle()

    if (profileError) {
      console.error('Error checking profiles:', profileError)
      throw profileError
    }

    if (!existingProfile) {
      console.log('Profile not found')
      throw new Error('User not found')
    }

    // Check if user already has access to this business
    console.log('Checking if user already has access')
    const { data: existingAccess, error: accessError } = await supabaseAdmin
      .from('business_users')
      .select('id')
      .eq('business_id', businessId)
      .eq('user_id', existingProfile.id)
      .maybeSingle()

    if (accessError) {
      console.error('Error checking access:', accessError)
      throw accessError
    }

    if (existingAccess) {
      console.log('User already has access')
      throw new Error('User already has access to this business')
    }

    // Add user to business
    console.log('Adding user to business')
    const { error: addError } = await supabaseAdmin
      .from('business_users')
      .insert({
        business_id: businessId,
        user_id: existingProfile.id,
        role: 'member'
      })

    if (addError) {
      console.error('Error adding user to business:', addError)
      throw addError
    }

    return new Response(
      JSON.stringify({
        userId: existingProfile.id,
        message: 'User added successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})