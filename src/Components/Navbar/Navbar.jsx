import { useState } from 'react'
import './Navbar.css'
import Logo from '../../assets/Images/Acadex-logo.svg'
import { useNavigate } from "react-router-dom";


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <img src={Logo} alt="Acadex Logo" />
        </div>

        <div className={`links ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#features" onClick={() => setMenuOpen(false)}>Features</a></li>
            <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
            <li><a href="#team" onClick={() => setMenuOpen(false)}>Team</a></li>
            <li><a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a></li>
            <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
          </ul>
          <div className="mobile-portal-btn">
            <button
              onClick={() => {
                navigate("/portal");
                setMenuOpen(false);
              }}
              >
              Go to Portal
            </button>
          </div>
        </div>

        <div className="portal-btn">
          <button onClick={() => navigate("/portal")}>
            Go to Portal
          </button>
        </div>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar