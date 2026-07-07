import './Testimonials.css'
import Testcard from '../../Components/Testcard/Testcard'

function Testimonials() {
  return (
    <div className="Testimonials">
      <div className="testimonials-inner">
        <div className="testi-subhead">
          <p>Testimonials</p>
        </div>
        <div className="testi-head">
          <h1>What parents and teachers say.</h1>
        </div>
        <div className="testi-content">
          <p>Real feedback from the people using Acadex every school day.</p>
        </div>
        <div className="testi-cards">
          <Testcard />
        </div>
      </div>
    </div>
  )
}

export default Testimonials