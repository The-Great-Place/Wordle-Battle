function readRequiredEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY') {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const supabaseUrl = readRequiredEnv('VITE_SUPABASE_URL');
export const supabaseAnonKey = readRequiredEnv('VITE_SUPABASE_ANON_KEY');
