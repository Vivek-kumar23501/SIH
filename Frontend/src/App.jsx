import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HeroSection from "./Components/HeroSection";
import Services from "./Components/Services";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ForgetPassword from "./Pages/ForgetPassword";

function App() {
  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f2f7ff",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <Routes>
        <Route path="/" element={<><HeroSection /><Services /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
