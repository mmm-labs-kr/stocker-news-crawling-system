export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://172.20.10.3:8000/api/v1',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
};
