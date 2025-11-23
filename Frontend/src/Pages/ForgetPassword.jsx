import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

// Helper component for styled input fields
const CustomInput = ({ type, placeholder, value, onChange, icon: Icon, required = false, isEmailStep = false }) => (
  // Note: The conditional rendering for the icon is within the input wrapper
  <div className="mb-4 relative">
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      // Adjusted padding for the input. If isEmailStep is true (and icon is removed), padding will be standard px-4.
      className={`w-full rounded-full border border-cyan-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${isEmailStep ? 'px-4 py-3' : 'pl-10 py-3 pr-4'}`}
    />
    {/* Removed Icon rendering for the email step, but kept it for other potential inputs if needed */}
    {Icon && !isEmailStep && (
      <Icon className="absolute top-1/2 left-3 transform -translate-y-1/2 text-cyan-600" />
    )}
  </div>
);

// Helper component for the primary custom button
const PrimaryButton = ({ onClick, children, className = "" }) => (
  <button
    type="button"
    className={`w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold rounded-full py-3 px-8 shadow-lg shadow-blue-900/10 transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/20 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // useEffect for animation logic (unchanged)
  useEffect(() => {
    const card = document.querySelector(".service-card-animate");
    if (card) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove("opacity-0", "translate-y-10");
              entry.target.classList.add("opacity-100", "translate-y-0");
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(card);
      return () => observer.unobserve(card);
    }
  }, []);

  // API Handlers (unchanged)
  const sendOTP = async () => {
    if (!email) return alert("Please enter your email address.");
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

  const verifyOTP = async () => {
    if (!otp) return alert("Please enter the OTP.");
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

  const resetPassword = async () => {
    if (password !== confirmPassword) return alert("Passwords do not match!");
    if (!password) return alert("Please enter a new password.");

    try {
      const res = await axios.put("http://localhost:5000/api/auth/forgot-password/reset", { email, password });
      if (res.data.success) {
        alert(res.data.message);
        setStep(1);
        setEmail(""); setOtp(""); setPassword(""); setConfirmPassword("");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <>
      <Navbar />

      {/* Page Wrap */}
      <div className="min-h-screen bg-cyan-50 flex items-center justify-center p-4 md:p-8">
        {/* Split Card */}
        <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row">

          {/* Left Panel (Service Card) - Hidden on Mobile (unchanged) */}
          <div
            className="service-card-animate flex-1 p-8 min-h-[420px] bg-gradient-to-br from-cyan-600 to-teal-600 text-white flex-col justify-center relative opacity-0 translate-y-10 transition duration-700 ease-out hidden md:flex"
            aria-hidden
          >
            <div
              className="absolute left-0 top-0 w-full h-full bg-cover bg-center opacity-10 transition duration-500 group-hover:left-0 group-hover:opacity-20 z-0"
              style={{ backgroundImage: `url('/images/medpulse-reset.jpg')` }}
            />
            <div className="relative z-10">
              <div className="text-3xl font-bold mb-3">Forgot Password?</div>
              <div className="text-lg leading-relaxed opacity-95">
                We'll help you get back into your account securely.
                Enter your registered email and follow the steps.
              </div>
            </div>
          </div>

          {/* Right Panel (Form Panel) */}
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-6 text-teal-900">
              Reset your password
            </h2>

            {/* Step 1: Enter Email and Send OTP */}
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); sendOTP(); }}>
                <CustomInput
                  type="email"
                  placeholder="Enter your Email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  isEmailStep={true} // <-- Flag to indicate the email step
                />
                <PrimaryButton className="mt-2" onClick={sendOTP}>
                  Send OTP
                </PrimaryButton>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); verifyOTP(); }}>
                <CustomInput
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  // Icon prop intentionally omitted here and in step 3
                />
                <PrimaryButton className="mt-2" onClick={verifyOTP}>
                  Verify OTP
                </PrimaryButton>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <form onSubmit={(e) => { e.preventDefault(); resetPassword(); }}>
                <CustomInput
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <CustomInput
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <PrimaryButton onClick={resetPassword}>
                  Reset Password
                </PrimaryButton>
              </form>
            )}

            {/* Links Row (unchanged) */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold">
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
              <span className="text-gray-400">|</span>
              <Link to="/signup" className="text-blue-600 hover:underline">
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