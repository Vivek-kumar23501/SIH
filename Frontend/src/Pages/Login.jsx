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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f2f6ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          height: isMobile ? "auto" : "540px",
          backgroundColor: "#ffffff",
          borderRadius: "18px",
          overflow: "hidden",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          boxShadow: "0px 8px 30px rgba(0,0,0,0.12)",
        }}
      >
        {/* LEFT BLUE SECTION — Hidden on Mobile */}
        {!isMobile && (
          <div
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #005ad6, #2a8cff)",
              padding: "40px",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>
              WELCOME TO
            </h2>

            <div
              style={{
                fontSize: "30px",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              HEALTHCARE AI
            </div>

            <p style={{ lineHeight: "1.5", opacity: "0.95" }}>
              Your smart healthcare assistant — available in multiple languages.
            </p>
          </div>
        )}

        {/* RIGHT LOGIN FORM */}
        <div
          style={{
            flex: 1,
            padding: isMobile ? "30px 25px" : "55px 60px",
            width: "100%",
          }}
        >
          <h3
            style={{
              fontWeight: "600",
              marginBottom: "25px",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            Login to your account
          </h3>

          <Form>
            {/* EMAIL */}
            <FormGroup style={{ marginBottom: "20px" }}>
              <Label style={{ fontWeight: "600" }}>E-MAIL ADDRESS</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                style={{
                  borderRadius: "30px",
                  padding: "12px",
                  border: "1px solid #c2d8ff",
                }}
              />
            </FormGroup>

            {/* PASSWORD */}
            <FormGroup style={{ marginBottom: "10px" }}>
              <Label style={{ fontWeight: "600" }}>PASSWORD</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                style={{
                  borderRadius: "30px",
                  padding: "12px",
                  border: "1px solid #c2d8ff",
                }}
              />
            </FormGroup>

            {/* LOGIN BUTTON */}
            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              <Button
                style={{
                  backgroundColor: "#0066e6",
                  borderRadius: "30px",
                  padding: "12px 40px",
                  border: "none",
                  fontSize: "16px",
                  transition: "0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.transform = "scale(1.08)")
                }
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                Login
              </Button>
            </div>

            {/* LINKS SECTION */}
            <div
              style={{
                marginTop: "25px",
                textAlign: isMobile ? "center" : "left",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: "600" }}>
                If you forgot the password then click{" "}
                <Link
                  to="/forgot-password"
                  style={{
                    color: "#005ad6",
                    textDecoration: "none",
                  }}
                >
                  Forget Password
                </Link>
              </div>

              <div style={{ fontSize: "14px", fontWeight: "600" }}>
                If you have not registered then click{" "}
                <Link
                  to="/signup"
                  style={{
                    color: "#005ad6",
                    textDecoration: "none",
                  }}
                >
                  Signup
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
