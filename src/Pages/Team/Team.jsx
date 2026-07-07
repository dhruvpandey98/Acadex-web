import './Team.css'
import Teamcard from './Teamcard/Teamcard'

function Team() {
  return (
    <div className="Team">
      <div className="team-subhead">
        <p>Meet the Team</p>
      </div>
      <div className="team-head">
        <h1>The people building the bridge.</h1>
      </div>
      <div className="team-content">
        <p>A small team of educators, engineers, and parents who've lived the problem Acadex solves.</p>
      </div>
      <div className="team-cards">
        <Teamcard />
      </div>
    </div>
  )
}

export default Team