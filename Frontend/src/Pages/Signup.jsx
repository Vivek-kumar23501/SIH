import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert, Spinner } from "reactstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Signup = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState(""); // Store userId for OTP verification
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    otp: "",
    password: "",
    confirmPassword: "",
    role: "patient" // Default role
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10,15}$/.test(form.mobile)) newErrors.mobile = "Please enter a valid mobile number (10-15 digits)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Step 1: Initial signup - creates user and sends OTP
  const handleSignup = async () => {
    if (!validateStep1()) return;

    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        role: form.role
      });
      
      if (res.data.success) {
        setUserId(res.data.data.userId);
        setSuccess(res.data.message || "User created successfully. OTP sent to your email!");
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOTP = async () => {
    if (!form.otp.trim()) {
      setError("Please enter OTP");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post("http://localhost:5000/auth/verify-otp", {
        email: form.email,
        otp: form.otp
      });
      
      if (res.data.success) {
        setSuccess(res.data.message || "Email verified successfully!");
        
        // Store tokens and user data
        localStorage.setItem("accessToken", res.data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        
        // Set refresh token as cookie would be handled automatically by browser
        setStep(4); // Success step
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post("http://localhost:5000/auth/resend-otp", {
        email: form.email
      });
      
      if (res.data.success) {
        setSuccess(res.data.message || "OTP resent successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set password (combined with signup in your backend, so this step is handled differently)
  const handlePasswordSetup = async () => {
    if (!validateStep3()) return;

    // In your backend, password is set during signup, so we proceed to OTP verification
    setForm(prev => ({ ...prev, password: form.password }));
    await handleSignup();
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <>
      <Navbar />
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
          position: relative;
          overflow: hidden;
        }

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
          position: relative;
          z-index: 2;
        }
        .service-card span { color: #ffdf5b; }
        .service-card p {
          font-size: 15px;
          line-height: 1.6;
          opacity: 0.95;
          position: relative;
          z-index: 2;
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
        .btn-primary-custom:disabled {
          opacity: 0.7;
          transform: none;
        }

        .btn-secondary-custom {
          background: #6c757d;
          border: none;
          border-radius: 28px;
          padding: 10px 20px;
          font-weight: 700;
          margin-top: 8px;
          width: 100%;
          transition: transform 0.2s ease;
          font-size: 16px;
        }

        .links-row { 
          margin-top: 18px; 
          display:flex; 
          gap:12px; 
          align-items:center; 
          flex-wrap:wrap; 
          font-size: 14px; 
        }
        .links-row a { 
          color: #0b63b6; 
          font-weight: 600; 
          text-decoration: none; 
        }

        .text-danger {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
        }

        .otp-resend {
          text-align: center;
          margin-top: 10px;
        }

        .otp-resend button {
          background: none;
          border: none;
          color: #0b63b6;
          cursor: pointer;
          text-decoration: underline;
        }

        .success-step {
          text-align: center;
          padding: 20px;
        }

        .success-icon {
          font-size: 48px;
          color: #28a745;
          margin-bottom: 20px;
        }

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

            {error && <Alert color="danger">{error}</Alert>}
            {success && <Alert color="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <FormGroup>
                    <Label>Name *</Label>
                    <Input 
                      className="input-rounded" 
                      name="name" 
                      value={form.name}
                      onChange={handleChange}
                      invalid={!!errors.name}
                      required
                    />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label>Email *</Label>
                    <Input 
                      className="input-rounded" 
                      name="email" 
                      type="email" 
                      value={form.email}
                      onChange={handleChange}
                      invalid={!!errors.email}
                      required
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label>Mobile Number *</Label>
                    <Input 
                      className="input-rounded" 
                      name="mobile" 
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="10-15 digits without country code"
                      invalid={!!errors.mobile}
                      required
                    />
                    {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label>Password *</Label>
                    <Input 
                      className="input-rounded" 
                      type="password" 
                      name="password" 
                      value={form.password}
                      onChange={handleChange}
                      invalid={!!errors.password}
                      required
                    />
                    {errors.password && <div className="text-danger">{errors.password}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label>Confirm Password *</Label>
                    <Input 
                      className="input-rounded" 
                      type="password" 
                      name="confirmPassword" 
                      value={form.confirmPassword}
                      onChange={handleChange}
                      invalid={!!errors.confirmPassword}
                      required
                    />
                    {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                  </FormGroup>
                  <Button 
                    className="btn-primary-custom" 
                    onClick={handleSignup}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "Create Account & Send OTP"}
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <FormGroup>
                    <Label>Enter OTP *</Label>
                    <Input 
                      className="input-rounded" 
                      name="otp" 
                      value={form.otp}
                      onChange={handleChange}
                      placeholder="Enter 6-digit OTP sent to your email"
                      required
                    />
                  </FormGroup>
                  <Button 
                    className="btn-primary-custom" 
                    onClick={verifyOTP}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "Verify OTP"}
                  </Button>
                  <div className="otp-resend">
                    <button type="button" onClick={resendOTP} disabled={loading}>
                      {loading ? "Sending..." : "Resend OTP"}
                    </button>
                  </div>
                </>
              )}

              {step === 4 && (
                <div className="success-step">
                  <div className="success-icon">✓</div>
                  <h3>Account Created Successfully!</h3>
                  <p>Your account has been verified and you're now logged in.</p>
                  <Button 
                    className="btn-primary-custom" 
                    onClick={handleLoginRedirect}
                  >
                    Continue to Dashboard
                  </Button>
                </div>
              )}
            </Form>

            {step !== 4 && (
              <div className="links-row">
                <div>Already registered? <Link to="/login">Login</Link></div>
                <div>|</div>
                <div><Link to="/forgot-password">Forgot password?</Link></div>
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;