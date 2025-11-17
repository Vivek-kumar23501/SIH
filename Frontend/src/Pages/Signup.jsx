import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

const Signup = () => {
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
          maxWidth: "900px",
          height: isMobile ? "auto" : "600px",
          backgroundColor: "#ffffff",
          borderRadius: "18px",
          overflow: "hidden",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          boxShadow: "0px 8px 30px rgba(0,0,0,0.12)",
        }}
      >
        {/* LEFT SECTION – FORM */}
        <div
          style={{
            flex: 1,
            padding: isMobile ? "30px 25px" : "55px 60px",
          }}
        >
          <h3 style={{ fontWeight: "700", marginBottom: "25px" }}>
            Create Your MedPulse Account
          </h3>

          <Form>
            {/* FULL NAME */}
            <FormGroup>
              <Label style={{ fontWeight: "600" }}>Full Name</Label>
              <Input
                type="text"
                placeholder="Enter your full name"
                style={{
                  borderRadius: "30px",
                  padding: "12px",
                  border: "1px solid #c2d8ff",
                }}
              />
            </FormGroup>

            {/* EMAIL */}
            <FormGroup>
              <Label style={{ fontWeight: "600" }}>Email Address</Label>
              <Input
                type="email"
                placeholder="Enter email"
                style={{
                  borderRadius: "30px",
                  padding: "12px",
                  border: "1px solid #c2d8ff",
                }}
              />
            </FormGroup>

            {/* PASSWORD */}
            <FormGroup>
              <Label style={{ fontWeight: "600" }}>Password</Label>
              <Input
                type="password"
                placeholder="Create a password"
                style={{
                  borderRadius: "30px",
                  padding: "12px",
                  border: "1px solid #c2d8ff",
                }}
              />
            </FormGroup>

            {/* SIGNUP BUTTON */}
            <div style={{ marginTop: "25px" }}>
              <Button
                style={{
                  backgroundColor: "#0066e6",
                  borderRadius: "30px",
                  padding: "12px 35px",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  transition: "0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.transform = "scale(1.08)")
                }
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                Signup
              </Button>
            </div>

            {/* LOGIN LINK */}
            <p
              style={{
                marginTop: "20px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Already have an account?{" "}
              <a href="/login" style={{ color: "#005ad6" }}>
                Login
              </a>
            </p>
          </Form>
        </div>

        {/* RIGHT SIDE CONTENT (Updated & Professional) */}
        {!isMobile && (
          <div
            style={{
              width: "50%",
              background: "linear-gradient(135deg, #0b4ae2, #4e8bff)",
              color: "white",
              padding: "50px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                fontWeight: "700",
                marginBottom: "20px",
                fontSize: "36px",
                lineHeight: "1.2",
              }}
            >
              Join <span style={{ color: "#ffdf5b" }}>MedPulse</span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: "1.7",
                opacity: 0.95,
                marginBottom: "20px",
              }}
            >
              Create your account and step into a smarter way of accessing
              healthcare guidance. MedPulse connects you with AI-powered
              health insights, preventive care support, and trusted disease
              awareness tools.
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                opacity: 0.9,
                marginBottom: "25px",
              }}
            >
              Stay informed with real-time alerts, multilingual assistance,
              and reliable information designed to empower communities across
              India.
            </p>

            <div
              style={{
                marginTop: "20px",
                fontSize: "15px",
                opacity: 0.8,
                borderTop: "1px solid rgba(255,255,255,0.3)",
                paddingTop: "20px",
              }}
            >
              Be part of the platform shaping the future of public health
              awareness.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
