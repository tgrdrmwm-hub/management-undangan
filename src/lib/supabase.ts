import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'sb_project_url';
const STORAGE_KEY_KEY = 'sb_anon_key';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Mendapatkan konfigurasi Supabase saat ini (dari ENV atau localStorage).
 */
export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean; source: 'env' | 'storage' | 'none' } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

  if (envUrl && envKey && !envUrl.includes('YOUR_SUPABASE')) {
    return { url: envUrl, anonKey: envKey, isConfigured: true, source: 'env' };
  }

  const storedUrl = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) : null)?.trim() || '';
  const storedKey = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) : null)?.trim() || '';

  if (storedUrl && storedKey) {
    return { url: storedUrl, anonKey: storedKey, isConfigured: true, source: 'storage' };
  }

  return { url: '', anonKey: '', isConfigured: false, source: 'none' };
}

/**
 * Menginisialisasi atau mengambil instance Supabase Client.
 */
export function getSupabase(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
    } catch (err) {
      console.warn('Gagal menginisialisasi Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

/**
 * Menyimpan konfigurasi Supabase ke localStorage untuk testing langsung dari UI.
 */
export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    supabaseInstance = null; // reset instance agar reload dengan kredensial baru
  }
}

/**
 * Menghapus konfigurasi Supabase dari localStorage.
 */
export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_KEY_KEY);
    supabaseInstance = null;
  }
}

/**
 * Cek apakah Supabase sudah terkonfigurasi.
 */
export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured;
}

/**
 * Mengetes koneksi ke Supabase dengan query ringan ke tabel themes / wedding_projects.
 */
export async function testSupabaseConnection(overrideUrl?: string, overrideKey?: string): Promise<{ success: boolean; message: string; themeCount?: number }> {
  let client: SupabaseClient | null = null;

  if (overrideUrl && overrideKey) {
    try {
      client = createClient(overrideUrl.trim(), overrideKey.trim());
    } catch (e: any) {
      return { success: false, message: `Format URL atau Key tidak valid: ${e.message}` };
    }
  } else {
    client = getSupabase();
  }

  if (!client) {
    return { success: false, message: 'URL dan Anon Key Supabase belum dikonfigurasi.' };
  }

  try {
    const { data, error } = await client.from('themes').select('id', { count: 'exact' }).limit(1);
    if (error) {
      // Jika tabel themes belum dibuat, coba test cek koneksi dasar
      if (error.code === '42P01') {
        return { 
          success: false, 
          message: 'Terkoneksi ke Supabase, namun tabel "themes" belum dibuat. Jalankan SQL Schema di SQL Editor Supabase terlebih dahulu.' 
        };
      }
      return { success: false, message: `Supabase Error (${error.code}): ${error.message}` };
    }

    return { 
      success: true, 
      message: 'Koneksi ke Supabase berhasil! Database dan tabel aktif.',
      themeCount: data?.length ?? 0
    };
  } catch (err: any) {
    return { success: false, message: `Koneksi gagal: ${err.message || 'Network error'}` };
  }
}
