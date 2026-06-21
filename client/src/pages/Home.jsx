import React from 'react'
import Banner from '../components/Home/Banner'
import Hero from '../components/Home/Hero'
import Features from '../components/Home/Features'

const Home = () => {
  return (
    <div className="bg-slate-50 text-slate-950">
        <Banner />
        <Hero />
        <Features />
    </div>
  )
}

export default Home