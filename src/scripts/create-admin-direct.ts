import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://ibispskwmzybgtavfznd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaXNwc2t3bXp5Ymd0YXZmem5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTYwNTM3OCwiZXhwIjoyMDYxMTgxMzc4fQ.5vUFxP4ETlKkY7o0daQA5RB0Vh3Qw_9kxQaiCFfl3FM";

async function createAdminUser() {
  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient<Database>(
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

    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Error checking existing users: ${listError.message}`);
    }

    const existingUser = existingUsers?.users?.find((user: { email: string }) => user.email === adminEmail);
    
    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // Create the user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });

    if (authError) {
      throw new Error(`Error creating user: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('No user data returned after creation');
    }

    // Create the profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        name: 'Admin User',
        role: 'admin',
        location: { address: 'Admin Location' },
        registered_at: new Date().toISOString(),
        profile_complete: true
      });

    if (profileError) {
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