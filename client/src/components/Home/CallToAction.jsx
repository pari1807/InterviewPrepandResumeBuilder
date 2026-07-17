import React from 'react'
import { Link } from 'react-router-dom'

const CallToAction = () => {
  return (
    <section id="cta" className="bg-white py-20 px-4">
  <div className="max-w-6xl mx-auto">

    <div className="
      relative overflow-hidden
      rounded-[32px]
      bg-gradient-to-br
      from-[#F0FDF4]
      via-[#ECFDF5]
      to-white
      border border-green-100
      px-8 md:px-16
      py-16 md:py-24
      shadow-sm
    ">

      {/* Decorative Blurs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-green-200/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-100/40 blur-3xl rounded-full"></div>

      <div className="relative z-10 text-center">

        <span className="
          inline-flex
          px-4 py-2
          rounded-full
          bg-green-100
          text-green-700
          text-sm
          font-medium
          mb-6
        ">
          🚀 Build Job-Winning Resumes
        </span>

        <h2 className="
          text-4xl
          md:text-6xl
          font-bold
          tracking-tight
          text-slate-900
          max-w-4xl
          mx-auto
          leading-tight
        ">
          Create a professional resume in
          <span className="text-green-600"> minutes</span>,
          not hours.
        </h2>

        <p className="
          mt-6
          text-lg
          text-slate-600
          max-w-2xl
          mx-auto
        ">
          Use AI-powered suggestions, modern templates,
          and one-click PDF export to land more interviews.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

          <Link to="/app" className="
            bg-green-600
            hover:bg-green-700
            text-white
            px-8
            py-4
            rounded-xl
            font-medium
            transition-all
            duration-300
            hover:scale-105
            shadow-lg
            shadow-green-200
            inline-block
          ">
            Build My Resume →
          </Link>

          <Link to="/app" className="
            bg-white
            border
            border-green-200
            text-slate-700
            px-8
            py-4
            rounded-xl
            font-medium
            hover:bg-green-50
            transition-all
            inline-block
          ">
            View Templates
          </Link>

        </div>

        <div className="
          mt-8
          text-sm
          text-slate-500
        ">
          ✓ ATS Friendly &nbsp;&nbsp;
          ✓ AI Powered &nbsp;&nbsp;
          ✓ Free PDF Export
        </div>

      </div>
    </div>
  </div>
</section>
  )
}

export default CallToAction