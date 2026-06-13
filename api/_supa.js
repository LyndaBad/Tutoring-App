// Tiny server-side Supabase REST helper using the service-role key (bypasses RLS).
// Requires env: SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.
const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function supaReady() {
  return Boolean(URL && KEY);
}

export async function supaGet(path) {
  const r = await fetch(`${URL}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!r.ok) throw new Error(`supaGet ${path}: ${r.status} ${await r.text()}`);
  return r.json();
}

export async function supaPatch(path, body) {
  const r = await fetch(`${URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`supaPatch ${path}: ${r.status} ${await r.text()}`);
  return true;
}

export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.REMINDER_FROM || 'Lynda Badmus Education <onboarding@resend.dev>';
  if (!apiKey) return { skipped: 'no RESEND_API_KEY' };
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (!recipients.length) return { skipped: 'no recipients' };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: recipients, subject, html }),
  });
  const data = await r.json().catch(() => ({}));
  return { status: r.status, data };
}

export function courseTitleFromId(id) {
  return id || 'Lesson';
}
