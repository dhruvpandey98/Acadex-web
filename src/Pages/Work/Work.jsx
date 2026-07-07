import './Work.css'
import Workcard from './Workcard/Workcard'

function Work() {
  return (
    <div className="Work">
      <div className="work-inner">
        <div className="work-subhead">
          <span className="dot" />
          <p>How it Works</p>
        </div>
        <div className="work-title">
          <h1>Three steps, one connected record.</h1>
        </div>
        <div className="work-content">
          <p>Acadex was built around one real sequence: a teacher records something, the system syncs it, and a parent sees it.</p>
        </div>
        <div className="work-right">
          <Workcard />
        </div>
      </div>
    </div>
  )
}

export default Work