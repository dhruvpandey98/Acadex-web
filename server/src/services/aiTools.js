import { AppError } from '../utils/errors.js'
import {
  Assignment,
  Attendance,
  Grade,
  Parent,
  SchoolClass,
  Student,
  Submission,
  Teacher,
  Timetable,
} from '../models/index.js'

const normalizeId = (value) => {
  if (!value) return null
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (value && typeof value === 'object' && value._id) return String(value._id)
  return String(value)
}

const getUserId = (user) => user?._id ?? user?.id ?? user?.userId

function enforceRole(user, roles) {
  if (!user || !roles.includes(user.role)) {
    throw new AppError(403, 'You do not have permission to use this teacher or school administration tool.')
  }
}

async function getStudentRecord(user, studentId) {
  const targetStudentId = normalizeId(studentId || (user.role === 'student' ? user._id : null))

  if (user.role === 'student') {
    const record = await Student.findOne({ userId: getUserId(user) }).populate('classId', 'name section').lean()
    if (!record) throw new AppError(404, 'No student record was found for your account.')
    return record
  }

  if (user.role === 'admin') {
    const record = await Student.findById(targetStudentId).populate('classId', 'name section').lean()
    if (!record) throw new AppError(404, 'Student record not found.')
    return record
  }

  if (user.role === 'teacher') {
    const teacher = await Teacher.findOne({ userId: getUserId(user) }).select('_id assignedClasses').lean()
    const classIds = teacher?.assignedClasses || []
    const record = await Student.findOne({ _id: targetStudentId, classId: { $in: classIds } }).populate('classId', 'name section').lean()
    if (!record) throw new AppError(403, 'You are not authorized to access that student record.')
    return record
  }

  if (user.role === 'parent') {
    const parent = await Parent.findOne({ userId: getUserId(user) }).select('children').lean()
    const childIds = (parent?.children || []).map((id) => String(id))
    if (!targetStudentId || !childIds.includes(targetStudentId)) {
      throw new AppError(403, 'You can only access your own linked child records.')
    }
    const record = await Student.findById(targetStudentId).populate('classId', 'name section').lean()
    if (!record) throw new AppError(403, 'You can only access your own linked child records.')
    return record
  }

  throw new AppError(403, 'This user role cannot access student records.')
}

async function getTeacherClassIds(user) {
  if (user.role === 'admin') {
    return (await SchoolClass.find().select('_id').lean()).map((schoolClass) => String(schoolClass._id))
  }

  if (user.role === 'teacher') {
    const teacher = await Teacher.findOne({ userId: getUserId(user) }).select('assignedClasses').lean()
    return (teacher?.assignedClasses || []).map((id) => String(id))
  }

  return []
}

function buildAttendanceSummary(attendanceRows) {
  const total = attendanceRows.length
  const present = attendanceRows.filter((record) => ['present', 'late'].includes(record.status)).length
  const absent = attendanceRows.filter((record) => record.status === 'absent').length
  const excused = attendanceRows.filter((record) => record.status === 'excused').length
  const percentage = total ? Math.round((present / total) * 100) : 0

  return { total, present, absent, excused, percentage }
}

export function getAcademicToolDefinitions() {
  const definitions = [
    {
      name: 'getStudentProfile',
      description: 'Retrieve the authenticated student profile or the current parent/teacher/admin authorized student profile.',
      parameters: {
        type: 'OBJECT',
        properties: {
          studentId: { type: 'STRING', description: 'Optional student id when the caller is an admin, teacher, or parent with a linked child.' },
        },
        required: [],
      },
    },
    {
      name: 'getStudentAttendance',
      description: 'Retrieve attendance records and calculate the attendance percentage for the authenticated student.',
      parameters: {
        type: 'OBJECT',
        properties: {
          startDate: { type: 'STRING', description: 'Optional ISO date (YYYY-MM-DD) to start the attendance range.' },
          endDate: { type: 'STRING', description: 'Optional ISO date (YYYY-MM-DD) to end the attendance range.' },
        },
        required: [],
      },
    },
    {
      name: 'getStudentGrades',
      description: 'Retrieve subject-wise grades and compute the overall academic performance for the authenticated student.',
      parameters: { type: 'OBJECT', properties: {}, required: [] },
    },
    {
      name: 'getStudentAssignments',
      description: 'Retrieve assignment progress for the authenticated student, including submitted, pending, and overdue items.',
      parameters: { type: 'OBJECT', properties: {}, required: [] },
    },
    {
      name: 'getStudentTimetable',
      description: 'Retrieve the authenticated student timetable for their current class.',
      parameters: { type: 'OBJECT', properties: {}, required: [] },
    },
    {
      name: 'getTeacherClasses',
      description: 'Retrieve the classes assigned to the authenticated teacher.',
      parameters: { type: 'OBJECT', properties: {}, required: [] },
    },
    {
      name: 'getClassStudents',
      description: 'Retrieve the students in an authorized class.',
      parameters: {
        type: 'OBJECT',
        properties: {
          classId: { type: 'STRING', description: 'Class id for the target class.' },
        },
        required: ['classId'],
      },
    },
    {
      name: 'getClassAttendance',
      description: 'Retrieve attendance statistics for an authorized class within a requested date range.',
      parameters: {
        type: 'OBJECT',
        properties: {
          classId: { type: 'STRING', description: 'Class id for the target class.' },
          startDate: { type: 'STRING', description: 'Optional ISO date (YYYY-MM-DD).' },
          endDate: { type: 'STRING', description: 'Optional ISO date (YYYY-MM-DD).' },
        },
        required: ['classId'],
      },
    },
    {
      name: 'getClassPerformance',
      description: 'Retrieve grade summaries and average academic performance for an authorized class.',
      parameters: {
        type: 'OBJECT',
        properties: {
          classId: { type: 'STRING', description: 'Class id for the target class.' },
        },
        required: ['classId'],
      },
    },
    {
      name: 'getPendingSubmissions',
      description: 'Retrieve assignments that are waiting for teacher review for the authenticated teacher or administrator.',
      parameters: {
        type: 'OBJECT',
        properties: {
          classId: { type: 'STRING', description: 'Optional class filter.' },
        },
        required: [],
      },
    },
    {
      name: 'getSchoolStatistics',
      description: 'Retrieve school-wide statistics including total students, teachers, classes, and average attendance.',
      parameters: { type: 'OBJECT', properties: {}, required: [] },
    },
    {
      name: 'getAttendanceAnalytics',
      description: 'Retrieve attendance analytics for a requested date range across the school.',
      parameters: {
        type: 'OBJECT',
        properties: {
          startDate: { type: 'STRING', description: 'ISO date (YYYY-MM-DD) when analytics should begin.' },
          endDate: { type: 'STRING', description: 'ISO date (YYYY-MM-DD) when analytics should end.' },
        },
        required: ['startDate', 'endDate'],
      },
    },
    {
      name: 'getAcademicAnalytics',
      description: 'Retrieve school-wide academic performance analytics based on current grade records.',
      parameters: { type: 'OBJECT', properties: {}, required: [] },
    },
    {
      name: 'getStudentRecords',
      description: 'Search school student records using admission number, class, section, or a text query.',
      parameters: {
        type: 'OBJECT',
        properties: {
          search: { type: 'STRING', description: 'Optional search text for name or admission number.' },
          classId: { type: 'STRING', description: 'Optional class id filter.' },
          section: { type: 'STRING', description: 'Optional section filter.' },
          admissionNumber: { type: 'STRING', description: 'Optional admission number filter.' },
        },
        required: [],
      },
    },
    {
      name: 'getAssignmentAnalytics',
      description: 'Retrieve assignment completion statistics across the school or a specific class.',
      parameters: {
        type: 'OBJECT',
        properties: {
          classId: { type: 'STRING', description: 'Optional class id filter.' },
          subjectId: { type: 'STRING', description: 'Optional subject id filter.' },
        },
        required: [],
      },
    },
    {
      name: 'getChildProfile',
      description: 'Retrieve the authenticated parent’s linked child profile.',
      parameters: {
        type: 'OBJECT',
        properties: {
          childId: { type: 'STRING', description: 'Linked child student id.' },
        },
        required: ['childId'],
      },
    },
    {
      name: 'getChildAttendance',
      description: 'Retrieve attendance records for the authenticated parent’s linked child.',
      parameters: {
        type: 'OBJECT',
        properties: {
          childId: { type: 'STRING', description: 'Linked child student id.' },
          startDate: { type: 'STRING', description: 'Optional ISO date (YYYY-MM-DD)' },
          endDate: { type: 'STRING', description: 'Optional ISO date (YYYY-MM-DD)' },
        },
        required: ['childId'],
      },
    },
    {
      name: 'getChildGrades',
      description: 'Retrieve subject-wise grades for the authenticated parent’s linked child.',
      parameters: {
        type: 'OBJECT',
        properties: {
          childId: { type: 'STRING', description: 'Linked child student id.' },
        },
        required: ['childId'],
      },
    },
    {
      name: 'getChildAssignments',
      description: 'Retrieve assignment status for the authenticated parent’s linked child.',
      parameters: {
        type: 'OBJECT',
        properties: {
          childId: { type: 'STRING', description: 'Linked child student id.' },
        },
        required: ['childId'],
      },
    },
    {
      name: 'getChildAcademicSummary',
      description: 'Generate a concise academic summary for the authenticated parent’s linked child.',
      parameters: {
        type: 'OBJECT',
        properties: {
          childId: { type: 'STRING', description: 'Linked child student id.' },
        },
        required: ['childId'],
      },
    },
  ]

  return definitions
}

async function ensureTeacherAccess(user, classId) {
  if (!classId) throw new AppError(400, 'A class id is required.')
  if (user.role === 'admin') return classId

  const teacher = await Teacher.findOne({ userId: getUserId(user) }).select('assignedClasses').lean()
  const allowedClasses = (teacher?.assignedClasses || []).map((id) => String(id))
  if (!allowedClasses.includes(String(classId))) {
    throw new AppError(403, 'You are not assigned to that class.')
  }
  return classId
}

async function ensureParentChildAccess(user, childId) {
  const parent = await Parent.findOne({ userId: getUserId(user) }).select('children').lean()
  const childIds = (parent?.children || []).map((id) => String(id))
  if (!childIds.includes(String(childId))) {
    throw new AppError(403, 'You can only access your own linked child records.')
  }
  return childId
}

const toolRegistry = {
  async getStudentProfile({ user, studentId } = {}) {
    const targetStudent = await getStudentRecord(user, studentId)
    return {
      student: {
        id: String(targetStudent._id),
        name: targetStudent.name,
        admissionNumber: targetStudent.admissionNumber,
        email: targetStudent.email,
        phone: targetStudent.phone,
        class: targetStudent.classId ? { id: String(targetStudent.classId._id), name: targetStudent.classId.name, section: targetStudent.classId.section } : null,
        section: targetStudent.section,
        status: targetStudent.status,
      },
    }
  },

  async getStudentAttendance({ user, startDate, endDate } = {}) {
    const targetStudent = await getStudentRecord(user)
    const query = { studentId: targetStudent._id }
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const records = await Attendance.find(query).sort({ date: 1 }).lean()
    return {
      studentId: String(targetStudent._id),
      attendance: records,
      summary: buildAttendanceSummary(records),
    }
  },

  async getStudentGrades({ user } = {}) {
    const targetStudent = await getStudentRecord(user)
    const grades = await Grade.find({ studentId: targetStudent._id }).populate('subjectId', 'name subjectCode').sort({ createdAt: -1 }).lean()
    const overallAverage = grades.length
      ? Math.round(grades.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / grades.length)
      : 0

    return {
      studentId: String(targetStudent._id),
      grades,
      overallAverage,
    }
  },

  async getStudentAssignments({ user } = {}) {
    const targetStudent = await getStudentRecord(user)
    const classId = targetStudent.classId?._id || targetStudent.classId
    const assignments = await Assignment.find({ classId }).populate('subjectId', 'name').sort({ dueDate: 1 }).lean()
    const submissions = await Submission.find({ studentId: targetStudent._id }).lean()

    const pending = []
    const submitted = []
    const overdue = []
    const submissionMap = new Map(submissions.map((submission) => [String(submission.assignmentId), submission]))

    for (const assignment of assignments) {
      const assignmentId = String(assignment._id)
      const submission = submissionMap.get(assignmentId)
      const isOverdue = new Date(assignment.dueDate) < new Date() && !submission
      if (submission) submitted.push({ assignmentId, title: assignment.title, status: submission.status, submittedAt: submission.submittedAt })
      else if (isOverdue) overdue.push({ assignmentId, title: assignment.title, dueDate: assignment.dueDate })
      else pending.push({ assignmentId, title: assignment.title, dueDate: assignment.dueDate })
    }

    return { studentId: String(targetStudent._id), pending, submitted, overdue }
  },

  async getStudentTimetable({ user } = {}) {
    const targetStudent = await getStudentRecord(user)
    const classId = targetStudent.classId?._id || targetStudent.classId
    const timetable = await Timetable.find({ classId }).populate('subjectId teacherId', 'name name').sort({ dayOfWeek: 1, startTime: 1 }).lean()
    return { classId: String(classId), timetable }
  },

  async getTeacherClasses({ user } = {}) {
    enforceRole(user, ['teacher', 'admin'])
    const classes = await SchoolClass.find({ _id: { $in: await getTeacherClassIds(user) } }).populate('subjects', 'name').lean()
    return { classes }
  },

  async getClassStudents({ user, classId } = {}) {
    enforceRole(user, ['teacher', 'admin'])
    const safeClassId = await ensureTeacherAccess(user, classId)
    const students = await Student.find({ classId: safeClassId }).select('name admissionNumber section rollNumber status').lean()
    return { classId: safeClassId, students }
  },

  async getClassAttendance({ user, classId, startDate, endDate } = {}) {
    enforceRole(user, ['teacher', 'admin'])
    const safeClassId = await ensureTeacherAccess(user, classId)
    const query = { classId: safeClassId }
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }
    const records = await Attendance.find(query).populate('studentId', 'name admissionNumber').lean()
    return { classId: safeClassId, attendance: records, summary: buildAttendanceSummary(records) }
  },

  async getClassPerformance({ user, classId } = {}) {
    enforceRole(user, ['teacher', 'admin'])
    const safeClassId = await ensureTeacherAccess(user, classId)
    const grades = await Grade.find({ classId: safeClassId }).populate('studentId subjectId', 'name name').lean()
    const average = grades.length ? Math.round(grades.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / grades.length) : 0
    return { classId: safeClassId, grades, average }
  },

  async getPendingSubmissions({ user, classId } = {}) {
    enforceRole(user, ['teacher', 'admin'])
    const query = {}
    if (classId) {
      query.classId = await ensureTeacherAccess(user, classId)
    } else if (user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: getUserId(user) }).select('assignedClasses').lean()
      query.classId = { $in: (teacher?.assignedClasses || []).map((id) => id) }
    }

    const assignments = await Assignment.find(query).populate('subjectId', 'name').lean()
    const pending = []
    for (const assignment of assignments) {
      const submissions = await Submission.find({ assignmentId: assignment._id, status: { $ne: 'reviewed' } }).populate('studentId', 'name').lean()
      pending.push({ assignment, pendingReviews: submissions })
    }
    return { pending }
  },

  async getSchoolStatistics({ user } = {}) {
    enforceRole(user, ['admin'])
    const [studentCount, teacherCount, classCount, attendanceRows] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      SchoolClass.countDocuments(),
      Attendance.find().lean(),
    ])

    return {
      totalStudents: studentCount,
      totalTeachers: teacherCount,
      totalClasses: classCount,
      averageAttendance: attendanceRows.length ? Math.round(attendanceRows.reduce((sum, record) => sum + (['present', 'late'].includes(record.status) ? 1 : 0), 0) / attendanceRows.length * 100) : 0,
    }
  },

  async getAttendanceAnalytics({ user, startDate, endDate } = {}) {
    enforceRole(user, ['admin'])
    const query = {}
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const records = await Attendance.find(query).lean()
    return {
      range: { startDate: startDate || null, endDate: endDate || null },
      records,
      summary: buildAttendanceSummary(records),
    }
  },

  async getAcademicAnalytics({ user } = {}) {
    enforceRole(user, ['admin'])
    const grades = await Grade.find().populate('subjectId studentId', 'name name').lean()
    const average = grades.length ? Math.round(grades.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / grades.length) : 0
    return { average, grades }
  },

  async getStudentRecords({ user, search, classId, section, admissionNumber } = {}) {
    enforceRole(user, ['admin'])
    const filters = {}
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }
    if (classId) filters.classId = classId
    if (section) filters.section = new RegExp(section, 'i')
    if (admissionNumber) filters.admissionNumber = new RegExp(admissionNumber, 'i')

    const students = await Student.find(filters).populate('classId', 'name section').lean()
    return { students }
  },

  async getAssignmentAnalytics({ user, classId, subjectId } = {}) {
    enforceRole(user, ['admin'])
    const filters = {}
    if (classId) filters.classId = classId
    if (subjectId) filters.subjectId = subjectId

    const assignments = await Assignment.find(filters).lean()
    const stats = await Promise.all(assignments.map(async (assignment) => {
      const totalSubmissions = await Submission.countDocuments({ assignmentId: assignment._id })
      const reviewed = await Submission.countDocuments({ assignmentId: assignment._id, status: 'reviewed' })
      return {
        assignmentId: String(assignment._id),
        title: assignment.title,
        classId: String(assignment.classId),
        totalSubmissions,
        reviewed,
        completionRate: totalSubmissions ? Math.round((reviewed / totalSubmissions) * 100) : 0,
      }
    }))

    return { stats }
  },

  async getChildProfile({ user, childId } = {}) {
    enforceRole(user, ['parent'])
    const targetId = await ensureParentChildAccess(user, childId)
    const child = await Student.findById(targetId).populate('classId', 'name section').lean()
    if (!child) throw new AppError(404, 'Linked child record not found.')
    return { child }
  },

  async getChildAttendance({ user, childId, startDate, endDate } = {}) {
    enforceRole(user, ['parent'])
    const targetId = await ensureParentChildAccess(user, childId)
    const query = { studentId: targetId }
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }
    const records = await Attendance.find(query).sort({ date: 1 }).lean()
    return { childId: targetId, attendance: records, summary: buildAttendanceSummary(records) }
  },

  async getChildGrades({ user, childId } = {}) {
    enforceRole(user, ['parent'])
    const targetId = await ensureParentChildAccess(user, childId)
    const grades = await Grade.find({ studentId: targetId }).populate('subjectId', 'name').lean()
    return { childId: targetId, grades }
  },

  async getChildAssignments({ user, childId } = {}) {
    enforceRole(user, ['parent'])
    const targetId = await ensureParentChildAccess(user, childId)
    const student = await Student.findById(targetId).select('classId').lean()
    const assignments = await Assignment.find({ classId: student?.classId }).populate('subjectId', 'name').lean()
    const submissions = await Submission.find({ studentId: targetId }).lean()
    const map = new Map(submissions.map((submission) => [String(submission.assignmentId), submission]))
    const statuses = assignments.map((assignment) => ({
      assignmentId: String(assignment._id),
      title: assignment.title,
      dueDate: assignment.dueDate,
      status: map.has(String(assignment._id)) ? map.get(String(assignment._id)).status : 'pending',
    }))
    return { childId: targetId, assignments: statuses }
  },

  async getChildAcademicSummary({ user, childId } = {}) {
    enforceRole(user, ['parent'])
    const targetId = await ensureParentChildAccess(user, childId)
    const [grades, attendance] = await Promise.all([
      Grade.find({ studentId: targetId }).populate('subjectId', 'name').lean(),
      Attendance.find({ studentId: targetId }).lean(),
    ])
    const overallAverage = grades.length ? Math.round(grades.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / grades.length) : 0
    return {
      childId: targetId,
      overallAverage,
      gradeCount: grades.length,
      attendance: buildAttendanceSummary(attendance),
      grades,
    }
  },
}

export async function executeAcademicTool(toolName, args, user) {
  if (!toolRegistry[toolName]) {
    throw new AppError(400, `Unsupported academic tool: ${toolName}`)
  }

  return toolRegistry[toolName]({ user, ...args })
}

export async function getToolRegistrySnapshot() {
  return Object.keys(toolRegistry)
}

export const academicToolRegistry = toolRegistry
