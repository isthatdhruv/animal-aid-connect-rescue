import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method === 'POST') {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { email, password } = await req.json();

    try {
      // Create the admin user
      const { data: { user }, error } = await supabaseClient.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          role: 'admin'
        }
      });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      if (!user) {
        return new Response(JSON.stringify({ error: 'No user returned from authentication' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      // Create admin profile
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert({
          id: user.id,
          name: 'Administrator',
          email: user.email,
          role: 'admin',
          status: 'active',
          registered_at: new Date().toISOString(),
          animals: [],
          profile_complete: true,
          rating: 0,
          total_rescues: 0,
          transport: false,
          location: {
            lat: 0,
            lng: 0,
            address: 'Admin Location'
          }
        });

      if (profileError) {
        return new Response(JSON.stringify({ error: profileError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      return new Response(JSON.stringify({ 
        message: 'Admin user created successfully',
        user: {
          id: user.id,
          email: user.email,
          role: 'admin'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }

  return new Response('Method not allowed', { 
    headers: corsHeaders,
    status: 405 
  });
});
