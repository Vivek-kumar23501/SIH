import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Signup = () => {
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    // Animation for left panel
    const cards = document.querySelectorAll(".service-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate");
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

  return (
    <>
    <Navbar />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * {
          font-family: 'Poppins', sans-serif;
        }

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
          min-height: 430px;
          background: linear-gradient(135deg, #00acc1, #00796b);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          opacity: 0;
          transform: translateY(40px);
          transition: 0.8s ease;
        }
        .service-card.animate { opacity: 1; transform: translateY(0); }

        .service-image {
          position: absolute;
          left: -110%;
          top: 0;
          width: 120%;
          height: 100%;
          opacity: 0.12;
          background-size: cover;
          background-position: center;
          transition: 0.6s ease;
        }
        .service-card:hover .service-image { left: 0; opacity: 0.25; }

        .service-card h2 {
          font-size: 28px;
          font-weight: 700;
        }
        .service-card span { color: #ffdf5b; }
        .service-card p {
          font-size: 15px;
          line-height: 1.6;
          opacity: 0.95;
        }

        .form-panel {
          flex: 1;
          padding: 34px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .form-panel h2 {
          font-size: 22px;
          margin-bottom: 12px;
          font-weight: 600;
          color: #0b3b3b;
        }

        .input-rounded {
          border-radius: 30px;
          padding: 12px 16px;
          border: 1px solid #cfeff0;
          font-size: 15px;
          font-weight: 500;
        }

        .btn-primary-custom {
          background: linear-gradient(90deg,#0b63b6,#2f8bff);
          border: none;
          border-radius: 28px;
          padding: 10px 20px;
          font-weight: 700;
          margin-top: 8px;
          width: 100%;
          transition: transform 0.2s ease;
          font-size: 16px;
        }
        .btn-primary-custom:hover {
          transform: scale(1.03);
        }

        .links-row { margin-top: 18px; display:flex; gap:12px; align-items:center; flex-wrap:wrap; font-size: 14px; }
        .links-row a { color: #0b63b6; font-weight: 600; text-decoration: none; }

        @media(max-width: 767px) {
          .split-card { flex-direction: column; }
          .service-card { display: none !important; }
          .form-panel { padding: 22px; }
        }
      `}</style>

      <div className="page-wrap">
        <div className="split-card">

          <div className="service-card">
            <div
              className="service-image"
              style={{ backgroundImage: `url('/images/medpulse-signup.jpg')` }}
            />
            <h2>Join <span>MedPulse</span></h2>
            <p>
              Create your account and receive AI-driven healthcare alerts,
              preventive guidance, and multilingual support.
            </p>
          </div>

          <div className="form-panel">
            <h2>Create your MedPulse account</h2>

            {step === 1 && (
              <Form>
                <FormGroup>
                  <Label>Name</Label>
                  <Input className="input-rounded" name="name" onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Email</Label>
                  <Input className="input-rounded" name="email" type="email" onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Phone</Label>
                  <Input className="input-rounded" name="phone" onChange={handleChange} />
                </FormGroup>
                <Button className="btn-primary-custom" onClick={sendOTP}>
                  Send OTP
                </Button>
              </Form>
            )}

            {step === 2 && (
              <Form>
                <FormGroup>
                  <Label>Enter OTP</Label>
                  <Input className="input-rounded" name="otp" onChange={handleChange} />
                </FormGroup>
                <Button className="btn-primary-custom" onClick={verifyOTP}>
                  Verify OTP
                </Button>
              </Form>
            )}

            {step === 3 && (
              <Form>
                <FormGroup>
                  <Label>Password</Label>
                  <Input className="input-rounded" type="password" name="password" onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Confirm Password</Label>
                  <Input className="input-rounded" type="password" name="confirmPassword" onChange={handleChange} />
                </FormGroup>
                <Button className="btn-primary-custom" onClick={register}>
                  Create Account
                </Button>
              </Form>
            )}

            <div className="links-row">
              <div>Already registered? <Link to="/login">Login</Link></div>
              <div>|</div>
              <div><Link to="/forgot-password">Forgot password?</Link></div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
