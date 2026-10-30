import { useEffect, useMemo, useState } from 'react'
import { AppContext } from './appContext.js'
import { initialAnnouncements, initialAssignments, initialNotifications, initialStudents, initialSubmissions, initialTeachers } from '../data/mockData.js'

const STORAGE_KEY = 'acadex-demo-v1'

function readStoredState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Unable to read Acadex demo data from local storage.', error)
    return {}
  }
}

export function AppProvider({ children }) {
  const [storedState] = useState(readStoredState)
  const [user, setUser] = useState(storedState.user || null)
  const [students, setStudents] = useState(storedState.students || initialStudents)
  const [teachers, setTeachers] = useState(storedState.teachers || initialTeachers)
  const [assignments, setAssignments] = useState(storedState.assignments || initialAssignments)
  const [submissions, setSubmissions] = useState(storedState.submissions || initialSubmissions)
  const [announcements, setAnnouncements] = useState(storedState.announcements || initialAnnouncements)
  const [notifications, setNotifications] = useState(storedState.notifications || initialNotifications)
  const [attendance, setAttendance] = useState(storedState.attendance || {})
  const [messages, setMessages] = useState(storedState.messages || {})

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, students, teachers, assignments, submissions, announcements, notifications, attendance, messages }))
    } catch (error) {
      console.error('Unable to save Acadex demo data to local storage.', error)
    }
  }, [user, students, teachers, assignments, submissions, announcements, notifications, attendance, messages])

  const value = useMemo(() => ({
    user,
    login: (role, email) => setUser({ role, email, name: role === 'Parent' ? 'Jamie Chen' : role === 'Student' ? 'Olivia Chen' : role === 'Teacher' ? 'Sophie Anderson' : 'Alex Morgan' }),
    logout: () => setUser(null),
    students,
    setStudents,
    teachers,
    setTeachers,
    assignments,
    setAssignments,
    submissions,
    setSubmissions,
    announcements,
    setAnnouncements,
    notifications,
    setNotifications,
    attendance,
    setAttendance,
    messages,
    setMessages,
  }), [user, students, teachers, assignments, submissions, announcements, notifications, attendance, messages])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
