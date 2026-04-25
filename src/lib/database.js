import { supabase } from './supabase'

// ─── COURSES ────────────────────────────────────────────────────────
export async function getCourses() {
  const { data, error } = await supabase.from('courses').select('*').order('id')
  if (error) throw error
  return data
}

export async function getCourseById(id) {
  const { data, error } = await supabase.from('courses').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

// ─── ENROLLMENTS ────────────────────────────────────────────────────
export async function getMyEnrollments(userId) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, courses(*), completed_lessons(lesson_number), bookings(*), assessments(*)')
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createEnrollment(userId, courseId, pkg, credits) {
  const { data: enr, error: enrErr } = await supabase
    .from('enrollments')
    .insert({ user_id: userId, course_id: courseId, package: pkg, credits, used: 0 })
    .select()
    .single()
  if (enrErr) throw enrErr

  // Create initial diagnostic assessment
  await supabase.from('assessments').insert({
    enrollment_id: enr.id,
    title: 'Diagnostic Assessment',
    type: 'baseline',
    max_score: 100,
    done: false
  })

  return enr
}

// ─── BOOKINGS ───────────────────────────────────────────────────────
export async function getBookingsForStudent(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, courses(title, icon, color)')
    .eq('student_id', userId)
    .order('date', { ascending: true })
  if (error) throw error
  return data
}

export async function getBookingsForTutor(tutorId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, courses(title), profiles!bookings_student_id_fkey(name)')
    .eq('tutor_id', tutorId)
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function getAllBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, courses(title), profiles!bookings_student_id_fkey(name)')
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function createBooking(enrollmentId, studentId, courseId, date, time, lessonNumber) {
  const meetId = String(Math.floor(Math.random() * 900000000 + 100000000))
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      enrollment_id: enrollmentId,
      student_id: studentId,
      course_id: courseId,
      date, time,
      lesson_number: lessonNumber,
      status: 'scheduled',
      zoom_link: `https://zoom.us/j/${meetId}?pwd=lbe${Math.random().toString(36).slice(2, 10)}`,
      meeting_id: meetId.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
    })
    .select()
    .single()
  if (error) throw error

  // Increment used credits
  await supabase.rpc('increment_used', { enroll_id: enrollmentId })

  // Mark lesson as completed
  await supabase.from('completed_lessons').insert({
    enrollment_id: enrollmentId,
    lesson_number: lessonNumber
  })

  return data
}

export async function updateBookingZoom(bookingId, zoomLink, meetingId) {
  const { error } = await supabase
    .from('bookings')
    .update({ zoom_link: zoomLink, meeting_id: meetingId })
    .eq('id', bookingId)
  if (error) throw error
}

// ─── ASSESSMENTS ────────────────────────────────────────────────────
export async function getAssessmentsForEnrollments(userId) {
  const { data, error } = await supabase
    .from('assessments')
    .select('*, enrollments!inner(user_id, course_id, courses(title, color))')
    .eq('enrollments.user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function updateAssessment(assessmentId, updates) {
  const { error } = await supabase
    .from('assessments')
    .update(updates)
    .eq('id', assessmentId)
  if (error) throw error
}

// ─── INVOICES ───────────────────────────────────────────────────────
export async function getInvoices(tutorId) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('tutor_id', tutorId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function submitInvoice(tutorId, period, sessionsCount, hours, rate, total) {
  const { data, error } = await supabase
    .from('invoices')
    .insert({
      tutor_id: tutorId, period,
      sessions_count: sessionsCount, hours, rate, total,
      status: 'pending',
      submitted_at: new Date().toISOString().split('T')[0]
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── PAYOUTS ────────────────────────────────────────────────────────
export async function getPayouts() {
  const { data, error } = await supabase
    .from('payouts')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function approvePayout(payoutId) {
  const { error } = await supabase
    .from('payouts')
    .update({ status: 'approved' })
    .eq('id', payoutId)
  if (error) throw error
}

export async function markPayoutPaid(payoutId) {
  const ref = 'BACS-' + Math.random().toString(36).slice(2, 10).toUpperCase()
  const { error } = await supabase
    .from('payouts')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString().split('T')[0],
      reference: ref
    })
    .eq('id', payoutId)
  if (error) throw error
}

// ─── SESSION NOTES ──────────────────────────────────────────────────
export async function submitSessionNotes(bookingId, tutorId, attendance, actualDuration, privateNotes, parentSummary) {
  const { error: notesErr } = await supabase
    .from('session_notes')
    .insert({
      booking_id: bookingId, tutor_id: tutorId,
      attendance, actual_duration: actualDuration,
      private_notes: privateNotes, parent_summary: parentSummary
    })
  if (notesErr) throw notesErr

  // Mark booking as completed
  await supabase.from('bookings').update({ status: 'completed' }).eq('id', bookingId)
}

// ─── ADMIN QUERIES ──────────────────────────────────────────────────
export async function getTutors() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'tutor')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getStudentsList() {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, profiles(name), courses(title)')
    .order('enrolled_at', { ascending: false })
  if (error) throw error
  return data
}

export async function approveTutor(tutorId) {
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'active' })
    .eq('id', tutorId)
  if (error) throw error
}

export async function updatePayRate(tutorId, payRate) {
  const { error } = await supabase
    .from('profiles')
    .update({ pay_rate: payRate })
    .eq('id', tutorId)
  if (error) throw error
}

export async function getAdminStats() {
  const [tutors, students, bookings, payouts] = await Promise.all([
    supabase.from('profiles').select('id, status', { count: 'exact' }).eq('role', 'tutor'),
    supabase.from('enrollments').select('id', { count: 'exact' }),
    supabase.from('bookings').select('id, status', { count: 'exact' }).eq('status', 'scheduled'),
    supabase.from('payouts').select('id, status, total')
  ])
  return {
    tutorCount: tutors.count || 0,
    pendingTutors: (tutors.data || []).filter(t => t.status === 'pending').length,
    studentCount: students.count || 0,
    liveBookings: bookings.count || 0,
    pendingPayouts: (payouts.data || []).filter(p => p.status === 'pending').length,
    pendingPayoutTotal: (payouts.data || []).filter(p => p.status === 'pending').reduce((a, p) => a + Number(p.total), 0)
  }
}

// ─── CONTACT ────────────────────────────────────────────────────────
export async function submitContactMessage(name, email, message) {
  const { error } = await supabase
    .from('contact_messages')
    .insert({ name, email, message })
  if (error) throw error
}

// ─── SCORE HISTORY & UNIT PROGRESS ─────────────────────────────────
export async function getScoreHistory(enrollmentId) {
  const { data, error } = await supabase
    .from('score_history')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('week_label')
  if (error) throw error
  return data
}

export async function getUnitProgress(enrollmentId) {
  const { data, error } = await supabase
    .from('unit_progress')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('unit_name')
  if (error) throw error
  return data
}

// ─── PARENT HELPERS ─────────────────────────────────────────────────
export async function getChildProfile(childId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', childId)
    .single()
  if (error) throw error
  return data
}

export async function getChildEnrollments(childId) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, courses(*), completed_lessons(lesson_number), bookings(*), assessments(*)')
    .eq('user_id', childId)
    .order('enrolled_at', { ascending: false })
  if (error) throw error
  return data
}
