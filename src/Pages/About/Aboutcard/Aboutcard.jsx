import './Aboutcard.css'

function Aboutcard() {
  const aboutContent = [
    {
      id: 1,
      title: "The problem",
      description: "Information about a child's progress travels too slowly and through too many disconnected channels.",
    },
    {
      id: 2,
      title: "Our mission",
      description: "Give every school one connected, transparent system that keeps parents and teachers on the same page — literally.",
    },
    {
      id: 3,
      title: "Our vision",
      description: "A world where every parent is an informed partner in their child's education, not an outsider to it.",
    },
  ];

  return (
    <div className="about-cards-container">
      {aboutContent.map((item) => (
        <div className="about-card" key={item.id}>
          <h3 className="about-card-title">{item.title}</h3>
          <p className="about-card-desc">{item.description}</p>
        </div>
      ))}
    </div>
  )
}

export default Aboutcard