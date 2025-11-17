import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

const ForgetPassword = () => {
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
          <h3 style={{ fontWeight: "700", marginBottom: "20px" }}>
            Reset Your Password
          </h3>

          <p
            style={{
              fontSize: "14px",
              marginBottom: "25px",
              opacity: 0.8,
            }}
          >
            Enter your registered email address and we will send you a secure
            link to reset your password.
          </p>

          <Form>
            {/* EMAIL FIELD */}
            <FormGroup>
              <Label style={{ fontWeight: "600" }}>Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your registered email"
                style={{
                  borderRadius: "30px",
                  padding: "12px",
                  border: "1px solid #c2d8ff",
                }}
              />
            </FormGroup>

            {/* RESET BUTTON */}
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
                Send Reset Link
              </Button>
            </div>

            {/* BACK TO LOGIN */}
            <p
              style={{
                marginTop: "20px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Remember your password?{" "}
              <a href="/login" style={{ color: "#005ad6" }}>
                Login
              </a>
            </p>
          </Form>
        </div>

        {/* RIGHT SIDE CONTENT – PROFESSIONAL MEDPULSE THEME */}
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
                fontSize: "34px",
                lineHeight: "1.2",
              }}
            >
              Forgot Your Password?
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: "1.7",
                opacity: 0.95,
                marginBottom: "20px",
              }}
            >
              No worries! MedPulse ensures secure and seamless recovery so you
              can continue accessing trusted healthcare insights without
              interruption.
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                opacity: 0.9,
                marginBottom: "25px",
              }}
            >
              Your data is protected end-to-end, and our encrypted reset process
              guarantees the safety of your account.
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
              MedPulse — Your trusted partner in AI-driven public healthcare.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
