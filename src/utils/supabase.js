import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.SUPABASE_PUBLIC_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars. Check that `.env.local` defines `SUPABASE_PROJECT_URL` and `SUPABASE_PUBLIC_KEY`.",
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
