import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  email: string
  businessId: string
  role?: 'member' | 'editor'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with admin privileges
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

    // Get request body
    const { email, businessId, role = 'member' } = await req.json() as RequestBody
    console.log('Creating business user for:', { email, businessId, role })

    // First check if user exists in auth.users
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
    if (authError) {
      console.error('Error fetching auth user:', authError)
      throw new Error('Failed to fetch user')
    }

    if (!authUser?.user) {
      console.error('User not found in auth.users')
      throw new Error('User not found')
    }

    // Check if user already has access to this business
    const { data: existingAccess, error: accessError } = await supabaseAdmin
      .from('business_users')
      .select('*')
      .eq('business_id', businessId)
      .eq('user_id', authUser.user.id)
      .maybeSingle()

    if (accessError) {
      console.error('Error checking existing access:', accessError)
      throw new Error('Failed to check existing access')
    }

    if (existingAccess) {
      console.log('User already has access to this business')
      throw new Error('User already has access to this business')
    }

    // Check if profile exists, if not create it
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authUser.user.id)
      .maybeSingle()

    if (profileError) {
      console.error('Error checking profile:', profileError)
      throw new Error('Failed to check profile')
    }

    if (!existingProfile) {
      console.log('Creating profile for user:', authUser.user.id)
      const { error: createProfileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authUser.user.id,
          email: email,
        })

      if (createProfileError) {
        console.error('Error creating profile:', createProfileError)
        throw new Error('Failed to create profile')
      }
    }

    // Add user to business_users
    console.log('Adding user to business:', { userId: authUser.user.id, businessId, role })
    const { error: insertError } = await supabaseAdmin
      .from('business_users')
      .insert({
        business_id: businessId,
        user_id: authUser.user.id,
        role: role
      })

    if (insertError) {
      console.error('Error inserting business user:', insertError)
      throw new Error('Failed to add user to business')
    }

    return new Response(
      JSON.stringify({ message: 'Business user created successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in create-business-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})