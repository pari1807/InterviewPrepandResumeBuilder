
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden bg-gradient-to-b from-[#F8FFF9] to-white border-t border-green-100">

      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-green-100/60 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20">

        {/* Top CTA */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-8 md:p-10 mb-20 flex flex-col md:flex-row items-center justify-between gap-8">

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to build your dream resume?
            </h2>

            <p className="text-green-50 mt-3 max-w-xl">
              Create ATS-friendly resumes, optimize for recruiters,
              and land more interviews with AI assistance.
            </p>
          </div>

          <button className="bg-white text-green-700 px-7 py-3 rounded-xl font-semibold hover:scale-105 transition">
            Start Building →
          </button>

        </div>

        {/* Main Footer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Brand */}
          <div className="lg:col-span-5">

            <img
              src={logo}
              alt="logo"
              className="h-10 mb-6"
            />

            <h3 className="text-4xl font-bold text-slate-900 leading-tight">
              Build resumes that get
              <span className="text-green-600"> interviews.</span>
            </h3>

            <p className="text-slate-600 mt-5 max-w-md leading-7">
              AI-powered resume builder designed for students,
              professionals and job seekers looking to stand out.
            </p>

            {/* Socials */}
            <div className="flex gap-4 mt-8">

              <a
                href="#"
                className="w-11 h-11 rounded-xl border border-green-200 flex items-center justify-center hover:bg-green-50 transition"
              >
                X
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-xl border border-green-200 flex items-center justify-center hover:bg-green-50 transition"
              >
                in
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-xl border border-green-200 flex items-center justify-center hover:bg-green-50 transition"
              >
                GH
              </a>

            </div>

          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">

            <div>
              <h4 className="font-semibold text-slate-900 mb-5">
                Product
              </h4>

              <ul className="space-y-3 text-slate-600">
                <li><Link to="/templates">Templates</Link></li>
                <li><Link to="/builder">Resume Builder</Link></li>
                <li><Link to="/ats-checker">ATS Checker</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-5">
                Resources
              </h4>

              <ul className="space-y-3 text-slate-600">
                <li><a href="#">Career Blog</a></li>
                <li><a href="#">Resume Tips</a></li>
                <li><a href="#">Interview Guide</a></li>
                <li><a href="#">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-5">
                Newsletter
              </h4>

              <p className="text-sm text-slate-600 mb-4">
                Get weekly career insights.
              </p>

              <div className="flex flex-col gap-3">

                <input
                  type="email"
                  placeholder="Enter email"
                  className="h-12 px-4 rounded-xl border border-green-200 outline-none focus:border-green-500"
                />

                <button className="h-12 rounded-xl bg-green-600 text-white hover:bg-green-700 transition">
                  Subscribe
                </button>

              </div>
            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-green-100 flex flex-col md:flex-row items-center justify-between gap-5">

          <p className="text-sm text-slate-500">
            © {currentYear} ResumeAI. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>

          <div className="px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
            ● AI Engine Active
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;

