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

    // If user doesn't exist in profiles
    if (!existingUser) {
      console.log('User not found in profiles, checking auth.users')
      
      // Check if user exists in auth.users
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
      if (authError) throw authError

      const existingAuthUser = authData.users.find(u => u.email === email)

      if (existingAuthUser) {
        // User exists in auth but not in profiles
        userId = existingAuthUser.id
        console.log('Found existing auth user:', userId)
        
        // Create their profile
        const { error: insertProfileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: userId,
            email: email
          })

        if (insertProfileError) {
          console.error('Error creating profile:', insertProfileError)
          throw insertProfileError
        }
      } else {
        // User doesn't exist anywhere, create new user
        console.log('Creating new user')
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
    }

    // Check if user already has access to this business
    const { data: existingAccess } = await supabaseAdmin
      .from('business_users')
      .select('id')
      .eq('business_id', businessId)
      .eq('user_id', userId)
      .maybeSingle()

    if (existingAccess) {
      throw new Error('User already has access to this business')
    }

    // Add user to business
    const { error: addError } = await supabaseAdmin
      .from('business_users')
      .insert({
        business_id: businessId,
        user_id: userId,
        role: 'member'
      })

    if (addError) {
      console.error('Error adding user to business:', addError)
      throw addError
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