import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const UserDashboardFooter = () => {
  return (
    <>
      <style>{`
        .dashboard-footer {
          background: #004d40;
          color: #ffffff;
          padding: 40px 20px;
          font-family: 'Poppins', sans-serif;
        }

        .dashboard-footer a {
          color: #b2dfdb;
          text-decoration: none;
          transition: 0.2s;
        }
        .dashboard-footer a:hover {
          color: #ffffff;
        }

        .footer-heading {
          font-weight: 700;
          margin-bottom: 12px;
          font-size: 16px;
        }

        .social-icons svg {
          margin-right: 12px;
          cursor: pointer;
          transition: 0.2s;
        }
        .social-icons svg:hover {
          color: #00acc1;
          transform: scale(1.1);
        }

        @media(max-width: 767px) {
          .dashboard-footer { text-align: center; }
          .social-icons { justify-content: center; margin-top: 15px; }
        }
      `}</style>

      <footer className="dashboard-footer">
        <Container>
          <Row>
            <Col md="4">
              <div className="footer-heading">About MedPulse</div>
              <p>
                AI-Driven Public Health Chatbot to educate rural and semi-urban populations about preventive healthcare, disease symptoms, and vaccination schedules.
              </p>
            </Col>

            <Col md="3">
              <div className="footer-heading">Quick Links</div>
              <ul className="list-unstyled">
                <li><a href="/dashboard/health-awareness">Health Awareness</a></li>
                <li><a href="/dashboard/common-diseases">Common Diseases</a></li>
                <li><a href="/dashboard/whatsapp-bot">AI Chatbot</a></li>
                <li><a href="/dashboard/govt-programs">Govt Programs</a></li>
              </ul>
            </Col>

            <Col md="3">
              <div className="footer-heading">Support</div>
              <ul className="list-unstyled">
                <li><a href="/dashboard/profile">Profile</a></li>
                <li><a href="/dashboard/settings">Settings</a></li>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/help">Help Center</a></li>
              </ul>
            </Col>

            <Col md="2">
              <div className="footer-heading">Follow Us</div>
              <div className="d-flex social-icons">
                <Facebook size={20} />
                <Twitter size={20} />
                <Instagram size={20} />
                <Linkedin size={20} />
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col className="text-center">
              <small>&copy; {new Date().getFullYear()} MedPulse. All Rights Reserved.</small>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default UserDashboardFooter;
