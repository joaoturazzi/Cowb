
import React from 'react';
import {
  Header,
  Hero,
  Benefits,
  HowItWorks,
  Features,
  CTASection,
  Footer
} from '@/components/landing';

// Main Landing Page component
const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <HowItWorks />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
