import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TwoOSSection from './components/TwoOSSection';
import OSTabSection from './components/OSTabSection';
import OSFlowSection from './components/OSFlowSection';
import CommunityValidationSection from './components/CommunityValidationSection';
import Pricing from './components/Pricing';
import IntelligenceSection from './components/IntelligenceSection';
import MetricsSection from './components/MetricsSection';
import FAQSection from './components/FAQSection';
import MotionHeadlineSection from './components/MotionHeadlineSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <IntelligenceSection />
        <MetricsSection />
        <TwoOSSection />
        <OSTabSection />
        <OSFlowSection />
        <CommunityValidationSection />
        <Pricing />
        <FAQSection />
        <MotionHeadlineSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;