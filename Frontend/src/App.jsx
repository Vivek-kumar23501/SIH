import React from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HeroSection from "./Components/HeroSection";
import Services from "./Components/Services";
import DiseaseAwareness from "./Components/DiseaseAwareness";

function App() {
  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f2f7ff",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <Navbar />
      
<HeroSection />
<Services />
<DiseaseAwareness />
  
      <Footer />
    </div>
  );
}

export default App;
