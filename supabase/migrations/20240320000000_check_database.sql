-- Function to get table columns
CREATE OR REPLACE FUNCTION public.get_table_columns(table_name text)
RETURNS TABLE (
    column_name text,
    data_type text,
    is_nullable text,
    column_default text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.column_name::text,
        c.data_type::text,
        c.is_nullable::text,
        c.column_default::text
    FROM 
        information_schema.columns c
    WHERE 
        c.table_schema = 'public'
        AND c.table_name = get_table_columns.table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get table policies
CREATE OR REPLACE FUNCTION public.get_policies(table_name text)
RETURNS TABLE (
    policy_name text,
    permissive text,
    roles text[],
    cmd text,
    qual text,
    with_check text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.policyname::text,
        p.permissive::text,
        p.roles::text[],
        p.cmd::text,
        p.qual::text,
        p.with_check::text
    FROM 
        pg_policies p
    WHERE 
        p.schemaname = 'public'
        AND p.tablename = get_policies.table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check profiles table structure
DO $$
BEGIN
    -- Check if profiles table has required columns
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'id'
    ) THEN
        RAISE EXCEPTION 'profiles table is missing id column';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'name'
    ) THEN
        RAISE EXCEPTION 'profiles table is missing name column';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'role'
    ) THEN
        RAISE EXCEPTION 'profiles table is missing role column';
    END IF;

    -- Add any missing columns
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'location'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN location jsonb;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'registered_at'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN registered_at timestamptz DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'profile_complete'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN profile_complete boolean DEFAULT false;
    END IF;

    -- Ensure RLS is enabled
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Create or replace RLS policies
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    CREATE POLICY "Users can view their own profile"
        ON public.profiles
        FOR SELECT
        USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    CREATE POLICY "Users can update their own profile"
        ON public.profiles
        FOR UPDATE
        USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
    CREATE POLICY "Service role can manage all profiles"
        ON public.profiles
        FOR ALL
        USING (auth.role() = 'service_role');

    RAISE NOTICE 'Database check completed successfully';
END $$; 