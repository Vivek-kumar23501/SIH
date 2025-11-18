import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ForgetPassword from "./Pages/ForgetPassword";
import UserDashboard from "./Pages/UserDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import Chatbot from "./Components/Chatbot";

function App() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh" }}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          {/* Default Dashboard Page */}
          <Route index element={<div>Welcome to your Dashboard</div>} />

          {/* Chatbot Page */}
          <Route path="chatbot" element={<Chatbot />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
