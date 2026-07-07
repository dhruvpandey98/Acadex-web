import { useState } from 'react';
import './FAQ.css'

function FAQ() {
  const accordionData = [
    {
      id: 1,
      question: "Is my child's data secure?",
      answer: "Yes. Acadex uses industry-standard encryption, secure authentication, and role-based access controls to protect student information. Only authorized users can access sensitive data.",
    },
    {
      id: 2,
      question: "How does messaging work between parents and teachers?",
      answer: "Parents and teachers can communicate directly through the platform using secure in-app messaging. Conversations are organized by student, making it easy to stay updated on academic progress and school activities.",
    },
    {
      id: 3,
      question: "What can the AI assistant actually do?",
      answer: "The AI assistant can answer questions about attendance, grades, assignments, schedules, school announcements, and other student-related information instantly, helping parents and teachers save time.",
    },
    {
      id: 4,
      question: "Who can see my child's records?",
      answer: "Only authorized users, such as parents or guardians linked to the student, assigned teachers, and designated school administrators, can access a child's records based on their permissions.",
    },
    {
      id: 5,
      question: "How do I get portal access or reset it?",
      answer: "You can request portal access from your school's administrator. If you've forgotten your password, simply use the 'Forgot Password' option on the login page to securely reset your account.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="FAQ">
      <div className="faq-inner">
        <div className="faq-subhead">
          <p>FAQ's</p>
        </div>
        <div className="faq-heading">
          <h1>Common questions.</h1>
        </div>
        <div className="faq-content">
          <p>Straight answers about security, messaging, the AI assistant, and account access.</p>
        </div>
        <div className="faq-accordion">
          {accordionData.map((item) => (
            <div className="faq-item" key={item.id}>
              <button
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === item.id ? null : item.id)}
              >
                <span>{item.question}</span>
                <svg
                  className={`faq-chevron ${openIndex === item.id ? 'open' : ''}`}
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {openIndex === item.id && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQ