import React from 'react'
import Banner from '../components/Home/Banner'
import Hero from '../components/Home/Hero'
import Features from '../components/Home/Features'
import Testimonials from '../components/Home/Testimonials'
import CallToAction from '../components/Home/CallToAction'
import Footer from '../components/Home/Footer'

const Home = () => {
  return (
    <div className="bg-slate-50 text-slate-950">
        <Banner />
        <Hero />
        <Features />
        <Testimonials />
        <CallToAction />
        <Footer />
    </div>
  )
}

export default Home