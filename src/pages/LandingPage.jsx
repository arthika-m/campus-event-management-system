import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Categories from '../components/landing/Categories'
import FeaturedEvents from '../components/landing/FeaturedEvents'
import Statistics from '../components/landing/Statistics'
import FAQ from '../components/landing/FAQ'
import Contact from '../components/landing/Contact'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      disable: false,
      startEvent: 'DOMContentLoaded'
    })
    AOS.refresh()
  }, [])

  return (
    <div style={{ overflowX: 'hidden', overflowY: 'auto' }}>
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedEvents />
      <Statistics />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  )
}