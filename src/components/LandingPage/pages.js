import About from "./Home/About";
import HeroArea from "./Home/HeroArea";
import Statistics from "./Home/Statistics";
import Pitch from "./Home/Pitch";
import Features from "./Home/Features";
import HeroHowItWorks from "./HowItWorks/HeroHowItWorks";
import HowItWorksSection from "./HowItWorks/HowItWorks";
import React from "react";

export const Home = () => {
  return (
    <React.Fragment>
      <HeroArea />
      <About />
      <Statistics />
      <Pitch />
      <Features />
    </React.Fragment>
  );
};

export const HowItWorks = () => {
  return (
    <React.Fragment>
      <HeroHowItWorks />
      <HowItWorksSection />
      <Features />
    </React.Fragment>
  );
};
