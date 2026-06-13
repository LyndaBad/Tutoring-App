// Per-tutor iCal subscription feed.
// Subscribe in Google/Apple/Outlook to:  /api/calendar?tutor=<tutorId>
// New bookings appear automatically (calendar apps re-fetch periodically).
import { supaReady, supaGet } from './_supa.js';

function icsDate(iso) {
  // 2026-06-12T15:30:00Z -> 20260612T153000Z
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}
function esc(s) {
  return String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
}

export default async function handler(req, res) {
  const tutor = req.query.tutor;
  if (!tutor) return res.status(400).send('tutor query param required');
  if (!supaReady()) return res.status(200).send('BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR');

  try {
    // Bookings where this person is the tutor (covers admin/principal tutor too).
    const bookings = await supaGet(
      `bookings?tutor_id=eq.${tutor}&status=neq.cancelled&select=*&order=session_date`
    );
    // Map student names.
    const ids = [...new Set(bookings.map(b => b.student_id).filter(Boolean))];
    let names = {};
    if (ids.length) {
      const profs = await supaGet(`profiles?id=in.(${ids.join(',')})&select=id,name`);
      names = Object.fromEntries(profs.map(p => [p.id, p.name]));
    }

    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Lynda Badmus Education//Tutor Calendar//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:LBE Lessons'];
    for (const b of bookings) {
      const start = b.starts_at || `${b.session_date}T${b.session_time || '00:00'}:00Z`;
      const startMs = new Date(start).getTime();
      const end = new Date(startMs + 60 * 60 * 1000).toISOString();
      const who = names[b.student_id] || 'Student';
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${b.id}@lbe`);
      lines.push(`DTSTAMP:${icsDate(new Date().toISOString())}`);
      lines.push(`DTSTART:${icsDate(start)}`);
      lines.push(`DTEND:${icsDate(end)}`);
      lines.push(`SUMMARY:${esc(`Lesson — ${who} (${b.course_id})`)}`);
      if (b.zoom_url) lines.push(`URL:${esc(b.zoom_url)}`);
      if (b.zoom_url) lines.push(`DESCRIPTION:${esc(`Zoom: ${b.zoom_url}`)}`);
      lines.push('BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Lesson in 1 hour', 'END:VALARM');
      lines.push('BEGIN:VALARM', 'TRIGGER:-PT10M', 'ACTION:DISPLAY', 'DESCRIPTION:Lesson in 10 minutes', 'END:VALARM');
      lines.push('END:VEVENT');
    }
    lines.push('END:VCALENDAR');

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).send(lines.join('\r\n'));
  } catch (e) {
    return res.status(500).send('Error: ' + String(e.message || e));
  }
}
