import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="Contact">
      <div className="contact-left">
        <div className="contact-subhead">
          <p>Contact</p>
        </div>
        <div className="contact-heading">
          <h1>Let's talk about your school.</h1>
        </div>
        <div className="contact-content">
          <p>Have questions about rolling out Acadex for your school or district? Reach out and our team will follow up within one business day.</p>
        </div>
        <div className="contact-info">
          <div className="info-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="info-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16v16H4z" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
            <span>hello@acadex.com</span>
          </div>
        </div>
      </div>

      <div className="contact-right">
        <div className="contact-card">
          {submitted ? (
            <div className="success-state">
              <div className="success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3>Message sent!</h3>
              <p>We'll get back to you soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullname">Full name</label>
                  <input id="fullname" type="text" placeholder="John Darren" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input id="email" type="email" placeholder="john@gmail.com" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input id="subject" type="text" placeholder="How can we help?" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="Tell us more..." rows="4" required />
              </div>
              <button type="submit" className="contact-submit">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Contact