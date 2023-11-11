import About from "./Home/About";
import HeroArea from "./Home/HeroArea";
import Statistics from "./Home/Statistics";
import Pitch from "./Home/Pitch";
import Features from "./Home/Features";
import HeroHowItWorks from "./HowItWorks/HeroHowItWorks";
import HowItWorksSection from "./HowItWorks/HowItWorks";
import React from "react";
import FeatureHero from "./Features/featurehero";
import FeatureGrid from "./Features/featuregrid";
import PricingComponent from "./Pricing/pricing";

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

export const Feature = () => {
  return (
    <React.Fragment>
      <FeatureHero />
      <FeatureGrid />
    </React.Fragment>
  );
};

export const Pricing = () => {
  return (
    <React.Fragment>
      <PricingComponent />
    </React.Fragment>
  );
};

export const AboutUs = () => {
  return (
    <React.Fragment>
      <div>AboutUs</div>
    </React.Fragment>
  );
};

export const ContactUs = () => {
  return (
    <React.Fragment>
      <div>ContactUs</div>
    </React.Fragment>
  );
};
