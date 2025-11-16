import React, { useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  Bell,
  MessageSquare,
  UserCheck,
  Globe,
  Smartphone,
  Mic,
  ActivitySquare,
} from "lucide-react";

const services = [
  { icon: <MessageSquare size={30} />, title: "Disease Awareness Bot", description: "Get AI-based disease awareness info.", img: "/images/disease.jpg" },
  { icon: <UserCheck size={30} />, title: "Vaccination Assist", description: "Track vaccination schedules.", img: "/images/vaccine.jpg" },
  { icon: <Bell size={30} />, title: "Outbreak Alert", description: "Real-time outbreak alerts.", img: "/images/alert.jpg" },
  { icon: <Globe size={30} />, title: "Doctor Near Me", description: "Find nearby doctors easily.", img: "/images/doctor.jpg" },
  { icon: <Smartphone size={30} />, title: "WhatsApp Accessibility", description: "Access via WhatsApp.", img: "/images/whatsapp.jpg" },
  { icon: <Mic size={30} />, title: "Voice Assistance", description: "Voice-enabled guidance.", img: "/images/voice.jpg" },
];

const Services = () => {
  useEffect(() => {
    const cards = document.querySelectorAll(".service-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((card) => observer.observe(card));
  }, []);

  return (
    <>
      <style>{`
        .services-section {
          background: #e0f7fa;
          padding: 60px 0;
          min-height: 100vh;
        }
        .services-section h2 {
          text-align: center;
          font-family: 'Roboto Slab', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #00695c;
          margin-bottom: 50px;
        }
        .service-card {
          background: linear-gradient(135deg, #00acc1, #00796b);
          border-radius: 15px;
          padding: 25px 15px;
          margin-bottom: 25px;
          text-align: center;
          color: white;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          transform: translateY(50px);
          opacity: 0;
          transition: all 0.7s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          min-height: 250px; /* reduced height */
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .service-card.animate {
          transform: translateY(0);
          opacity: 1;
        }
        .service-icon {
          background: rgba(255,255,255,0.2);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          transition: all 0.3s ease;
        }
        .service-card:hover .service-icon {
          transform: scale(1.15);
          background: rgba(255,255,255,0.35);
        }
        .service-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .service-desc {
          font-size: 0.95rem;
          color: #e0f7fa;
          line-height: 1.4;
        }

        /* Sliding image effect */
        .service-image {
          position: absolute;
          left: -120%;
          top: 0;
          width: 120%;
          height: 100%;
          background-size: cover;
          background-position: center;
          border-radius: 15px;
          transition: all 0.5s ease;
          z-index: 0;
          opacity: 0.15;
        }
        .service-card:hover .service-image {
          left: 0;
          opacity: 0.25;
        }

        .service-content {
          position: relative;
          z-index: 2;
        }

        .service-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 12px 25px rgba(0,0,0,0.15);
        }

        @media (max-width: 767px) {
          .services-section {
            padding: 40px 15px;
          }
          .services-section h2 {
            font-size: 1.8rem;
          }
          .service-card {
            padding: 20px 10px;
            min-height: 230px; /* reduced height for mobile */
          }
        }
      `}</style>

      <div className="services-section">
        <Container>
          <h2>Our Services</h2>
          <Row>
            {services.map((service, index) => (
              <Col key={index} xs="12" sm="6" md="4">
                <div className="service-card">
                  <div
                    className="service-image"
                    style={{ backgroundImage: `url(${service.img})` }}
                  ></div>
                  <div className="service-content">
                    <div className="service-icon">{service.icon}</div>
                    <div className="service-title">{service.title}</div>
                    <div className="service-desc">{service.description}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Services;
