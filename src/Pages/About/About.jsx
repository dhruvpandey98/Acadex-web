import './About.css'
import Aboutcard from './Aboutcard/Aboutcard'

function About() {
  return (
    <div className="About">
      <div className="about-inner">
        <div className="about-left">
          <div className="about-subhead">
            <p>About</p>
          </div>
          <div className="about-title">
            <h1>Built to close the gap between school and home.</h1>
          </div>
          <div className="about-content">
            <p>Most parents find out their child is struggling at a parent-teacher conference — weeks after it started. Teachers, meanwhile, spend hours each week on spreadsheets and paper notices instead of teaching.
            Acadex exists to fix the timing problem, not just the paperwork problem: putting the same, real-time information in front of the people raising and teaching a child.</p>
          </div>
        </div>
        <div className="about-right">
          <Aboutcard />
        </div>
      </div>
    </div>
  )
}

export default About