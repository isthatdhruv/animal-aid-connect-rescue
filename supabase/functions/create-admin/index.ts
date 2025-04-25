import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  if (req.method === 'POST') {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    const { email, password } = await req.json();

    // Create the admin user
    const { user, error } = await supabaseClient.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Log in the admin user
    const { session, error: loginError } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (loginError) {
      return new Response(JSON.stringify({ error: loginError.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    return new Response(JSON.stringify({ user, session }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  return new Response('Method not allowed', { status: 405 });
}); 