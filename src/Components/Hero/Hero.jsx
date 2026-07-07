import './Hero.css'
import Image1 from '../../assets/Images/Image1.jpg'
import { useNavigate } from "react-router-dom";


function Hero() {
  const navigate = useNavigate();
  return (
    <div className='Hero'>
        <div className="left">
            <div className="subhead">
                <p>Welcome to Acadex</p>
            </div>
            <div className="title">
                <h1>The bridge between the <span className='change'>classroom </span>and home.</h1>
            </div>
            <div className="content">
                <p>Acadex bridges the gap between the classroom and home by bringing grades, attendance, assignments, and real-time communication into one secure platform. Stay informed, collaborate effortlessly, and help every student reach their full potential.</p>
            </div>
            <div className="btns">
                <button><a href='#contact'>Get Started</a></button>
                <button onClick={() => navigate("/portal")}>
                   Go to Portal
                </button>
            </div>
      </div>
      <div className="right">
        <img src={Image1} alt='image'></img>
      </div>
    </div>
  )
}

export default Hero
