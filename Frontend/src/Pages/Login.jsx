import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

// Helper component for styled input fields
const CustomInput = ({ label, name, type, placeholder, value, onChange }) => (
  <div className="mb-5">
    <label className="block font-semibold text-sm mb-1" htmlFor={name} style={{ color: "#004d40" }}>
      {label}
    </label>
    <input
      className="w-full rounded-full px-4 py-3 border border-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-150"
      type={type}
      name={name}
      id={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

// Helper component for the primary custom button
const PrimaryButton = ({ onClick, children }) => (
  <button
    type="button"
    className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold rounded-full py-3 px-8 shadow-xl shadow-blue-900/10 transition duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-xl hover:shadow-blue-900/25"
    onClick={onClick}
  >
    {children}
  </button>
);

const Login = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [form, setForm] = useState({ email: "", password: "" });

  // Responsive check (Kept the original logic for conditional rendering on mobile)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      if (res.data.success) {
        const { token, user } = res.data;

        // Save token, userId, and user info in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("user", JSON.stringify(user));

        alert("Login successful!");

        // Role-based redirection
        switch (user.role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "user":
            navigate("/dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar />

      {/* Page Wrap */}
      <div className="min-h-screen bg-cyan-50 flex items-center justify-center p-8 md:p-12">
        {/* Login Card */}
        <div className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-xl shadow-gray-300/50 flex flex-col md:flex-row">

          {/* LEFT PANEL — HIDDEN ON MOBILE (using Tailwind's responsive classes) */}
          <div className="flex-1 bg-gradient-to-br from-cyan-600 to-teal-600 p-10 text-white flex flex-col justify-center hidden md:flex">
            <div className="text-4xl font-bold mb-3">Welcome Back!</div>
            <div className="text-lg opacity-95 leading-relaxed">
              Access your dashboard securely with AI-powered support.
            </div>
          </div>

          {/* RIGHT LOGIN FORM */}
          <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h2 className="font-bold text-2xl mb-8 text-teal-900">
              Login to your account
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <CustomInput
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />

              <CustomInput
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />

              <div className="mt-8">
                <PrimaryButton onClick={handleLogin}>
                  Login
                </PrimaryButton>
              </div>

              <div className="mt-6 text-sm font-semibold space-y-2 leading-relaxed">
                <div className="text-gray-600">
                  If you forgot the password, click{" "}
                  <Link to="/forgot-password" className="text-blue-600 hover:underline">
                    Forget Password
                  </Link>
                </div>
                <div className="text-gray-600">
                  If you have not registered, click{" "}
                  <Link to="/signup" className="text-blue-600 hover:underline">
                    Signup
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;