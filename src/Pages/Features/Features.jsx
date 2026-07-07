import './Features.css'
import Cards from '../../Components/Cards/Cards'
function Features() {
  return (
    <div className='Features'>
      <div className="subhead">
        <p>Features</p>
      </div>
      <div className="heading">
        <h1>Everything a school day produces, in one dashboard.</h1>
      </div>
      <div className="title">
        <p>Acadex replaces scattered spreadsheets, group chats, and paper notices with a single connected system built for parents and teachers.</p>
      </div>
      <div className="cards">
        <Cards/>
      </div>
    </div>
  )
}

export default Features