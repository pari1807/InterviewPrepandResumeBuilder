
import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { useSearchParams } from "react-router-dom";

export default function Login() {
  const [searchParams] = useSearchParams();

  const isLogin = searchParams.get("state") !== "SignUp";

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">

      {/* Background Blur */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md">

        <div className="bg-white/80 backdrop-blur-xl border border-green-100 rounded-3xl shadow-xl p-8">

          {/* Logo */}
          <div className="text-center mb-10">

  <img
    src={logo}
    alt="logo"
    className="h-16 mx-auto"
  />

  <div className="mt-4">
    <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
      AI Powered Resume Builder
    </span>
  </div>

  <h1 className="text-3xl font-bold text-slate-900 mt-6">
    {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
  </h1>

  <p className="text-slate-500 mt-3">
    Build ATS-friendly resumes in minutes.
  </p>

</div>

          {/* Toggle */}
          <div className="bg-green-50 p-1 rounded-xl flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                isLogin
                  ? "bg-white shadow text-green-600"
                  : "text-slate-500"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                !isLogin
                  ? "bg-white shadow text-green-600"
                  : "text-slate-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full h-12 border border-green-200 rounded-xl flex items-center justify-center gap-3 hover:bg-green-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="font-medium">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-400">OR</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <form className="space-y-4">

            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full h-12 px-4 rounded-xl border border-green-100 outline-none focus:border-green-500"
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              className="w-full h-12 px-4 rounded-xl border border-green-100 outline-none focus:border-green-500"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full h-12 px-4 rounded-xl border border-green-100 outline-none focus:border-green-500"
            />

            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full h-12 px-4 rounded-xl border border-green-100 outline-none focus:border-green-500"
              />
            )}

            {isLogin && (
              <div className="flex justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-500">
                  <input type="checkbox" />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-green-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Bottom */}
          <div className="text-center mt-6 text-sm text-slate-500">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-green-600 font-medium hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-green-600 font-medium hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex justify-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="px-3 py-1 bg-green-50 rounded-full">
              ATS Friendly
            </span>
            <span className="px-3 py-1 bg-green-50 rounded-full">
              AI Powered
            </span>
            <span className="px-3 py-1 bg-green-50 rounded-full">
              Free Templates
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
