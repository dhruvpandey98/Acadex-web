import './Testcard.css'

const colors = ["#4f46e5", "#0891b2", "#d97706", "#16a34a"]

function Star() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  )
}

function Testcard() {
  const testimonials = [
    {
      id: 1,
      image: "AN",
      rating: 5,
      review: "Earlier, I would only learn about missed assignments during parent-teacher meetings. Now I receive updates the very same day.",
      name: "Ananya Sharma",
      role: "Parent, Grade 4",
    },
    {
      id: 2,
      image: "AR",
      rating: 5,
      review: "Taking attendance used to consume valuable class time every morning. With Acadex, it's done in under a minute.",
      name: "Aarav Mehta",
      role: "6th Grade Teacher",
    },
    {
      id: 3,
      image: "RN",
      rating: 5,
      review: "The AI assistant answers my late-night questions about homework and submissions instantly. It has made staying involved so much easier.",
      name: "Rohan Verma",
      role: "Parent, Grade 7",
    },
    {
      id: 4,
      image: "SN",
      rating: 5,
      review: "Preparing report cards used to take an entire weekend. Acadex has reduced that work to just a few hours, giving me more time to focus on my students.",
      name: "Sneha Iyer",
      role: "High School Teacher",
    },
  ];

  return (
    <>
      {testimonials.map((item, index) => (
        <div className="testi-card" key={item.id}>
          <div className="testi-rating">
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star key={i} />
            ))}
          </div>
          <p className="testi-review">"{item.review}"</p>
          <div className="testi-row">
            <div
              className="testi-avatar"
              style={{ backgroundColor: colors[index % colors.length] }}
            >
              {item.image}
            </div>
            <div>
              <h4 className="testi-name">{item.name}</h4>
              <p className="testi-role">{item.role}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default Testcard