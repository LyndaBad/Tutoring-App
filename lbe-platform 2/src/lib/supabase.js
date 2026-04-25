import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Creates a single shared client for the whole app.
// Falls back gracefully if env vars are not set (demo/mock mode still works).
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

/** True when Supabase is configured (not demo-only mode) */
export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey)

/**
 * Build the flat user object the App UI expects from a Supabase auth user + profile row.
 * Shape must match USERS[] mock objects so all existing UI code keeps working.
 */
export async function buildUserFromSession(authUser) {
  if (!supabase) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, avatar_url')
    .eq('id', authUser.id)
    .single()

  if (!profile) return null

  const av = profile.full_name
    ? profile.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  // Load enrollments if student
  let enrollments = []
  if (profile.role === 'student') {
    const { data: rows } = await supabase
      .from('enrollments')
      .select(`
        id,
        course_id,
        package_type,
        credits_total,
        credits_used,
        enrolled_at,
        bookings (
          id,
          scheduled_date,
          scheduled_time,
          status,
          zoom_link,
          zoom_meeting_id
        ),
        assessment_results (
          id,
          score,
          max_score,
          grade,
          tutor_feedback,
          visible_to_student,
          completed_at,
          assessments ( title, type )
        )
      `)
      .eq('student_id', authUser.id)
      .eq('status', 'active')

    enrollments = (rows || []).map(e => ({
      id: e.id,
      courseId: e.course_id,
      pkg: e.package_type,
      credits: e.credits_total,
      used: e.credits_used,
      enrolledAt: e.enrolled_at,
      completedLessons: [],   // loaded separately via student_progress if needed
      bookings: (e.bookings || []).map(b => ({
        id: b.id,
        date: b.scheduled_date,
        time: b.scheduled_time,
        status: b.status,
        zoom: b.zoom_link || '',
        meetingId: b.zoom_meeting_id || '',
        tutor: 'Lynda Badmus',
        ln: 0,
      })),
      assessments: (e.assessment_results || []).map(r => ({
        id: r.id,
        title: r.assessments?.title || 'Assessment',
        type: r.assessments?.type || 'topic_check',
        score: r.score,
        max: r.max_score,
        done: r.completed_at !== null,
        notes: r.tutor_feedback || '',
        date: r.completed_at,
        strengths: [],
        work: [],
      })),
    }))
  }

  // Parent — load linked child id
  let childId = null
  let childName = null
  if (profile.role === 'parent') {
    const { data: link } = await supabase
      .from('parent_student_links')
      .select('student_id, nickname, student:profiles!student_id(full_name)')
      .eq('parent_id', authUser.id)
      .limit(1)
      .maybeSingle()

    if (link) {
      childId = link.student_id
      childName = link.student?.full_name || link.nickname || 'Your child'
    }
  }

  return {
    id: authUser.id,
    email: authUser.email,
    name: profile.full_name,
    role: profile.role,
    av,
    enrollments,
    childId,
    childName,
    // No `pw` field — presence of pw is how we detect mock vs real users
  }
}
