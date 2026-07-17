import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Modal States
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [emailOtp, setEmailOtp] = useState("");
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
    
    const [newPassword, setNewPassword] = useState("");
    const [passwordOtp, setPasswordOtp] = useState("");
    const [isPasswordOtpSent, setIsPasswordOtpSent] = useState(false);

    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error(e);
            }
        }
    }, [showProfileModal]); // Refresh user representation when settings open/close

    const logoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate('/')
    }

    const openModal = () => {
        if (user) {
            setProfileName(user.name);
            setNewEmail("");
            setEmailOtp("");
            setIsEmailOtpSent(false);
            setNewPassword("");
            setPasswordOtp("");
            setIsPasswordOtpSent(false);
            setModalError("");
            setModalSuccess("");
            setShowProfileModal(true);
        }
    };

    const handleUpdateName = async (e) => {
        e.preventDefault();
        setModalError("");
        setModalSuccess("");
        setModalLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/users/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ name: profileName })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to update name");
            }
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            setModalSuccess("Name updated successfully!");
        } catch (err) {
            setModalError(err.message);
        } finally {
            setModalLoading(false);
        }
    };

    const handleRequestEmailChange = async (e) => {
        e.preventDefault();
        setModalError("");
        setModalSuccess("");
        setModalLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/users/request-email-change", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ newEmail })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to request email change");
            }
            setIsEmailOtpSent(true);
            setModalSuccess("OTP sent to new email! Please verify below.");
        } catch (err) {
            setModalError(err.message);
        } finally {
            setModalLoading(false);
        }
    };

    const handleConfirmEmailChange = async (e) => {
        e.preventDefault();
        setModalError("");
        setModalSuccess("");
        setModalLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/users/confirm-email-change", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ newEmail, otp: emailOtp })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to verify email change");
            }
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            setIsEmailOtpSent(false);
            setNewEmail("");
            setEmailOtp("");
            setModalSuccess("Email address changed successfully!");
        } catch (err) {
            setModalError(err.message);
        } finally {
            setModalLoading(false);
        }
    };

    const handleRequestPasswordChange = async (e) => {
        e.preventDefault();
        setModalError("");
        setModalSuccess("");
        setModalLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/users/request-password-change", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to request password change");
            }
            setIsPasswordOtpSent(true);
            setModalSuccess("OTP sent to your registered email address!");
        } catch (err) {
            setModalError(err.message);
        } finally {
            setModalLoading(false);
        }
    };

    const handleConfirmPasswordChange = async (e) => {
        e.preventDefault();
        setModalError("");
        setModalSuccess("");
        setModalLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/users/confirm-password-change", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ otp: passwordOtp, newPassword })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to verify password change");
            }
            setIsPasswordOtpSent(false);
            setNewPassword("");
            setPasswordOtp("");
            setModalSuccess("Password changed successfully!");
        } catch (err) {
            setModalError(err.message);
        } finally {
            setModalLoading(false);
        }
    };

  return (
    <>
      <div className='sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-100'>
          <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3 text-slate-800 transition-all'>
              <Link to='/' className='hover:opacity-90 transition-opacity'>
                  <img src={logo} alt="logo" className="h-10 w-auto"/>
              </Link>

              <div className='flex items-center gap-6 text-sm font-medium'>
                  {user ? (
                      <>
                          <p onClick={openModal} className='max-sm:hidden text-slate-600 hover:text-green-600 transition cursor-pointer'>
                            Hi, <span className="text-slate-900 font-semibold underline underline-offset-4 decoration-green-500">{user.name}</span>
                          </p>
                          <button 
                            onClick={logoutUser} 
                            className='bg-slate-900 text-white hover:bg-slate-800 px-6 py-2 rounded-full active:scale-95 transition-all shadow-sm cursor-pointer'
                          >
                            Logout
                          </button>
                      </>
                  ) : (
                      <>
                          <Link to="/login?state=Login" className="text-slate-600 hover:text-slate-900 cursor-pointer">Sign In</Link>
                          <Link to="/login?state=SignUp" className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-full active:scale-95 transition-all shadow-sm font-semibold cursor-pointer">Sign Up</Link>
                      </>
                  )}
              </div>
          </nav>
      </div>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div onClick={() => setShowProfileModal(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] border border-slate-100 relative">
            
            {/* Modal Header */}
            <div className="bg-green-600 p-6 text-white">
              <h2 className="text-2xl font-bold">Edit Profile Settings</h2>
              <p className="text-green-100 text-sm mt-1">Manage your account information and security details.</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* Alert Feedback */}
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                  {modalError}
                </div>
              )}
              {modalSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold">
                  {modalSuccess}
                </div>
              )}

              {/* 1. Name Change */}
              <form onSubmit={handleUpdateName} className="space-y-2 pb-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">1. Update Profile Name</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-green-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
                  >
                    Save Name
                  </button>
                </div>
              </form>

              {/* 2. Email Change (OTP Verified) */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">2. Change Email Address</h3>
                <p className="text-xs text-slate-400">Current: <span className="font-semibold text-slate-600">{user?.email}</span></p>
                
                {!isEmailOtpSent ? (
                  <form onSubmit={handleRequestEmailChange} className="flex gap-2">
                    <input
                      type="email"
                      placeholder="New Email Address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="flex-1 h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-green-500"
                      required
                    />
                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
                    >
                      Get OTP
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleConfirmEmailChange} className="space-y-2 bg-green-50/50 p-3 rounded-xl border border-green-100">
                    <p className="text-xs text-green-700 font-medium">Verify OTP sent to: <span className="underline font-bold">{newEmail}</span></p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="6-Digit OTP"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        maxLength={6}
                        className="flex-1 h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-green-500 text-center font-bold tracking-widest"
                        required
                      />
                      <button
                        type="submit"
                        disabled={modalLoading}
                        className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
                      >
                        Verify & Update
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center mt-1">If not visible, check your <strong>spam</strong> or <strong>promotions</strong> folder.</p>
                    <button
                      type="button"
                      onClick={() => setIsEmailOtpSent(false)}
                      className="text-xs text-slate-500 hover:underline block"
                    >
                      Change Email Address
                    </button>
                  </form>
                )}
              </div>

              {/* 3. Password Change (OTP Verified) */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800">3. Reset/Change Password</h3>
                
                {!isPasswordOtpSent ? (
                  <form onSubmit={handleRequestPasswordChange} className="space-y-2">
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-green-500"
                      required
                    />
                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="w-full h-10 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
                    >
                      Send OTP to {user?.email}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleConfirmPasswordChange} className="space-y-2 bg-green-50/50 p-3 rounded-xl border border-green-100">
                    <p className="text-xs text-green-700 font-medium">Verify OTP sent to: <span className="underline font-bold">{user?.email}</span></p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="6-Digit OTP"
                        value={passwordOtp}
                        onChange={(e) => setPasswordOtp(e.target.value)}
                        maxLength={6}
                        className="flex-1 h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-green-500 text-center font-bold tracking-widest"
                        required
                      />
                      <button
                        type="submit"
                        disabled={modalLoading}
                        className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
                      >
                        Verify & Reset
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center mt-1">If not visible, check your <strong>spam</strong> folder.</p>
                    <button
                      type="button"
                      onClick={() => setIsPasswordOtpSent(false)}
                      className="text-xs text-slate-500 hover:underline block"
                    >
                      Change New Password
                    </button>
                  </form>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 flex justify-end border-t border-slate-100 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-5 h-10 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                Close Settings
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

export default Navbar