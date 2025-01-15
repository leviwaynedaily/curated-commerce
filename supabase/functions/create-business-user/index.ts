import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestBody {
  email: string;
  businessId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const { email, businessId } = await req.json() as RequestBody

    // First check if user exists in profiles
    const { data: existingUser } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    let userId = existingUser?.id

    // If user doesn't exist, create them
    if (!existingUser) {
      console.log('Creating new user:', email)
      const tempPassword = Math.random().toString(36).slice(-8)
      
      const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true
      })

      if (createError) throw createError
      
      userId = newUser.user.id
      console.log('Created new user:', userId)

      return new Response(
        JSON.stringify({ 
          success: true, 
          userId,
          isNewUser: true,
          tempPassword 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Return existing user info
    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        isNewUser: false 
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