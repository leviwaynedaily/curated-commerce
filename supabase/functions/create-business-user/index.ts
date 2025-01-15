import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestBody {
  email: string;
  businessId: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request body
    const { email, businessId } = await req.json() as RequestBody

    if (!email || !businessId) {
      throw new Error('Email and businessId are required')
    }

    console.log('Creating/getting user for email:', email)

    // First check if user exists in profiles
    const { data: existingUser, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (profileError) {
      throw profileError
    }

    let userId = existingUser?.id
    let isNewUser = false
    let tempPassword: string | undefined

    // If user doesn't exist, create them
    if (!existingUser) {
      console.log('User not found, creating new user')
      tempPassword = Math.random().toString(36).slice(-8)
      
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true
      })

      if (createError) throw createError
      
      userId = newUser.user.id
      isNewUser = true
      console.log('Created new user:', userId)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        isNewUser,
        tempPassword 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})