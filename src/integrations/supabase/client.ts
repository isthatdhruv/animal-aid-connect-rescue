// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ibispskwmzybgtavfznd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaXNwc2t3bXp5Ymd0YXZmem5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MDUzNzgsImV4cCI6MjA2MTE4MTM3OH0.3YR_s4hIejNn_gi-LxYR7mdJqMVVJY5cSIssrnWL-J0';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);