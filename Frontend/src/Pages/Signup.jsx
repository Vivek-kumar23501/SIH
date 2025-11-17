import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";

const Signup = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    // Card animation
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("signup:", form);
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

        /* Left green panel */
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

        .form-panel {
          flex: 1;
          padding: 34px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

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

        .brand-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
          z-index: 2;
        }
        .brand-sub {
          font-size: 15px;
          line-height: 1.7;
          opacity: 0.95;
          z-index: 2;
        }

        .form-panel h2 { font-size: 22px; margin-bottom: 12px; color: #0b3b3b; }
        .form-panel p.lead { color: #416b6b; margin-bottom: 22px; }
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

        /* MOBILE VIEW: Hide left green card completely */
        @media (max-width: 767px) {
          .split-card { flex-direction: column; }

          .service-card {
            display: none !important;
          }

          .form-panel {
            padding: 22px;
          }
        }
      `}</style>

      <div className="page-wrap">
        <div className="split-card">

          {/* LEFT PANEL (HIDDEN IN MOBILE) */}
          <div className="service-card" aria-hidden>
            <div
              className="service-image"
              style={{ backgroundImage: `url('/images/medpulse-signup.jpg')` }}
            />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div className="brand-title">
                Join <span style={{ color: "#ffdf5b" }}>MedPulse</span>
              </div>
              <div className="brand-sub">
                Create an account to access AI-driven health guidance, preventive care tips,
                multilingual support, and real-time outbreak alerts.
              </div>
            </div>
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="form-panel">
            <h2>Create your MedPulse account</h2>
            <p className="lead">Quick signup — stay informed with trusted health updates.</p>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name" style={{ fontWeight: 700, fontSize: 13 }}>Full name</Label>
                <Input
                  id="name"
                  name="name"
                  className="input-rounded"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email" style={{ fontWeight: 700, fontSize: 13 }}>Email address</Label>
                <Input
                  id="email"
                  name="email"
                  className="input-rounded"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password" style={{ fontWeight: 700, fontSize: 13 }}>Password</Label>
                <Input
                  id="password"
                  name="password"
                  className="input-rounded"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                />
              </FormGroup>

              <Button type="submit" className="btn-primary-custom">
                Signup
              </Button>
            </Form>

            <div className="links-row">
              <div>Already registered? <Link to="/login">Login</Link></div>
              <div>|</div>
              <div><Link to="/forgot-password">Forgot password?</Link></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
