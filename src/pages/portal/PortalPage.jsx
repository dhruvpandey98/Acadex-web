import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowDownToLine, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, Clock3, FileText, GraduationCap, MessageCircle, MoreHorizontal, Plus, Search, Send, Sparkles, UserPlus, Users, X } from 'lucide-react'
import { Avatar, Button, Card, Modal, StatusBadge } from '../../components/common/UI.jsx'
import { useApp } from '../../hooks/useApp.js'
import { attendanceByDay, demoChats, performanceByMonth } from '../../data/mockData.js'

const colors = ['#5549e6', '#18a879', '#f3a650', '#e47b8c']
const fieldsFor = {
  students: [['name', 'Student name'], ['email', 'Email address'], ['grade', 'Grade'], ['className', 'Class'], ['attendance', 'Attendance %'], ['score', 'Academic score']],
  teachers: [['name', 'Teacher name'], ['email', 'Email address'], ['subject', 'Subject'], ['classes', 'Assigned classes']],
  assignments: [['title', 'Assignment title'], ['subject', 'Subject'], ['className', 'Class'], ['due', 'Due date']],
}
const assistantReplies = [
  'A little consistency goes a long way. Try breaking your revision into 25-minute focus sessions with short breaks in between.',
  'You’ve got this! Start with the topic that feels most challenging, then use a worked example to build momentum.',
  'Based on your recent progress, you’re building a strong foundation. A quick review of your class notes today can help it stick.',
]

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><p className="page-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>{action}</div>
}

function MetricCard({ label, value, change, icon: Icon, tone = 'purple', detail }) {
  return <Card className="metric-card"><div className="metric-top"><span>{label}</span><span className={`metric-icon metric-${tone}`}><Icon size={17} /></span></div><div className="metric-value">{value}</div><div className="metric-foot"><span className="metric-change"><ArrowUpRight size={13} /> {change}</span><span>{detail}</span></div></Card>
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return <div className="chart-tooltip"><strong>{label}</strong>{payload.map((entry) => <span key={entry.name}><i style={{ background: entry.color }} />{entry.name}: {entry.value}%</span>)}</div>
}

function Dashboard({ role, students, assignments }) {
  const greetings = { Admin: 'Good morning, Alex', Teacher: 'Good morning, Sophie', Student: 'Hey, Olivia', Parent: 'Good morning, Jamie' }
  const subtitle = { Admin: 'Here’s what’s happening across your school today.', Teacher: 'Here’s your classroom at a glance.', Student: 'A new day is a new chance to do something great.', Parent: 'Here’s the latest from Olivia’s school day.' }
  const metrics = role === 'Admin'
    ? [['Total students', '1,284', '+8.2%', Users, 'vs. last term'], ['Teaching staff', '86', '+4.1%', GraduationCap, 'vs. last term'], ['Classes today', '42', 'On track', BookOpen, 'across 8 grades'], ['Attendance today', '94.8%', '+1.4%', Check, 'vs. last week']]
    : role === 'Teacher'
      ? [['My students', '72', '+4 this term', Users, 'across 3 classes'], ['Attendance today', '94.4%', '+2.1%', Check, 'vs. last week'], ['To review', '8', '3 due today', FileText, 'submissions'], ['Class average', '86.2%', '+5.6%', GraduationCap, 'this semester']]
      : role === 'Student'
        ? [['Attendance', '96.4%', '+2.4%', Check, 'you’re on a roll'], ['Academic score', '89.2%', '+4.6%', GraduationCap, 'this semester'], ['To complete', '3', '1 due tomorrow', FileText, 'assignments'], ['Study streak', '8 days', 'Your best: 12', Sparkles, 'keep it going']]
        : [['Attendance', '96.4%', '+2.4%', Check, 'this semester'], ['Academic score', '89.2%', '+4.6%', GraduationCap, 'this semester'], ['Assignments', '3', '1 due tomorrow', FileText, 'to complete'], ['Teacher updates', '2 new', 'Since Monday', MessageCircle, 'messages']]
  return <>
    <PageHeading eyebrow="FRIDAY, OCTOBER 30" title={greetings[role]} description={subtitle[role]} action={<Button variant="outline" onClick={() => window.print()}><ArrowDownToLine size={15} /> Export overview</Button>} />
    <div className="metric-grid">{metrics.map(([label, value, change, Icon, detail], i) => <MetricCard key={label} label={label} value={value} change={change} icon={Icon} tone={['purple', 'green', 'amber', 'blue'][i]} detail={detail} />)}</div>
    <div className="dashboard-main-grid"><Card className="chart-card"><div className="card-heading"><div><h2>{role === 'Student' || role === 'Parent' ? 'Your learning journey' : 'School at a glance'}</h2><p>{role === 'Student' || role === 'Parent' ? 'Subject progress, this semester' : 'Attendance trends through the week'}</p></div><span className="select-button">This week <ChevronDown size={14} /></span></div><div className="chart-legend"><span><i className="legend-purple" /> {role === 'Student' || role === 'Parent' ? 'Mathematics' : 'Present'}</span><span><i className="legend-mint" /> {role === 'Student' || role === 'Parent' ? 'Science' : 'Absent'}</span>{(role === 'Student' || role === 'Parent') && <span><i className="legend-peach" /> English</span>}</div><div className="dashboard-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={role === 'Student' || role === 'Parent' ? performanceByMonth : attendanceByDay} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}><defs><linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a50e9" stopOpacity={0.17} /><stop offset="100%" stopColor="#5a50e9" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#eef0f5" strokeDasharray="4 5" vertical={false} /><XAxis dataKey={role === 'Student' || role === 'Parent' ? 'month' : 'day'} axisLine={false} tickLine={false} tick={{ fill: '#9098a8', fontSize: 11 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9098a8', fontSize: 11 }} domain={[60, 100]} /><Tooltip content={<ChartTooltip />} /><Area type="monotone" dataKey={role === 'Student' || role === 'Parent' ? 'math' : 'present'} name={role === 'Student' || role === 'Parent' ? 'Mathematics' : 'Present'} stroke="#5a50e9" strokeWidth={2.5} fill="url(#purpleArea)" /><Area type="monotone" dataKey={role === 'Student' || role === 'Parent' ? 'science' : 'absent'} name={role === 'Student' || role === 'Parent' ? 'Science' : 'Absent'} stroke="#1cb58b" strokeWidth={2} fill="transparent" />{(role === 'Student' || role === 'Parent') && <Area type="monotone" dataKey="english" name="English" stroke="#f3a650" strokeWidth={2} fill="transparent" />}</AreaChart></ResponsiveContainer></div></Card>
      <Card className="side-widget"><div className="card-heading"><div><h2>{role === 'Admin' ? 'Attendance today' : 'Your subjects'}</h2><p>{role === 'Admin' ? 'Across the whole school' : 'A snapshot of your progress'}</p></div><MoreHorizontal size={18} /></div><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: 'Present', value: 948 }, { name: 'Absent', value: 38 }, { name: 'Late', value: 14 }]} innerRadius={51} outerRadius={67} paddingAngle={4} dataKey="value" stroke="none">{colors.slice(0, 3).map((color) => <Cell key={color} fill={color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{role === 'Student' || role === 'Parent' ? '89%' : '94.8%'}</strong><small>present</small></div></div><div className="donut-legend"><span><i className="legend-purple" /> Present <strong>948</strong></span><span><i className="legend-mint" /> Absent <strong>38</strong></span><span><i className="legend-peach" /> Late <strong>14</strong></span></div></Card></div>
    <div className="dashboard-lower-grid"><Card className="activity-card"><div className="card-heading"><div><h2>{role === 'Student' || role === 'Parent' ? 'Your assignments' : 'Recent activity'}</h2><p>{role === 'Student' || role === 'Parent' ? 'A few things on your plate' : 'The little things adding up today'}</p></div><a href="/portal/assignments" className="card-link">View all <ArrowRight size={14} /></a></div><div className="activity-list">{(role === 'Student' ? assignments.slice(0, 3) : [{ title: 'Olivia Chen submitted an assignment', subject: 'Quadratic Equations · 10-A', due: '8 min ago', type: 'assignment' }, { title: 'Attendance recorded for 10-A', subject: '27 of 28 students present', due: '32 min ago', type: 'check' }, { title: 'New note from Sophie Anderson', subject: 'Mathematics · Grade 10', due: '1 hour ago', type: 'message' }]).map((item, index) => <div className="activity-row" key={item.id || item.title}><span className={`activity-icon activity-icon-${index}`}><FileText size={15} /></span><span className="activity-copy"><strong>{item.title}</strong><small>{item.subject}{item.className ? ` · ${item.className}` : ''}</small></span><span className="activity-time">{item.due || item.status}</span></div>)}</div></Card><Card className="events-card"><div className="card-heading"><div><h2>Coming up</h2><p>Make room in your week</p></div><span className="icon-button" aria-hidden="true"><MoreHorizontal size={18} /></span></div><div className="event-item"><div className="event-date"><strong>02</strong><small>NOV</small></div><div><strong>Grade 10 parent evening</strong><small>Monday · 5:30 PM · Main hall</small></div></div><div className="event-item"><div className="event-date event-date-peach"><strong>05</strong><small>NOV</small></div><div><strong>Science fair showcase</strong><small>Thursday · 10:00 AM · Courtyard</small></div></div><a href="/portal/announcements" className="card-link event-link">View school calendar <ArrowRight size={14} /></a></Card></div>
    <div className="dashboard-footer-note"><Sparkles size={14} /> Small things are happening every day. You're right where you need to be.</div>
    <span className="sr-only">{students.length} students and {assignments.length} assignments in your workspace</span>
  </>
}

function RecordTable({ kind, records, onEdit, onDelete, onView, query, onQuery, classFilter, onClassFilterChange, statusFilter, onStatusFilterChange, classOptions, statusOptions, canEdit }) {
  const headers = kind === 'students'
    ? ['STUDENT', 'GRADE / CLASS', 'ATTENDANCE', 'ACADEMIC SCORE', 'STATUS', '']
    : kind === 'teachers'
      ? ['TEACHER', 'SUBJECT', 'ASSIGNED CLASSES', 'STATUS', '']
      : ['ASSIGNMENT', 'SUBJECT / CLASS', 'DUE DATE', 'SUBMISSIONS', 'STATUS', '']

  return (
    <Card className="table-card">
      <div className="table-toolbar">
        <label className="table-search"><Search size={16} /><input placeholder={`Search ${kind}...`} value={query} onChange={(event) => onQuery(event.target.value)} /></label>
        <div className="table-filters">
          {classOptions.length > 0 && <label className="select-button"><select className="filter-select" aria-label="Filter by class or subject" value={classFilter} onChange={(event) => onClassFilterChange(event.target.value)}><option value="All">All {kind === 'teachers' ? 'subjects' : 'classes'}</option>{classOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown size={14} /></label>}
          <label className="select-button"><select className="filter-select" aria-label="Filter by status" value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}><option value="All">All statuses</option>{statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown size={14} /></label>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <thead><tr>{headers.map((header, index) => <th key={`${header}-${index}`}>{header}</th>)}</tr></thead>
          <tbody>
            {records.length === 0 ? <tr><td className="empty-row" colSpan={headers.length}>No records found. Try adjusting your search.</td></tr> : records.map((item) => (
              <tr key={item.id}>
                <td><button className="person-cell" onClick={() => onView(item)}><Avatar name={item.name || item.title} color={item.color || 'violet'} size="sm" /><span><strong>{item.name || item.title}</strong><small>{item.email || `${item.className} - ${item.total} students`}</small></span></button></td>
                {kind === 'students' && <><td><strong className="table-primary">{item.grade}</strong><small className="table-secondary">{item.className}</small></td><td><span className="table-number">{item.attendance}%</span></td><td><span className="table-number">{item.score}%</span></td><td><StatusBadge tone={item.status === 'Active' ? 'green' : 'amber'}>{item.status}</StatusBadge></td></>}
                {kind === 'teachers' && <><td><span className="table-primary">{item.subject}</span></td><td><span className="table-primary">{item.classes}</span></td><td><StatusBadge tone={item.status === 'Active' ? 'green' : 'amber'}>{item.status}</StatusBadge></td></>}
                {kind === 'assignments' && <><td><span className="table-primary">{item.subject}</span><small className="table-secondary">{item.className}</small></td><td><span className="table-primary">{new Date(`${item.due}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></td><td><span className="table-number">{item.submitted} / {item.total}</span></td><td><StatusBadge tone={item.status === 'Reviewing' ? 'blue' : item.status === 'Not started' ? 'amber' : 'green'}>{item.status}</StatusBadge></td></>}
                <td><div className="row-actions"><button className="icon-button" aria-label="View details" onClick={() => onView(item)}><BookOpen size={15} /></button><button className="icon-button" aria-label={canEdit ? 'Edit' : 'View profile'} onClick={() => onEdit(item)}><MoreHorizontal size={16} /></button>{canEdit && <button className="icon-button delete-icon" aria-label="Delete" onClick={() => onDelete(item)}><X size={15} /></button>}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-bottom"><span>Showing <strong>{records.length}</strong> of <strong>{records.length}</strong> results</span><div><button disabled>Previous</button><button className="pagination-current">1</button><button>Next</button></div></div>
    </Card>
  )
}
function AttendancePage({ role, students, attendance, setAttendance }) {
  const [date, setDate] = useState('2026-10-30')
  const isFamily = role === 'Student' || role === 'Parent'
  const visibleStudents = isFamily ? students.filter((student) => student.name === 'Olivia Chen') : students
  const todays = attendance[date] || {}
  const present = Object.values(todays).filter((value) => value === 'Present').length

  function setStatus(id, status) {
    setAttendance({ ...attendance, [date]: { ...todays, [id]: status } })
  }

  return <>
    <PageHeading eyebrow="SHOWING UP MATTERS" title={isFamily ? 'Attendance history' : 'Attendance'} description="A clear picture of every school day, one check-in at a time." action={<label className="date-picker"><Clock3 size={15} /><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>} />
    <div className="metric-grid compact-metrics">
      <MetricCard label={isFamily ? 'Attendance this term' : 'Present today'} value={isFamily ? `${visibleStudents[0]?.attendance || 96}%` : `${present || 1} students`} change="+2.1%" icon={Check} detail={isFamily ? 'Olivia is on a roll' : 'vs. last week'} />
      {!isFamily && <><MetricCard label="Absent today" value={`${Math.max(0, students.length - (present || 1))} students`} change="On track" icon={Users} tone="amber" detail="school-wide" /><MetricCard label="Late arrivals" value="2 students" change="−3 this week" icon={Clock3} tone="blue" detail="this morning" /></>}
    </div>
    <Card className="table-card">
      <div className="card-heading padded-heading"><div><h2>{isFamily ? 'Olivia’s attendance' : 'Today’s roll call'}</h2><p>{isFamily ? 'A thoughtful view of attendance over the school year.' : 'Click a status to cycle between present, absent, and late.'}</p></div>{!isFamily && <span className="select-button">All classes <ChevronDown size={14} /></span>}</div>
      <div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>CLASS</th><th>LAST 30 DAYS</th><th>TODAY’S STATUS</th></tr></thead><tbody>{visibleStudents.map((student, index) => {
        const status = todays[student.id] || ['Present', 'Present', 'Late', 'Present', 'Absent', 'Present', 'Present'][index % 7]
        return <tr key={student.id}><td><span className="person-cell"><Avatar name={student.name} color={student.color} size="sm" /><span><strong>{student.name}</strong><small>{student.email}</small></span></span></td><td>{student.className}</td><td><span className="table-number">{student.attendance}%</span></td><td><button disabled={isFamily} className={`attendance-status attendance-${status.toLowerCase()}`} onClick={() => setStatus(student.id, status === 'Present' ? 'Absent' : status === 'Absent' ? 'Late' : 'Present')}><i />{status}{!isFamily && <ChevronDown size={13} />}</button></td></tr>
      })}</tbody></table></div>
    </Card>
  </>
}
function MessagesPage({ messages, setMessages }) {
  const [selected, setSelected] = useState(1)
  const [text, setText] = useState('')
  const current = demoChats.find((chat) => chat.id === selected) || demoChats[0]
  const thread = messages[selected] || [{ from: 'them', text: current.message, time: current.time }, { from: 'them', text: current.role === 'Mathematics teacher' ? 'She asked a thoughtful question about factoring and then helped the whole table group.' : 'I’ve added a few notes to the class space so everyone can take a look.', time: '10:27 AM' }]
  function send(event) {
    event.preventDefault()
    if (!text.trim()) return
    setMessages({ ...messages, [selected]: [...thread, { from: 'me', text: text.trim(), time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }] })
    setText('')
  }
  return <><PageHeading eyebrow="KEEP THE GOOD CONVERSATIONS GOING" title="Messages" description="A thoughtful place for school conversations." action={<Button onClick={() => setSelected(demoChats[(selected % demoChats.length)].id)}><Plus size={16} /> New message</Button>} /><Card className="messages-card"><aside className="conversation-list"><label className="table-search"><Search size={15} /><input placeholder="Find a conversation" /></label>{demoChats.map((chat) => <button className={`conversation-item ${selected === chat.id ? 'conversation-selected' : ''}`} key={chat.id} onClick={() => setSelected(chat.id)}><Avatar name={chat.name} color={chat.color} /><span><strong>{chat.name}</strong><small>{chat.message}</small></span><em>{chat.time}</em></button>)}</aside><section className="chat-panel"><header className="chat-header"><Avatar name={current.name} color={current.color} /><span><strong>{current.name}</strong><small>{current.role} · Northstar Academy</small></span><span className="icon-button" aria-hidden="true"><MoreHorizontal size={18} /></span></header><div className="chat-messages"><div className="chat-day">TODAY</div>{thread.map((message, index) => <div className={`chat-message ${message.from === 'me' ? 'chat-message-mine' : ''}`} key={`${message.time}-${index}`}><p>{message.text}</p><small>{message.time}</small></div>)}</div><form className="chat-compose" onSubmit={send}><input aria-label="Message" value={text} onChange={(event) => setText(event.target.value)} placeholder={`Message ${current.name.split(' ')[0]}...`} /><button className="send-button" type="submit" aria-label="Send message"><Send size={16} /></button></form></section></Card><p className="portal-footnote"><ShieldCheckIcon /> Messages are shared only with the people in this conversation.</p></>
}

function ShieldCheckIcon() {
  return <Check size={14} />
}

function AssistantPage() {
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState([])
  function ask(value) {
    if (!value.trim()) return
    setAnswers([...answers, { question: value, answer: assistantReplies[answers.length % assistantReplies.length] }])
    setQuestion('')
  }
  return <><PageHeading eyebrow="A STUDY BUDDY, WHENEVER YOU NEED ONE" title="Your study space" description="A little help with your next big idea. Always patient, always here." /><Card className="assistant-card"><div className="assistant-intro"><span className="assistant-symbol"><Sparkles size={24} /></span><span className="assistant-label">ACADEX STUDY BUDDY</span><h2>Hey Olivia, what are we<br />working on today?</h2><p>Ask me about a class topic, a tricky assignment, or how to make a plan that sticks.</p><div className="suggestion-list">{['Help me plan my study week', 'Explain quadratic equations', 'How can I stay focused?'].map((suggestion) => <button onClick={() => ask(suggestion)} key={suggestion}>{suggestion} <ArrowRight size={13} /></button>)}</div></div><div className="assistant-conversation">{answers.length === 0 ? <div className="assistant-empty"><div className="assistant-orbit"><Sparkles size={23} /></div><strong>A good question is a great place to start.</strong><span>Try one of the prompts or ask something of your own.</span></div> : answers.map((item, index) => <div key={`${item.question}-${index}`} className="assistant-pair"><p className="assistant-question">{item.question}</p><p className="assistant-answer"><Sparkles size={14} /> {item.answer}</p></div>)}</div><form className="assistant-input" onSubmit={(event) => { event.preventDefault(); ask(question) }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask your study buddy anything..." /><Button type="submit" aria-label="Ask question"><Send size={16} /></Button></form><p className="assistant-disclaimer">Your study buddy shares suggestions, not answers. Your learning is always your own.</p></Card></>
}

function GenericSection({ section, role, announcements, setAnnouncements }) {
  const configs = {
    analytics: ['A clearer picture, at a glance.', 'Spot the patterns, celebrate the progress, and see where a little more support could make a big difference.'],
    reports: ['Progress worth sharing.', 'Thoughtful reporting that helps the whole community understand how learning is growing.'],
    classes: ['Your school, by the class.', 'Every group, schedule, and shared learning moment in one place.'],
    subjects: ['Learning, in every subject.', 'Bring subject goals and student progress into one clear view.'],
    announcements: ['The school note-board.', 'The right updates, reaching the right people at the right time.'],
    timetable: ['A day with a little more rhythm.', 'Find your next class, upcoming exams, and the moments in between.'],
    fees: ['Fee status, made clear.', 'A simple, private overview of the school fees and payment schedule.'],
    settings: ['Make Acadex feel like yours.', 'Your account, school preferences, and notification settings.'],
  }
  const [announcement, setAnnouncement] = useState('')
  const [notice, setNotice] = useState(false)
  const [checked, setChecked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [calendarDay, setCalendarDay] = useState(0)
  const [billingOpen, setBillingOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState('Term 1 report card')
  const content = configs[section] || configs.analytics
  if (section === 'announcements') return <>
    <PageHeading eyebrow="A LITTLE NOTE FROM YOUR SCHOOL" title={content[0]} description={content[1]} />
    {(role === 'Admin' || role === 'Teacher') && <Card className="announcement-compose"><Avatar name={role === 'Admin' ? 'Alex Morgan' : 'Sophie Anderson'} /><form onSubmit={(event) => { event.preventDefault(); if (announcement.trim()) { setAnnouncements([{ id: Date.now(), name: role === 'Admin' ? 'Alex Morgan' : 'Sophie Anderson', text: announcement.trim(), time: 'Just now', color: 'violet' }, ...announcements]); setAnnouncement('') } }}><textarea value={announcement} onChange={(event) => setAnnouncement(event.target.value)} placeholder="Share a good thing with your school community..." /><div><span className="select-button">Everyone <ChevronDown size={14} /></span><Button type="submit" disabled={!announcement.trim()}><Send size={14} /> Share update</Button></div></form></Card>}
    <div className="announcement-list">{announcements.map((item) => <Card className="announcement-item" key={item.id}><div className="announcement-author"><Avatar name={item.name} color={item.color} /><span><strong>{item.name}</strong><small>{item.time}</small></span><MoreHorizontal size={18} /></div><p>{item.text}</p><button className="announcement-reaction" onClick={() => setNotice(!notice)}><HeartIcon /> {notice ? 'You and 13 others' : 'Show some love'}</button></Card>)}</div>
  </>
  if (section === 'timetable') return <><PageHeading eyebrow="YOUR WEEK, AT A GLANCE" title={content[0]} description={content[1]} action={<button className="select-button" onClick={() => setCalendarDay((calendarDay + 1) % 5)}>Week of Oct {26 + calendarDay} <ChevronDown size={14} /></button>} /><Card className="timetable-card"><div className="timetable-grid"><div className="timetable-corner">LOCAL TIME</div>{['MON 26', 'TUE 27', 'WED 28', 'THU 29', 'FRI 30'].map((day, i) => <div className={`timetable-day ${calendarDay === i ? 'timetable-today' : ''}`} key={day}>{day}</div>)}{['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'].map((time, i) => <div className="timetable-line" key={time}><span>{time}</span>{['Mathematics', 'English', 'Science', 'Break', 'History', 'Study hall', 'Arts'].map((subject, j) => <div className={`timetable-cell ${((i + j) % 5) === 0 ? `timetable-event timetable-event-${j % 4}` : ''}`} key={`${time}-${subject}`}>{(i + j) % 5 === 0 && <><strong>{subject}</strong><small>{['Room 204', 'Room 108', 'Lab 3', 'Library'][j % 4]}</small></>}</div>)}</div>)}</div></Card></>
  if (section === 'fees') return <><PageHeading eyebrow="A CLEAR LOOK AT THE DETAILS" title={content[0]} description={content[1]} /><Card className="fee-card"><div className="fee-illustration"><div><span>✦</span><strong>All caught up.</strong><small>One less thing to think about.</small></div></div><div className="fee-info"><span className="section-kicker">OLIVIA CHEN · GRADE 10</span><h2>Everything is<br />up to date.</h2><p>There’s nothing due right now. We’ll let you know when the next term’s statement is ready.</p><div className="fee-row"><span>Term 1 · 2026–27</span><StatusBadge>Paid in full</StatusBadge></div><div className="fee-row"><span>Term 2 · due Jan 15, 2027</span><StatusBadge tone="blue">Not yet due</StatusBadge></div><button className="card-link" onClick={() => setBillingOpen(!billingOpen)}>{billingOpen ? 'Hide payment history' : 'View payment history'} <ArrowRight size={14} /></button>{billingOpen && <p className="billing-history">Sep 01, 2026 · Term 1 tuition · Paid · $2,400</p>}</div></Card></>
  if (section === 'settings') return <><PageHeading eyebrow="YOUR SPACE, YOUR WAY" title={content[0]} description={content[1]} /><Card className="settings-card"><h2>Profile & preferences</h2><label>Display name<input defaultValue={role === 'Student' ? 'Olivia Chen' : role === 'Parent' ? 'Jamie Chen' : role === 'Teacher' ? 'Sophie Anderson' : 'Alex Morgan'} /></label><label>School email<input defaultValue="alex@northstar.edu" type="email" /></label><label className="settings-toggle"><span><strong>School updates</strong><small>Get important announcements from your school.</small></span><input type="checkbox" defaultChecked /></label><label className="settings-toggle"><span><strong>Weekly progress digest</strong><small>A thoughtful summary of the week, every Friday.</small></span><input type="checkbox" defaultChecked /></label><Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2400) }}><Check size={14} /> {saved ? 'Changes saved' : 'Save preferences'}</Button></Card></>
  if (section === 'reports') return <><PageHeading eyebrow="A STORY OF GROWTH" title={content[0]} description={content[1]} action={<Button onClick={() => { const csv = 'Student,Class,Attendance,Academic score\nOlivia Chen,10-A,96%,92%\nEthan Williams,9-B,91%,84%\nAmara Johnson,11-A,98%,96%'; const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'acadex-progress-report.csv'; link.click(); URL.revokeObjectURL(link.href) }}><ArrowDownToLine size={15} /> Download report</Button>} /><div className="report-grid">{['Term 1 report card', 'Attendance summary', 'Academic progress', 'Class performance'].map((title, i) => <Card className="report-card" key={title}><span className={`report-icon report-icon-${i}`}><FileText size={20} /></span><strong>{title}</strong><small>Updated Oct {28 - i * 2}, 2026 · PDF</small><button className="card-link" onClick={() => setSelectedReport(title)}>{selectedReport === title ? 'Selected' : 'Preview report'} <ArrowRight size={14} /></button></Card>)}</div><Card className="chart-card report-chart"><div className="card-heading"><div><h2>Academic progress</h2><p>Average scores across subjects</p></div></div><div className="dashboard-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={performanceByMonth}><CartesianGrid stroke="#eef0f5" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="math" name="Mathematics" fill="#5549e6" radius={[4, 4, 0, 0]} /><Bar dataKey="science" name="Science" fill="#18a879" radius={[4, 4, 0, 0]} /><Bar dataKey="english" name="English" fill="#f3a650" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Card></>
  if (section === 'classes' || section === 'subjects') return <><PageHeading eyebrow="MADE FOR LEARNING TOGETHER" title={content[0]} description={content[1]} action={<Button onClick={() => setChecked(!checked)}><Plus size={15} /> {checked ? 'Added to workspace' : `Add ${section === 'classes' ? 'class' : 'subject'}`}</Button>} /><div className="class-grid">{(section === 'classes' ? [{ title: 'Grade 10 · A', subject: 'Mathematics · English · Science', count: '28 students', color: 'lavender' }, { title: 'Grade 9 · B', subject: 'Science · History · Arts', count: '24 students', color: 'mint' }, { title: 'Grade 11 · A', subject: 'English · Mathematics · Physics', count: '22 students', color: 'peach' }, { title: 'Grade 8 · A', subject: 'History · English · Arts', count: '26 students', color: 'bluewash' }] : [{ title: 'Mathematics', subject: '6 classes · 4 teachers', count: '142 students', color: 'lavender' }, { title: 'Science', subject: '8 classes · 5 teachers', count: '168 students', color: 'mint' }, { title: 'English', subject: '7 classes · 4 teachers', count: '156 students', color: 'peach' }, { title: 'History', subject: '5 classes · 3 teachers', count: '118 students', color: 'bluewash' }]).map((item, index) => <Card className="class-card" key={item.title}><div className={`class-art ${item.color}`}><span>{index === 0 ? <BookOpen /> : index === 1 ? <Sparkles /> : <GraduationCap />}</span><small>{section === 'classes' ? `ROOM ${204 + index}` : `SUBJECT 0${index + 1}`}</small></div><h2>{item.title}</h2><p>{item.subject}</p><div className="class-card-footer"><span>{item.count}</span><button className="card-link" onClick={() => setSelectedReport(item.title)}>Explore class <ArrowRight size={13} /></button></div>{selectedReport === item.title && <p className="class-selected">{item.title} details are open in your workspace.</p>}</Card>)}</div></>
  return <><PageHeading eyebrow="A LITTLE MORE CLARITY, EVERY DAY" title={content[0]} description={content[1]} /><div className="report-grid"><Card className="report-card"><span className="report-icon report-icon-0"><Users size={20} /></span><strong>School engagement</strong><small>Most students are right on track this term.</small><span className="report-big-number">84<span>%</span></span></Card><Card className="report-card"><span className="report-icon report-icon-1"><Check size={20} /></span><strong>Attendance trend</strong><small>Up 2.4% from the previous month.</small><span className="report-big-number">94.8<span>%</span></span></Card><Card className="report-card"><span className="report-icon report-icon-2"><GraduationCap size={20} /></span><strong>Learning progress</strong><small>Academic scores are trending upward.</small><span className="report-big-number">+8.2<span>%</span></span></Card></div><Card className="chart-card report-chart"><div className="card-heading"><div><h2>Progress over time</h2><p>Average academic scores by subject</p></div><button className="select-button">This semester <ChevronDown size={14} /></button></div><div className="dashboard-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={performanceByMonth}><CartesianGrid stroke="#eef0f5" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="math" name="Mathematics" fill="#5549e6" radius={[4, 4, 0, 0]} /><Bar dataKey="science" name="Science" fill="#18a879" radius={[4, 4, 0, 0]} /><Bar dataKey="english" name="English" fill="#f3a650" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Card></>
}

function HeartIcon() {
  return <span aria-hidden="true">♡</span>
}

function AssignmentDetails({ assignment, role, submissions, onSubmit, onReview }) {
  const [draft, setDraft] = useState('')
  const isLearner = role === 'Student' || role === 'Parent'
  const visibleSubmissions = submissions.filter((submission) => submission.assignmentId === assignment.id && (!isLearner || submission.student === 'Olivia Chen'))
  const ownSubmission = visibleSubmissions.find((submission) => submission.student === 'Olivia Chen')

  return <div className="assignment-details">
    <div className="profile-details">
      <div><span>Subject</span><strong>{assignment.subject}</strong></div>
      <div><span>Class</span><strong>{assignment.className}</strong></div>
      <div><span>Due date</span><strong>{assignment.due}</strong></div>
      <div><span>Submissions</span><strong>{assignment.submitted} of {assignment.total}</strong></div>
    </div>
    {role === 'Student' && <form className="submission-form" onSubmit={(event) => { event.preventDefault(); onSubmit(assignment, draft); setDraft('') }}>
      <label htmlFor="assignment-submission">Your work</label>
      {ownSubmission && <p className="submission-state">Last submitted {ownSubmission.submittedAt}. You can update your response before the due date.</p>}
      <textarea id="assignment-submission" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Share your answer or add a note about your work..." required />
      <Button type="submit"><Send size={14} /> {ownSubmission ? 'Update submission' : 'Submit assignment'}</Button>
    </form>}
    {role !== 'Student' && <div className="submission-list">
      <h3>{role === 'Parent' ? 'Olivia’s submission' : 'Student submissions'}</h3>
      {visibleSubmissions.length === 0 ? <p className="submission-empty">No submissions yet.</p> : visibleSubmissions.map((submission) => <article className="submission-row" key={submission.id}>
        <div><strong>{submission.student}</strong><small>{submission.submittedAt}</small><p>{submission.note}</p></div>
        <div className="submission-review"><StatusBadge tone={submission.status === 'Reviewed' ? 'green' : 'amber'}>{submission.status}</StatusBadge>{submission.grade && <strong className="submission-grade">{submission.grade}%</strong>}{!isLearner && submission.status !== 'Reviewed' && <button className="card-link" onClick={() => onReview(submission.id)}>Mark reviewed</button>}</div>
      </article>)}
    </div>}
  </div>
}

export default function PortalPage() {
  const { section = 'overview' } = useParams()
  const [searchParams] = useSearchParams()
  const globalQuery = searchParams.get('search') || ''
  const { user, students, setStudents, teachers, setTeachers, assignments, setAssignments, submissions, setSubmissions, attendance, setAttendance, messages, setMessages, announcements, setAnnouncements } = useApp()
  const [query, setQuery] = useState(globalQuery)
  const [classFilter, setClassFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modal, setModal] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [record, setRecord] = useState({})
  const [reviewed, setReviewed] = useState({})
  const role = user.role
  const data = section === 'students' ? students : section === 'teachers' ? teachers : section === 'assignments' ? assignments : []
  const classOptions = [...new Set(data.map((item) => section === 'teachers' ? item.subject : item.className).filter(Boolean))]
  const statusOptions = [...new Set(data.map((item) => item.status).filter(Boolean))]
  const shown = data.filter((item) => {
    const matchesSearch = `${item.name || item.title} ${item.email || ''} ${item.subject || ''} ${item.className || ''}`.toLowerCase().includes(query.toLowerCase())
    const filterValue = section === 'teachers' ? item.subject : item.className
    return matchesSearch && (classFilter === 'All' || filterValue === classFilter) && (statusFilter === 'All' || item.status === statusFilter)
  })
  const canEdit = role === 'Admin' || role === 'Teacher'
  const singular = section === 'students' ? 'student' : section === 'teachers' ? 'teacher' : 'assignment'

  function openCreate() {
    setRecord(section === 'assignments' ? { due: '2026-11-07', submitted: 0, total: 28, status: 'Not started' } : section === 'teachers' ? { status: 'Active', color: 'indigo', classes: '' } : { status: 'Active', color: 'indigo', attendance: 100, score: 0 })
    setSelectedRecord(null)
    setModal('edit')
  }

  function saveRecord(event) {
    event.preventDefault()
    const setters = { students: setStudents, teachers: setTeachers, assignments: setAssignments }
    const next = { ...record, id: selectedRecord?.id || Date.now() }
    setters[section](selectedRecord ? data.map((item) => item.id === selectedRecord.id ? next : item) : [next, ...data])
    setModal(null)
  }

  function removeRecord(item) {
    if (!window.confirm(`Delete ${item.name || item.title}? This can’t be undone.`)) return
    const setters = { students: setStudents, teachers: setTeachers, assignments: setAssignments }
    setters[section](data.filter((entry) => entry.id !== item.id))
  }

  function submitAssignment(assignment, note) {
    if (!note.trim()) return
    const existing = submissions.find((item) => item.assignmentId === assignment.id && item.student === user.name)
    if (existing) {
      setSubmissions(submissions.map((item) => item.id === existing.id ? { ...item, note: note.trim(), submittedAt: 'Just now', status: 'Needs review', grade: '' } : item))
      return
    }
    setSubmissions([...submissions, { id: Date.now(), assignmentId: assignment.id, student: user.name, submittedAt: 'Just now', note: note.trim(), status: 'Needs review', grade: '' }])
    setAssignments(assignments.map((item) => item.id === assignment.id ? { ...item, submitted: Math.min(item.total, item.submitted + 1) } : item))
  }

  function reviewSubmission(id) {
    setSubmissions(submissions.map((item) => item.id === id ? { ...item, status: 'Reviewed', grade: item.grade || '90' } : item))
  }

  function exportRows() {
    const fields = section === 'students' ? ['name', 'email', 'grade', 'className', 'attendance', 'score'] : section === 'teachers' ? ['name', 'email', 'subject', 'classes', 'status'] : ['title', 'subject', 'className', 'due', 'submitted', 'total', 'status']
    const csv = [fields.join(','), ...shown.map((item) => fields.map((field) => `"${String(item[field] ?? '').replaceAll('"', '""')}"`).join(','))].join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    link.download = `acadex-${section}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const headingInfo = {
    students: ['THE PEOPLE AT THE HEART OF IT', 'Students', 'A little more about the learners who make your school what it is.'],
    teachers: ['THE PEOPLE WHO MAKE IT HAPPEN', 'Teaching staff', 'The brilliant people behind every great school day.'],
    assignments: ['WORK THAT MOVES LEARNING FORWARD', role === 'Student' || role === 'Parent' ? 'Assignments' : 'Assignments', 'A clear view of what’s next, what’s done, and what needs a little attention.'],
    grades: ['PROGRESS, NOT JUST NUMBERS', role === 'Student' || role === 'Parent' ? 'Your grades' : 'Grades & performance', 'Every result is a moment in a much bigger learning story.'],
  }

  if (section === 'overview') return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><Dashboard role={role} students={students} assignments={assignments} /></motion.div>
  if (section === 'attendance') return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><AttendancePage role={role} students={students} attendance={attendance} setAttendance={setAttendance} /></motion.div>
  if (section === 'messages') return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><MessagesPage messages={messages} setMessages={setMessages} /></motion.div>
  if (section === 'assistant') return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><AssistantPage /></motion.div>
  if (['students', 'teachers', 'assignments'].includes(section)) return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><PageHeading eyebrow={headingInfo[section][0]} title={headingInfo[section][1]} description={headingInfo[section][2]} action={<div className="heading-actions"><Button variant="outline" onClick={exportRows}><ArrowDownToLine size={15} /> Export</Button>{canEdit && <Button onClick={openCreate}><UserPlus size={15} /> Add {singular}</Button>}</div>} /><div className="table-summary-row"><span><strong>{data.length}</strong> {section} in your school</span><span className="table-summary-note"><i /> Updated just now</span></div><RecordTable kind={section} records={shown} query={query} onQuery={setQuery} classFilter={classFilter} onClassFilterChange={setClassFilter} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} classOptions={classOptions} statusOptions={statusOptions} canEdit={canEdit} onView={(item) => { setSelectedRecord(item); setModal('view') }} onEdit={(item) => { if (!canEdit) { setSelectedRecord(item); setModal('view'); return } setSelectedRecord(item); setRecord({ ...item }); setModal('edit') }} onDelete={removeRecord} /><Modal open={modal === 'edit'} onClose={() => setModal(null)} title={`${selectedRecord ? 'Edit' : 'Add'} ${singular}`} description={`Keep your ${singular} details up to date.`}><form className="record-form" onSubmit={saveRecord}>{(fieldsFor[section] || []).map(([field, label]) => <label key={field}>{label}{field === 'due' ? <input type="date" value={record[field] || ''} onChange={(event) => setRecord({ ...record, [field]: event.target.value })} required /> : <input type={field === 'email' ? 'email' : 'text'} value={record[field] ?? ''} onChange={(event) => setRecord({ ...record, [field]: event.target.value })} required />}</label>)}<div className="modal-actions"><Button variant="outline" type="button" onClick={() => setModal(null)}>Cancel</Button><Button type="submit">{selectedRecord ? 'Save changes' : `Add ${singular}`}</Button></div></form></Modal><Modal open={modal === 'view'} onClose={() => setModal(null)} title={selectedRecord?.name || selectedRecord?.title || 'Details'} description={selectedRecord?.email || 'A little more context for your school community.'}>{section === 'assignments' && selectedRecord ? <AssignmentDetails assignment={selectedRecord} role={role} submissions={submissions} onSubmit={submitAssignment} onReview={reviewSubmission} /> : <div className="profile-details">{selectedRecord && Object.entries(selectedRecord).filter(([key]) => key !== 'id' && key !== 'color').map(([key, value]) => <div key={key}><span>{key.replace(/([A-Z])/g, ' $1')}</span><strong>{String(value)}</strong></div>)}</div>}<div className="modal-actions"><Button variant="outline" onClick={() => setModal(null)}>Close</Button></div></Modal></motion.div>
  if (section === 'grades') return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><PageHeading eyebrow={headingInfo.grades[0]} title={headingInfo.grades[1]} description={headingInfo.grades[2]} action={<Button onClick={() => setReviewed({ ...reviewed, report: !reviewed.report })}><FileText size={15} /> {reviewed.report ? 'Report ready' : 'Preview report card'}</Button>} /><div className="metric-grid compact-metrics"><MetricCard label="Overall average" value="89.2%" change="+4.6%" icon={GraduationCap} detail="this semester" /><MetricCard label="Class standing" value="Top 12%" change="↑ 3 places" icon={ArrowUpRight} tone="green" detail="in your year" /><MetricCard label="Subjects on track" value="6 of 7" change="Looking good" icon={Check} tone="blue" detail="this term" /></div><Card className="chart-card report-chart"><div className="card-heading"><div><h2>Subject performance</h2><p>Scores across the last six months</p></div><button className="select-button">This semester <ChevronDown size={14} /></button></div><div className="dashboard-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={performanceByMonth}><CartesianGrid stroke="#eef0f5" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="math" name="Mathematics" fill="#5549e6" radius={[4, 4, 0, 0]} /><Bar dataKey="science" name="Science" fill="#18a879" radius={[4, 4, 0, 0]} /><Bar dataKey="english" name="English" fill="#f3a650" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Card><Card className="grade-table-card"><div className="card-heading"><div><h2>Latest results</h2><p>Recent assignment and exam grades</p></div></div>{[['Mathematics', 'Quadratic equations quiz', 'Oct 27', '92%', 'A−'], ['Science', 'Water cycle field report', 'Oct 25', '88%', 'B+'], ['English', 'Persuasive writing draft', 'Oct 22', '94%', 'A'], ['History', 'Chapter 6 response', 'Oct 19', '83%', 'B']].map(([subject, title, date, score, grade]) => <div className="grade-row" key={title}><span className="grade-subject-icon"><BookOpen size={16} /></span><span className="grade-description"><strong>{subject}</strong><small>{title} · {date}</small></span><span className="grade-score">{score}</span><span className="grade-letter">{grade}</span><span className="icon-button" aria-hidden="true"><ArrowRight size={15} /></span></div>)}</Card></motion.div>
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><GenericSection section={section} role={role} announcements={announcements} setAnnouncements={setAnnouncements} /></motion.div>
}
