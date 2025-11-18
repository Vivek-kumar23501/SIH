import React, { useEffect, useState } from "react";
import { Form, FormGroup, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";


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

    const cards = document.querySelectorAll(".service-card");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate");
        }),
      { threshold: 0.15 }
    );

    cards.forEach((c) => observer.observe(c));

    return () => {
      window.removeEventListener("resize", handleResize);
      cards.forEach((c) => observer.unobserve(c));
    };
  }, []);

  // Step 1: send OTP
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

  // Step 2: verify OTP
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

  // Step 3: reset password
  const resetPassword = async () => {
    if (password !== confirmPassword) return alert("Passwords do not match!");
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
      <style>{`
        .page-wrap {
          min-height: 100vh;
          background: #e0f7fa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px 18px;
        }

        .split-card {
          width: 100%;
          max-width: 980px;
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .service-card {
          flex: 1;
          padding: 28px;
          position: relative;
          min-height: 420px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-radius: 0;
          background: linear-gradient(135deg, #00acc1, #00796b);
          color: white;
          transform: translateY(40px);
          opacity: 0;
          transition: all 0.7s ease;
        }
        .service-card.animate { transform: translateY(0); opacity: 1; }

        .service-image {
          position: absolute;
          left: -110%;
          top: 0;
          width: 120%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0.10;
          transition: all 0.55s ease;
          z-index: 0;
        }
        .service-card:hover .service-image { left: 0; opacity: 0.20; }

        .form-panel {
          flex: 1;
          padding: 34px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .brand-title { font-size: 28px; font-weight:700; margin-bottom:10px; }
        .brand-sub { font-size: 15px; line-height:1.7; opacity:0.95; }

        .input-rounded { border-radius: 30px; padding: 12px 16px; border: 1px solid #cfeff0; }
        .btn-primary-custom {
          background: linear-gradient(90deg,#0b63b6,#2f8bff);
          border: none;
          border-radius: 28px;
          padding: 10px 20px;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(11,75,180,0.18);
        }

        .links-row { margin-top: 18px; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
        .links-row a { color: #0b63b6; font-weight: 600; text-decoration: none; }

        @media (max-width: 767px) {
          .split-card { flex-direction: column; }
          .service-card { display: none !important; }
          .form-panel { padding: 22px; }
        }
      `}</style>

      <div className="page-wrap">
        <div className="split-card">
          {!isMobile && (
            <div className="service-card" aria-hidden>
              <div className="service-image" style={{ backgroundImage: `url('/images/medpulse-reset.jpg')` }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <div className="brand-title">Forgot Password?</div>
                <div className="brand-sub">
                  We'll help you get back into your account securely.
                  Enter your registered email and follow the steps.
                </div>
              </div>
            </div>
          )}

          <div className="form-panel">
            <h2>Reset your password</h2>
            {step === 1 && (
              <>
                <FormGroup className="mb-3 position-relative">
                  <FaEnvelope className="position-absolute" style={{ top: '12px', left: '10px', color:'#764ba2' }}/>
                  <Input type="email" placeholder="Enter your Email" required value={email} onChange={e=>setEmail(e.target.value)} style={{ paddingLeft:'35px' }} />
                  <Button className="btn-primary-custom w-100 mt-2" onClick={sendOTP}>Send OTP</Button>
                </FormGroup>
              </>
            )}
            {step === 2 && (
              <FormGroup>
                <Input type="text" placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} />
                <Button className="btn-primary-custom w-100 mt-2" onClick={verifyOTP}>Verify OTP</Button>
              </FormGroup>
            )}
            {step === 3 && (
              <>
                <FormGroup>
                  <Input type="password" placeholder="New Password" value={password} onChange={e=>setPassword(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
                </FormGroup>
                <Button className="btn-primary-custom w-100" onClick={resetPassword}>Reset Password</Button>
              </>
            )}
            <div className="links-row">
              <Link to="/login">Back to Login</Link>
              <Link to="/signup">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgetPassword;
