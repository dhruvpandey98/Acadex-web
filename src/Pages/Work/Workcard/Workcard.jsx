import './Workcard.css'

function Workcard() {
  const workflow = [
    {
      id: 1,
      title: "Teachers log it",
      description: "Grades, attendance, and assignments are recorded right as class happens — no end-of-week catch-up.",
      role: "Teacher",
      color: "#1a1a2e",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Acadex syncs it",
      description: "Every entry updates instantly across dashboards, reports, and the AI assistant's knowledge — no manual exports.",
      role: "Platform",
      color: "#4f46e5",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 4v6h-6M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Parents see it",
      description: "Real-time visibility into grades and attendance, plus direct messaging and instant AI answers — from any device.",
      role: "Parent",
      color: "#d97706",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="workflow-row">
      {workflow.map((step, index) => (
        <div className="workflow-step" key={step.id}>
          <div className="badge-row">
            <div className="step-badge" style={{ backgroundColor: step.color }}>
              {step.id}
            </div>
            {index !== workflow.length - 1 && <div className="connector" />}
          </div>
          <h3 className="step-title">{step.title}</h3>
          <p className="step-desc">{step.description}</p>
          <div className="step-role" style={{ color: step.color }}>
            {step.icon}
            <span>{step.role}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Workcard