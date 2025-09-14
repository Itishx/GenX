import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Pricing from './components/Pricing';
import AgentsShowcase from './components/AgentsShowcase';
import CustomAgentsIntro from './components/CustomAgentsIntro';
import ModelFlexibility from './components/ModelFlexibility';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <AgentsShowcase />
        <ModelFlexibility />
        <CustomAgentsIntro />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default App;