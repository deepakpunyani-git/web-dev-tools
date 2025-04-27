import React from "react";
import "../assets/css/Home.css";
import HeroSection from "../components/HeroSection";
import ToolsShowcase from "../components/ToolsShowcase";
import TestimonialsSection from "../components/TestimonialsSection";
import CallToAction from "../components/CallToAction";
import Features from "../components/Feature";
import UpcomingFeatures from "../components/UpcomingFeatures";
import RequestMoreFeatures from "../components/RequestMoreFeatures";


const Home = () => {
  return (
    <>
    <HeroSection />
    <UpcomingFeatures />
    <ToolsShowcase />
    <RequestMoreFeatures/>

    <Features></Features>
    
      <TestimonialsSection />

      <CallToAction />
    </>
  );
};

export default Home;
