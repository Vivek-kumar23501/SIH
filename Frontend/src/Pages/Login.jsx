import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [form, setForm] = useState({ email: "", password: "" });

  // Responsive check
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
      <style>{`
        .page-wrap {
          min-height: 100vh;
          background: #e0f7fa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px 20px;
        }
        .login-card {
          width: 100%;
          max-width: 950px;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .left-panel {
          flex: 1;
          background: linear-gradient(135deg, #00acc1, #00796b);
          padding: 40px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .left-title { font-size: 32px; font-weight: 700; margin-bottom: 10px; }
        .left-sub { font-size: 17px; opacity: 0.95; line-height: 1.6; }
        .form-panel {
          flex: 1;
          padding: 50px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .input-rounded {
          border-radius: 30px;
          padding: 12px 16px;
          border: 1px solid #cfeff0;
        }
        .btn-primary-custom {
          background: linear-gradient(90deg,#0b63b6,#2f8bff);
          border: none;
          border-radius: 28px;
          padding: 12px 35px;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(11,75,180,0.18);
          transition: all 0.3s ease;
        }
        .btn-primary-custom:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 25px rgba(11,75,180,0.25);
        }
        .links { margin-top: 15px; font-size: 14px; font-weight: 600; }
        .links a { text-decoration: none; color: #0b63b6; font-weight: 700; }
        @media(max-width: 767px){
          .login-card{ flex-direction: column; }
          .left-panel{ display:none; }
          .form-panel{ padding: 30px 25px; }
        }
      `}</style>

      <div className="page-wrap">
        <div className="login-card">

          {/* LEFT PANEL — HIDDEN ON MOBILE */}
          {!isMobile && (
            <div className="left-panel">
              <div className="left-title">Welcome Back!</div>
              <div className="left-sub">
                Access your dashboard securely with AI-powered support.
              </div>
            </div>
          )}

          {/* RIGHT LOGIN FORM */}
          <div className="form-panel">
            <h2 style={{ fontWeight: "700", marginBottom: "25px", color: "#004d40" }}>
              Login to your account
            </h2>

            <Form>
              <FormGroup style={{ marginBottom: "20px" }}>
                <Label style={{ fontWeight: "600", fontSize: "14px" }}>Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="input-rounded"
                  value={form.email}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup style={{ marginBottom: "15px" }}>
                <Label style={{ fontWeight: "600", fontSize: "14px" }}>Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="input-rounded"
                  value={form.password}
                  onChange={handleChange}
                />
              </FormGroup>

              <div style={{ marginTop: "25px" }}>
                <Button
                  type="button"
                  className="btn-primary-custom w-100"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </div>

              <div style={{ marginTop: "25px", lineHeight: "1.8" }}>
                <div className="links">
                  If you forgot the password, click <Link to="/forgot-password">Forget Password</Link>
                </div>
                <div className="links">
                  If you have not registered, click <Link to="/signup">Signup</Link>
                </div>
              </div>
            </Form>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
