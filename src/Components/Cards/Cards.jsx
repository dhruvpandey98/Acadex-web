import './Cards.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faUserGraduate,
  faClipboardCheck,
  faFileLines,
  faRobot,
  faComments,
  faBell,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

const Cards = () => {
  const features = [
  {
    id: 1,
    title: "Student Progress Tracking",
    description: "Watch performance trends unfold across subjects and terms.",
    icon: faArrowTrendUp,
  },
  {
    id: 2,
    title: "Attendance Monitoring",
    description: "Daily check-ins logged in seconds.",
    icon: faClipboardCheck,
  },
  {
    id: 3,
    title: "Grades & Report Cards",
    description: "Automatically compiled report cards.",
    icon: faFileLines,
  },
  {
    id: 4,
    title: "Assignment Management",
    description: "Assign, submit, and track homework.",
    icon: faUserGraduate,
  },
  {
    id: 5,
    title: "AI Chatbot",
    description: "Instant answers to student queries.",
    icon: faRobot,
  },
  {
    id: 6,
    title: "Real-Time Messaging",
    description: "Direct communication between teachers and parents.",
    icon: faComments,
  },
  {
    id: 7,
    title: "Smart Notifications",
    description: "Never miss an important update.",
    icon: faBell,
  },
  {
    id: 8,
    title: "Analytics & Insights",
    description: "Powerful dashboards and reports.",
    icon: faChartLine,
  },
];

  return (
    <div className="cards-grid">
      {features.map((feature) => (
        <div className="feature-card" key={feature.id}>
            <div className="feature-icon">
                <FontAwesomeIcon icon={feature.icon} />
            </div>
          <h3 className="feature-title">{feature.title}</h3>
          <p className="feature-description">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}

export default Cards