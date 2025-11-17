import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [email, setEmail] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("send reset link to:", email);
  };

  return (
    <>
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
          .service-card { display: none !important; } /* HIDE LEFT PANEL ON MOBILE */
          .form-panel { padding: 22px; }
        }
      `}</style>

      <div className="page-wrap">
        <div className="split-card">
          
          {/* LEFT: Gradient Card — Hidden on Mobile */}
          {!isMobile && (
            <div className="service-card" aria-hidden>
              <div
                className="service-image"
                style={{ backgroundImage: `url('/images/medpulse-reset.jpg')` }}
              />
              <div style={{ position: "relative", zIndex: 2 }}>
                <div className="brand-title">Forgot Password?</div>
                <div className="brand-sub">
                  We'll help you get back into your MedPulse account securely.
                  Enter your registered email and we'll send a one-time secure link.
                </div>

                <div style={{ marginTop: 20, fontSize: 14, opacity: 0.95 }}>
                  • Encrypted reset link • Expires in 30 minutes • Privacy-first
                </div>
              </div>
            </div>
          )}

          {/* RIGHT: Reset Form */}
          <div className="form-panel">
            <h2>Reset your password</h2>
            <p className="lead" style={{ color: "#416b6b" }}>
              Enter the email associated with your account and we'll send a reset link.
            </p>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label style={{ fontWeight: 700, fontSize: 13 }}>Email address</Label>
                <Input
                  className="input-rounded"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </FormGroup>

              <div style={{ marginTop: 18 }}>
                <Button type="submit" className="btn-primary-custom">
                  Send Reset Link
                </Button>
              </div>
            </Form>

            <div className="links-row">
              <Link to="/login">Back to Login</Link>
              <div>|</div>
              <Link to="/signup">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
