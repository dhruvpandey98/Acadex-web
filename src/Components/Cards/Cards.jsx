import './Cards.css'

const Cards = () => {
  const features = [
    { id: 1, title: "Student Progress Tracking", description: "Watch performance trends unfold across subjects and terms, not just at report card time.", icon: "" },
    { id: 2, title: "Attendance Monitoring", description: "Daily check-ins logged in seconds, with instant alerts for absences and late arrivals.", icon: "" },
    { id: 3, title: "Grades & Report Cards", description: "Automatically compiled report cards that update as soon as a teacher enters a grade.", icon: "" },
    { id: 4, title: "Assignment Management", description: "Assign, submit, and track homework with due dates that sync to every calendar.", icon: "" },
    { id: 5, title: "AI Chatbot", description: "Ask about a grade, a due date, or attendance history and get an instant, accurate answer.", icon: "" },
    { id: 6, title: "Real-Time Messaging", description: "Direct, threaded conversations between parents and teachers—no phone tag, no lost notes.", icon: "" },
    { id: 7, title: "Smart Notifications", description: "Grade posted, class cancelled, or assignment due tomorrow—delivered the moment it matters.", icon: "" },
    { id: 8, title: "Analytics & Insights", description: "School-wide dashboards that turn raw records into trends administrators can act on.", icon: "" },
  ];

  return (
    <div className="cards-grid">
      {features.map((feature) => (
        <div className="feature-card" key={feature.id}>
          <div className="feature-icon">
            <span>{feature.icon}</span>
          </div>
          <h3 className="feature-title">{feature.title}</h3>
          <p className="feature-description">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}

export default Cards