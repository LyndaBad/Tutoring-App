// Emails the tutor (and admin) when a lesson is booked.
// POST { bookingId }
import { supaReady, supaGet, sendEmail } from './_supa.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!supaReady()) return res.status(200).json({ ok: false, reason: 'supabase service key not configured' });

  try {
    const { bookingId } = req.body || {};
    if (!bookingId) return res.status(400).json({ error: 'bookingId required' });

    const rows = await supaGet(`bookings?id=eq.${bookingId}&select=*`);
    const b = rows[0];
    if (!b) return res.status(404).json({ error: 'booking not found' });

    // Recipients: assigned tutor + all admins.
    const admins = await supaGet(`profiles?role=eq.admin&select=email,name`);
    let tutor = [];
    if (b.tutor_id) tutor = await supaGet(`profiles?id=eq.${b.tutor_id}&select=email,name`);
    let student = [];
    if (b.student_id) student = await supaGet(`profiles?id=eq.${b.student_id}&select=name`);

    const studentName = student[0]?.name || 'A student';
    const when = `${b.session_date} at ${String(b.session_time).slice(0, 5)}`;
    const to = [...tutor.map(t => t.email), ...admins.map(a => a.email)];

    const html = `
      <div style="font-family:Arial,sans-serif;color:#1D1A33">
        <h2 style="color:#4F3DF5">New lesson booked</h2>
        <p><strong>${studentName}</strong> has booked a lesson.</p>
        <table style="font-size:14px">
          <tr><td style="color:#6E6A8A;padding:2px 12px 2px 0">Course</td><td>${b.course_id}</td></tr>
          <tr><td style="color:#6E6A8A;padding:2px 12px 2px 0">When</td><td>${when}</td></tr>
          ${b.lesson_number ? `<tr><td style="color:#6E6A8A;padding:2px 12px 2px 0">Lesson</td><td>${b.lesson_number}</td></tr>` : ''}
          ${b.zoom_url ? `<tr><td style="color:#6E6A8A;padding:2px 12px 2px 0">Zoom</td><td><a href="${b.zoom_url}">${b.zoom_url}</a></td></tr>` : ''}
        </table>
        <p style="font-size:12px;color:#9A96B8">You'll get reminders 1 hour and 10 minutes before the lesson.</p>
      </div>`;

    const result = await sendEmail({ to, subject: `New lesson booked — ${studentName} (${when})`, html });
    await supaGetPatchNotified(bookingId);
    return res.status(200).json({ ok: true, result });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}

async function supaGetPatchNotified(id) {
  try {
    const { supaPatch } = await import('./_supa.js');
    await supaPatch(`bookings?id=eq.${id}`, { notified: true });
  } catch {}
}
