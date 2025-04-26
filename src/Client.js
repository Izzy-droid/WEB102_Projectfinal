import { createClient } from '@supabase/supabase-js'

const API_KEY = import.meta.env.VITE_APP_SUPABASE_KEY;
const URL = import.meta.env.VITE_APP_SUPABASE_URL;
const supabase = createClient(URL, API_KEY);



export default supabase;