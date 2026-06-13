// Cron endpoint: sends 1-hour and 10-minute lesson reminders.
// Call every ~5 minutes:  GET /api/send-reminders?secret=YOUR_CRON_SECRET
import { supaReady, supaGet, supaPatch, sendEmail } from './_supa.js';

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET || '';
  if (secret && req.query.secret !== secret) return res.status(401).json({ error: 'unauthorized' });
  if (!supaReady()) return res.status(200).json({ ok: false, reason: 'supabase service key not configured' });

  try {
    const now = Date.now();
    const horizon = new Date(now + 75 * 60 * 1000).toISOString();
    const nowIso = new Date(now).toISOString();

    // Upcoming scheduled bookings within the next 75 minutes that still need a reminder.
    const bookings = await supaGet(
      `bookings?status=eq.scheduled&starts_at=gte.${nowIso}&starts_at=lte.${horizon}` +
      `&or=(reminded_1h.is.false,reminded_10m.is.false)&select=*`
    );

    const admins = await supaGet(`profiles?role=eq.admin&select=email`);
    const adminEmails = admins.map(a => a.email);
    const sent = [];

    for (const b of bookings) {
      if (!b.starts_at) continue;
      const mins = (new Date(b.starts_at).getTime() - now) / 60000;

      let tutor = [];
      if (b.tutor_id) tutor = await supaGet(`profiles?id=eq.${b.tutor_id}&select=email,name`);
      const to = [...tutor.map(t => t.email), ...adminEmails];
      const when = `${b.session_date} at ${String(b.session_time).slice(0, 5)}`;

      const mail = (lead) => ({
        to,
        subject: `Reminder: lesson in ${lead} — ${when}`,
        html: `<div style="font-family:Arial,sans-serif;color:#1D1A33">
          <h2 style="color:#4F3DF5">Your lesson starts in ${lead}</h2>
          <table style="font-size:14px">
            <tr><td style="color:#6E6A8A;padding:2px 12px 2px 0">Course</td><td>${b.course_id}</td></tr>
            <tr><td style="color:#6E6A8A;padding:2px 12px 2px 0">When</td><td>${when}</td></tr>
            ${b.zoom_url ? `<tr><td style="color:#6E6A8A;padding:2px 12px 2px 0">Zoom</td><td><a href="${b.zoom_url}">Join</a></td></tr>` : ''}
          </table></div>`,
      });

      if (mins <= 65 && mins >= 50 && !b.reminded_1h) {
        await sendEmail(mail('1 hour'));
        await supaPatch(`bookings?id=eq.${b.id}`, { reminded_1h: true });
        sent.push({ id: b.id, lead: '1h' });
      }
      if (mins <= 12 && mins >= 0 && !b.reminded_10m) {
        await sendEmail(mail('10 minutes'));
        await supaPatch(`bookings?id=eq.${b.id}`, { reminded_10m: true });
        sent.push({ id: b.id, lead: '10m' });
      }
    }

    return res.status(200).json({ ok: true, checked: bookings.length, sent });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}
