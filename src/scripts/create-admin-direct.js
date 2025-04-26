import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ibispskwmzybgtavfznd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaXNwc2t3bXp5Ymd0YXZmem5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTYwNTM3OCwiZXhwIjoyMDYxMTgxMzc4fQ.5vUFxP4ETlKkY7o0daQA5RB0Vh3Qw_9kxQaiCFfl3FM";

async function createAdminUser() {
  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const adminEmail = 'admin@petmate.com';
    const adminPassword = 'admin@123';

    // First, try to sign up the user
    console.log('Attempting to sign up user...');
    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError);
      throw new Error(`Error signing up user: ${signUpError.message}`);
    }

    if (!signUpData.user) {
      throw new Error('No user data returned after sign up');
    }

    console.log('User signed up successfully, creating profile...');

    // Create the profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: signUpData.user.id,
        name: 'Admin User',
        role: 'admin',
        location: { address: 'Admin Location' },
        registered_at: new Date().toISOString(),
        profile_complete: true
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw new Error(`Error creating profile: ${profileError.message}`);
    }

    console.log('Admin user created successfully');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);

  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Run the function
createAdminUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }); 