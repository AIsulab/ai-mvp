import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || "";
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// 플레이스홀더 기본값 필터링 및 유효성 검사
const isValidConfig = supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== "https://your-project-id.supabase.co" && 
  supabaseKey !== "your-anon-key-here";

// URL/Key가 없거나 플레이스홀더이면 더미 클라이언트 (게스트 전용 모드)
export const supabase = isValidConfig
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isSupabaseConfigured = Boolean(isValidConfig);
