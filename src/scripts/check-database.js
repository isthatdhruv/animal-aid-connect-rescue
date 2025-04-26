import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const SUPABASE_URL = "https://ibispskwmzybgtavfznd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaXNwc2t3bXp5Ymd0YXZmem5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTYwNTM3OCwiZXhwIjoyMDYxMTgxMzc4fQ.5vUFxP4ETlKkY7o0daQA5RB0Vh3Qw_9kxQaiCFfl3FM";

async function checkDatabase() {
  try {
    // Create admin client with proper configuration
    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
          }
        }
      }
    );

    console.log('Checking database configuration...');

    // Check if profiles table exists and get its structure
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Error accessing profiles table:', tableError);
      throw new Error(`Profiles table error: ${tableError.message}`);
    }

    console.log('Profiles table exists and is accessible');

    // Create a test user first
    const testEmail = `test-${uuidv4()}@example.com`;
    const testPassword = 'test-password-123';

    console.log('Creating test user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          role: 'user'
        }
      }
    });

    if (authError) {
      console.error('Error creating test user:', authError);
      throw new Error(`Auth error: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('No user data returned after creation');
    }

    console.log('Test user created successfully');

    // Create the test profile
    const testProfile = {
      id: authData.user.id, // Use the user's ID
      name: 'Test User',
      role: 'user',
      location: { address: 'Test Location' },
      registered_at: new Date().toISOString(),
      profile_complete: true
    };

    console.log('Creating test profile...');
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert(testProfile);

    if (profileError) {
      console.error('Error creating test profile:', profileError);
      throw new Error(`Profile error: ${profileError.message}`);
    }

    console.log('Successfully created test profile');

    // Clean up test data
    console.log('Cleaning up test data...');
    
    // Delete the profile first
    const { error: deleteProfileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', authData.user.id);

    if (deleteProfileError) {
      console.error('Error deleting test profile:', deleteProfileError);
    } else {
      console.log('Successfully deleted test profile');
    }

    // Delete the user
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(
      authData.user.id
    );

    if (deleteUserError) {
      console.error('Error deleting test user:', deleteUserError);
    } else {
      console.log('Successfully deleted test user');
    }

    console.log('Database check completed successfully');

  } catch (error) {
    console.error('Error checking database:', error);
    throw error;
  }
}

checkDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to check database:', error);
    process.exit(1);
  }); 