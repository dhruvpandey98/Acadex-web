import './Footer.css'
import Logo from '../../assets/Images/Acadex-logo.svg'

function Footer() {
  const year = new Date().getFullYear()

  const linkGroups = [
    {
      title: "Product",
      links: ["Features", "How it Works", "Pricing", "Portal Login"],
    },
    {
      title: "Company",
      links: ["About", "Team", "Careers", "Contact"],
    },
    {
      title: "Resources",
      links: ["FAQ", "Help Center", "Privacy Policy", "Terms of Service"],
    },
  ]

  return (
    <footer className="Footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={Logo} alt="Acadex Logo" />
              <span>Acadex</span>
            </div>
            <p className="footer-tagline">
              The bridge between the classroom and home — grades, attendance, and communication, all in one place.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.93v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter/X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.9 1.9h3.7l-8.1 9.2 9.5 12.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.9L0 1.9h7.6l5.3 7z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            {linkGroups.map((group) => (
              <div className="footer-col" key={group.title}>
                <h4>{group.title}</h4>
                <ul>
                  {group.links.map((link) => (
                    <li key={link}><a href="#">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Acadex. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer