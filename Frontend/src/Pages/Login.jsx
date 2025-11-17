import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";

const Login = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
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
          box-shadow: 0 10px 30px rgba(0,0,0,0.10);
          flex-direction: row;
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
          transition: 0.3s ease;
        }

        .btn-primary-custom:hover {
          transform: scale(1.07);
        }

        .links {
          margin-top: 20px;
          font-size: 14px;
          font-weight: 600;
          color: #0b63b6;
        }

        @media (max-width: 767px) {
          .login-card { flex-direction: column; }
          .left-panel { display: none; }
          .form-panel { padding: 30px 25px; }
        }
      `}</style>

      <div className="page-wrap">
        <div className="login-card">

          {/* LEFT PANEL — HIDDEN ON MOBILE */}
          {!isMobile && (
            <div className="left-panel">
              <div className="left-title">Welcome Back!</div>
              <div className="left-sub">
                Access your healthcare dashboard securely with AI-powered support.
              </div>
            </div>
          )}

          {/* RIGHT LOGIN FORM */}
          <div className="form-panel">
            <h2
              style={{
                fontWeight: "700",
                marginBottom: "25px",
                color: "#004d40",
              }}
            >
              Login to your account
            </h2>

            <Form>
              {/* EMAIL */}
              <FormGroup style={{ marginBottom: "20px" }}>
                <Label style={{ fontWeight: "600", fontSize: "14px" }}>
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="input-rounded"
                />
              </FormGroup>

              {/* PASSWORD */}
              <FormGroup style={{ marginBottom: "15px" }}>
                <Label style={{ fontWeight: "600", fontSize: "14px" }}>
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="input-rounded"
                />
              </FormGroup>

              {/* LOGIN BUTTON */}
              <div style={{ marginTop: "25px" }}>
                <Button className="btn-primary-custom">Login</Button>
              </div>

              {/* LINKS */}
              <div style={{ marginTop: "25px", lineHeight: "1.8" }}>
                <div style={{
                    color:"black"
                }}  className="links">
                  If you forgot the password then click{" "}
                  <Link to="/forgot-password">Forget Password</Link>
                </div>

                <div style={{
                    color:"black"
                }}  className="links">
                  If you have not registered then click{" "}
                  <Link to="/signup">Signup</Link>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
