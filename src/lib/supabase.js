import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Running in demo mode — auth calls will fail gracefully and demo logins still work. ' +
    'Set both env vars (in .env locally, or in Vercel → Settings → Environment Variables) to enable real accounts.'
  )
}

// Never pass empty strings to createClient — it throws at module load and
// white-screens the whole app. Use harmless placeholders instead; any network
// call simply fails and the UI falls back to demo mode.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-anon-key'
)
