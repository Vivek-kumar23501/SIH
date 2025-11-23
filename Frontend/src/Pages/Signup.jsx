import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

// Helper component for styled input fields (replaces FormGroup, Label, Input)
const CustomFormGroup = ({ label, name, type = "text", value, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor={name}>
      {label}
    </label>
    <input
      className="w-full rounded-full px-4 py-3 border border-cyan-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-base font-medium"
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
    />
  </div>
);

// Helper component for the primary custom button (replaces Button)
const PrimaryButton = ({ onClick, children, type = "button" }) => (
  <button
    type={type}
    className="w-full py-3 mt-2 text-white font-bold rounded-full transition duration-300 ease-in-out transform hover:scale-[1.03] text-lg bg-gradient-to-r from-blue-700 to-blue-500 hover:shadow-lg"
    onClick={onClick}
  >
    {children}
  </button>
);


const Signup = () => {
  // isMobile state is kept but its usage is superseded by Tailwind responsive classes
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });

  // useEffect handles window resize and the service-card animation
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    // Animation logic translated to Tailwind classes
    const cards = document.querySelectorAll(".service-card-animate");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
             // Apply Tailwind classes for animation
             entry.target.classList.remove("opacity-0", "translate-y-10");
             entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((c) => observer.observe(c));

    return () => {
      window.removeEventListener("resize", handleResize);
      cards.forEach((c) => observer.unobserve(c));
    };
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // --- API Handlers (Unchanged) ---
  const sendOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        name: form.name,
        email: form.email,
      });
      if (res.data.success) {
        alert("OTP Sent Successfully");
        setStep(2);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });
      if (res.data.success) {
        alert("OTP Verified");
        setStep(3);
      }
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  const register = async () => {
    if (form.password !== form.confirmPassword)
      return alert("Passwords do not match!");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      if (res.data.success) {
        alert("Signup Completed");
        setStep(1);
        setForm({ name: "", email: "", phone: "", otp: "", password: "", confirmPassword: "" });
      }
    } catch (err) {
      alert("Registration failed");
    }
  };
  // --- End API Handlers ---

  return (
    <>
    <Navbar />
      {/* Page Wrap */}
      <div className="min-h-screen bg-cyan-50 flex items-center justify-center p-8 md:p-12">
        {/* Split Card */}
        <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-xl shadow-gray-300/50 flex flex-col md:flex-row">

          {/* Left Panel (Service Card) */}
          <div
            className="service-card-animate flex-1 p-7 min-h-[430px] bg-gradient-to-br from-cyan-600 to-teal-600 text-white flex-col justify-center relative opacity-0 translate-y-10 transition duration-800 ease-out hidden md:flex group"
          >
            {/* Background Image Effect */}
            <div
              className="absolute left-[-110%] top-0 w-[120%] h-full opacity-10 bg-cover bg-center transition-all duration-600 ease-in-out group-hover:left-0 group-hover:opacity-25"
              style={{ backgroundImage: `url('/images/medpulse-signup.jpg')` }}
            />
            <div className="relative">
                <h2 className="text-3xl font-bold">Join <span className="text-yellow-300">MedPulse</span></h2>
                <p className="text-base mt-2 leading-relaxed opacity-95">
                  Create your account and receive **AI-driven healthcare alerts**,
                  preventive guidance, and multilingual support.
                </p>
            </div>
          </div>

          {/* Right Panel (Form Panel) */}
          <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-xl font-semibold mb-5 text-teal-900">
              Create your MedPulse account
            </h2>

            {/* Step 1: Name, Email, Phone, Send OTP */}
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); sendOTP(); }}>
                <CustomFormGroup label="Name" name="name" value={form.name} onChange={handleChange} />
                <CustomFormGroup label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                <CustomFormGroup label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                <PrimaryButton type="submit" onClick={sendOTP}>
                  Send OTP
                </PrimaryButton>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); verifyOTP(); }}>
                <CustomFormGroup label="Enter OTP" name="otp" value={form.otp} onChange={handleChange} />
                <PrimaryButton type="submit" onClick={verifyOTP}>
                  Verify OTP
                </PrimaryButton>
              </form>
            )}

            {/* Step 3: Set Password */}
            {step === 3 && (
              <form onSubmit={(e) => { e.preventDefault(); register(); }}>
                <CustomFormGroup label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
                <CustomFormGroup label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
                <PrimaryButton type="submit" onClick={register}>
                  Create Account
                </PrimaryButton>
              </form>
            )}

            {/* Links Row */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-700">
              <div>Already registered? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link></div>
              <div className="text-gray-400">|</div>
              <div><Link to="/forgot-password" className="text-blue-600 font-semibold hover:underline">Forgot password?</Link></div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;