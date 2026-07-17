import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const state = searchParams.get("state") || "Login";
  const isLogin = state === "Login";
  const isSignUp = state === "SignUp";
  const isForgotPassword = state === "ForgotPassword";

  const changeState = (newState) => {
    setSearchParams({ state: newState });
    setError("");
    setIsOtpSent(false);
    setOtp("");
    setPassword("");
    setConfirmPassword("");
  };

  // State fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Log In
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();
          throw new Error(text || `Server returned error status ${response.status}. Make sure the backend server is running!`);
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to log in");
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/app");
      } else if (isSignUp) {
        // Sign Up Flow
        if (!isOtpSent) {
          if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
          }
          // Send OTP request
          const response = await fetch("/api/users/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          
          let data;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          } else {
            const text = await response.text();
            throw new Error(text || `Server returned error status ${response.status}. Make sure the backend server is running!`);
          }

          if (!response.ok) {
            throw new Error(data.message || "Failed to send OTP");
          }
          setIsOtpSent(true);
        } else {
          // Register request with OTP
          const response = await fetch("/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, otp }),
          });
          
          let data;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          } else {
            const text = await response.text();
            throw new Error(text || `Server returned error status ${response.status}. Make sure the backend server is running!`);
          }

          if (!response.ok) {
            throw new Error(data.message || "Verification failed");
          }
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/app");
        }
      } else if (isForgotPassword) {
        // Forgot Password Flow
        if (!isOtpSent) {
          const response = await fetch("/api/users/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          
          let data;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          } else {
            const text = await response.text();
            throw new Error(text || `Server returned error status ${response.status}. Make sure the backend server is running!`);
          }

          if (!response.ok) {
            throw new Error(data.message || "Email request failed");
          }
          setIsOtpSent(true);
        } else {
          // Reset Password with OTP
          const response = await fetch("/api/users/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp, newPassword: password }),
          });
          
          let data;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          } else {
            const text = await response.text();
            throw new Error(text || `Server returned error status ${response.status}. Make sure the backend server is running!`);
          }

          if (!response.ok) {
            throw new Error(data.message || "Reset failed");
          }
          alert("Password reset successful! Please log in with your new password.");
          changeState("Login");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      {/* Background Blur */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl border border-green-100 rounded-3xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-10">
            <img src={logo} alt="logo" className="h-16 mx-auto" />
            <div className="mt-4">
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                AI Powered Resume Builder
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mt-6">
              {isLogin ? "Welcome Back 👋" : isForgotPassword ? "Reset Password 🔒" : isOtpSent ? "Verify Email ✉️" : "Create Account 🚀"}
            </h1>
            <p className="text-slate-500 mt-3">
              {isOtpSent ? "Enter the 6-digit OTP sent to your email." : "Build ATS-friendly resumes in minutes."}
            </p>
          </div>

          {/* Toggle (Only visible if OTP hasn't been sent yet and we are not in Forgot Password) */}
          {!isOtpSent && !isForgotPassword && (
            <div className="bg-green-50 p-1 rounded-xl flex mb-6">
              <button
                onClick={() => changeState("Login")}
                className={`flex-1 py-2 rounded-lg font-medium transition ${
                  isLogin ? "bg-white shadow text-green-600" : "text-slate-500"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => changeState("SignUp")}
                className={`flex-1 py-2 rounded-lg font-medium transition ${
                  isSignUp ? "bg-white shadow text-green-600" : "text-slate-500"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Google Button (Only visible if OTP hasn't been sent yet and we are not in Forgot Password) */}
          {!isOtpSent && !isForgotPassword && (
            <button
              type="button"
              className="w-full h-12 border border-green-200 rounded-xl flex items-center justify-center gap-3 hover:bg-green-50 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="font-medium">Continue with Google</span>
            </button>
          )}

          {/* Divider */}
          {!isOtpSent && !isForgotPassword && (
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-sm text-slate-400">OR</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isOtpSent ? (
              // OTP verification view
              <div>
                <input
                  type="text"
                  placeholder="6-Digit OTP Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full h-12 px-4 rounded-xl border border-green-100 outline-none focus:border-green-500 text-center font-bold tracking-widest text-lg"
                  required
                />
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Please check your inbox. If not visible, check your <strong>spam</strong> or <strong>promotions</strong> folder.
                </p>
                
                {isForgotPassword && (
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 mt-3 rounded-xl border border-green-100 outline-none focus:border-green-500"
                    required
                  />
                )}

                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="w-full mt-3 text-xs text-green-600 hover:underline text-center"
                >
                  Change Email / Back
                </button>
              </div>
            ) : (
              // Regular fields
              <>
                {isForgotPassword && (
                  <input
                    type="email"
                    placeholder="Registered Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-green-100 outline-none focus:border-green-500"
                    required
                  />
                )}

                {!isForgotPassword && isSignUp && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-green-100 outline-none focus:border-green-500"
                    required
                  />
                )}

                {!isForgotPassword && (
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-green-100 outline-none focus:border-green-500"
                    required
                  />
                )}

                {!isForgotPassword && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-green-100 outline-none focus:border-green-500"
                    required
                  />
                )}

                {!isForgotPassword && isSignUp && (
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-green-100 outline-none focus:border-green-500"
                    required
                  />
                )}
              </>
            )}

            {isLogin && !isOtpSent && (
              <div className="flex justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-500">
                  <input type="checkbox" />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => changeState("ForgotPassword")}
                  className="text-green-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition flex items-center justify-center disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : isForgotPassword
                ? isOtpSent
                  ? "Reset Password"
                  : "Send Reset OTP"
                : isOtpSent
                ? "Verify & Sign Up"
                : "Send OTP Verification"}
            </button>
            
            {isForgotPassword && !isOtpSent && (
              <button
                type="button"
                onClick={() => changeState("Login")}
                className="w-full text-sm text-slate-500 hover:text-slate-700 text-center font-medium mt-2 block"
              >
                Back to Login
              </button>
            )}
          </form>

          {/* Bottom toggle links */}
          {!isOtpSent && !isForgotPassword && (
            <div className="text-center mt-6 text-sm text-slate-500">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => changeState("SignUp")}
                    className="text-green-600 font-medium hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => changeState("Login")}
                    className="text-green-600 font-medium hover:underline"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          )}

          {/* Trust Badges */}
          <div className="mt-8 flex justify-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="px-3 py-1 bg-green-50 rounded-full">ATS Friendly</span>
            <span className="px-3 py-1 bg-green-50 rounded-full">AI Powered</span>
            <span className="px-3 py-1 bg-green-50 rounded-full">Free Templates</span>
          </div>
        </div>
      </div>
    </div>
  );
}
