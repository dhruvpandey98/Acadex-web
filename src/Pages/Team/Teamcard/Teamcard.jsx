import './Teamcard.css'
import Aastha from '../../../assets/Images/Aastha.jpg'
import Dhruvp from '../../../assets/Images/Dhruvp.jpg'
import dhruv from '../../../assets/Images/dhruv jain.png'

function Teamcard() {
  const teamMembers = [
    { id: 1, img: Dhruvp , name: "Dhruv Pandey", role: "Founder & CEO", color: null },
    { id: 2, img: dhruv, name: "Dhruv Jain", role: "Timepass", color: null },
    { id: 3, img: "CK", name: "Charika Joshi", role: "Timepass", color: "#d97706" },
    { id: 4, img: Aastha, name: "Aastha", role: "Timepass", color: null },
  ];

  return (
    <>
      {teamMembers.map((item) => (
        <div className="team-card" key={item.id}>
          <div className="team-photo">
            {item.color ? (
              <div className="avatar-initials" style={{ backgroundColor: item.color }}>
                {item.img}
              </div>
            ) : (
              <img src={item.img} alt={item.name} />
            )}
          </div>
          <h3 className="team-name">{item.name}</h3>
          {/*
          <p className="team-role">{item.role}</p>
          */}
        </div>
      ))}
    </>
  )
}

export default Teamcard