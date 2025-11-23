import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Step 1: Send OTP
  const sendOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      if (res.data.success) {
        alert(res.data.message);
        setStep(2);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  // Step 2: Verify OTP
  const verifyOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password/verify-otp", { email, otp });
      if (res.data.success) {
        alert(res.data.message);
        setStep(3);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  // Step 3: Reset password
  const resetPassword = async () => {
    if (password !== confirmPassword) return alert("Passwords do not match!");

    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/forgot-password/reset",
        { email, password }
      );

      if (res.data.success) {
        alert(res.data.message);
        setStep(1);
        setEmail("");
        setOtp("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <>
      <Navbar />

      {/* PAGE WRAPPER */}
      <div className="min-h-screen bg-[#e0f7fa] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden">

          {/* LEFT PANEL (Hidden on Mobile) */}
          {!isMobile && (
            <div className="w-1/2 bg-gradient-to-br from-teal-400 to-teal-700 text-white p-10 relative overflow-hidden flex flex-col justify-center">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 transition-all duration-500"
                style={{ backgroundImage: `url('/images/medpulse-reset.jpg')` }}
              ></div>

              <h2 className="text-3xl font-bold relative z-10">Forgot Password?</h2>
              <p className="mt-4 text-lg opacity-90 relative z-10">
                We’ll help you recover your account securely.  
                Enter your registered email to receive an OTP.
              </p>
            </div>
          )}

          {/* RIGHT PANEL - FORM */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6">Reset your password</h2>

            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <div>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full p-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                  onClick={sendOTP}
                >
                  Send OTP
                </button>
              </div>
            )}

            {/* STEP 2: Enter OTP */}
            {step === 2 && (
              <div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full p-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                  onClick={verifyOTP}
                >
                  Verify OTP
                </button>
              </div>
            )}

            {/* STEP 3: Reset Password */}
            {step === 3 && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full p-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 mb-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 mb-3"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                  onClick={resetPassword}
                >
                  Reset Password
                </button>
              </>
            )}

            {/* BOTTOM LINKS */}
            <div className="flex gap-6 mt-4 text-blue-700 font-semibold">
              <Link to="/login" className="hover:underline">
                Back to Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ForgetPassword;
