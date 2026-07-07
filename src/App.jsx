import './App.css'
import About from './Pages/About/About'
import Features from './Pages/Features/Features'
import Home from './Pages/Home/Home'
import Team from './Pages/Team/Team'
import Work from './Pages/Work/Work'
import Testimonials from './Pages/Testimonials/Testimonials'
import FAQ from './Pages/FAQ/FAQ'
import Contact from './Pages/Contact/Contact'
import Footer from './Pages/Footer/Footer'
function App() {
  return (
    <div>
      <Home />
      <Features />
      <Work />
      <About />
      <Team />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
