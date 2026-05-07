import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./screens/Footer";

import HeroSection from "./screens/HeroSection";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Otp from "./screens/Otp";
import AiPlanning from "./screens/AiPlanning";
import ForgotPassword from "./screens/ForgotPassword";
import About from "./screens/About";
import Services from "./screens/Services";
import CreateTestimonial from "./screens/CreateTestimonial";
import AllProjects from "./screens/AllProjects";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import TermsOfService from "./screens/TermsOfService";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/ai-planning" element={<AiPlanning />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/create-testimonials" element={<CreateTestimonial />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
