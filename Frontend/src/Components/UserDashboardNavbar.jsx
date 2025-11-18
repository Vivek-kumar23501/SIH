import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        * {
          font-family: "Poppins", sans-serif;
        }

        .med-nav {
          width: 100%;
          background: #ffffff;
          border-bottom: 2px solid #00acc1;
          padding: 15px 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 999;
        }

        .med-nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .med-nav-left img {
          height: 45px;
          border-radius: 6px;
          object-fit: contain;
        }

        .med-title {
          font-size: 22px;
          font-weight: 700;
          color: #006064;
        }

        .med-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .med-link {
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          color: #004d40;
          padding: 8px 14px;
          border-radius: 8px;
          transition: 0.25s;
        }

        .med-link:hover {
          background: #00acc1;
          color: #ffffff;
        }
      `}</style>

      {/* Navbar */}
      <nav className="med-nav">
        {/* Left section */}
        <div className="med-nav-left">
          <img src="/MedPulse logo.jpg" alt="MedPulse Logo" />
          <span className="med-title">MedPulse</span>
        </div>

        {/* Navigation links */}
        <div className="med-links">
          <Link className="med-link" to="/dashboard">Dashboard</Link>
          <Link className="med-link" to="/dashboard/chatbot">Chatbot</Link>
          <Link className="med-link" to="/dashboard/health-awareness">Healthcare</Link>
          <Link className="med-link" to="/dashboard/common-diseases">Diseases</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
