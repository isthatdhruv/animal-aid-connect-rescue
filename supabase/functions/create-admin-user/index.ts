
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  // Create Supabase client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@petmate.com',
      password: 'admin@123',
      user_metadata: {
        role: 'admin'
      }
    })

    if (error) throw error

    // Create admin profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        status: 'Approved', 
        profile_complete: true 
      })
      .eq('id', data.user?.id)

    if (profileError) throw profileError

    return new Response(JSON.stringify({ 
      message: 'Admin user created successfully' 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (err) {
    return new Response(JSON.stringify({ 
      error: err.message 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
