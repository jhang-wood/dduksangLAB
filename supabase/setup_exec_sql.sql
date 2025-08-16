-- Create exec_sql function for executing dynamic SQL
-- This function needs to be created in Supabase dashboard first

CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;