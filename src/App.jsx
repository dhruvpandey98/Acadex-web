import "./App.css";
import { Routes, Route } from "react-router-dom";

import About from "./Pages/About/About";
import Features from "./Pages/Features/Features";
import Home from "./Pages/Home/Home";
import Team from "./Pages/Team/Team";
import Work from "./Pages/Work/Work";
import Testimonials from "./Pages/Testimonials/Testimonials";
import FAQ from "./Pages/FAQ/FAQ";
import Contact from "./Pages/Contact/Contact";
import Footer from "./Pages/Footer/Footer";
import Acadexcomingsoon from './Pages/Soon/AcadexComingSoon (1)'

function LandingPage() {
  return (
    <>
      <section id="home">
        <Home />
      </section>

      <section id="features">
        <Features />
      </section>

      <section id="work">
        <Work />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="team">
        <Team />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/portal" element={<Acadexcomingsoon />} />
    </Routes>
  );
}

export default App;