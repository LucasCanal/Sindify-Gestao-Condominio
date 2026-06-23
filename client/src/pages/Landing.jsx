import React from 'react';

// Importando seus componentes modulares
import Header from '../components/layout/Header';
import Hero from '../components/layout/Hero'; 
import FeaturesDiagram from '../components/layout/FeaturesDiagram';
import Footer from '../components/layout/Footer';
import CaseStudies from '../components/layout/CaseStudies';
import AboutSection from '../components/layout/AboutSection';
import BlogSection from '../components/layout/BlogSection';
import Avaliation from '../components/layout/Avaliation';

export default function Landing() {
  return (
    <div style={{ 
      background: '#ffffff', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      
      {/* topo */}
      <Header />

      {/* meio */}
      <main style={{ flex: 1 }}>
        {/* Banner principal do topo */}
        <Hero />
        
        {/* Seção moderna  */}
        <FeaturesDiagram />
        <CaseStudies />
        <Avaliation />
        <AboutSection />
        <BlogSection />
        
      </main>

      {/* base */}
      <Footer />

    </div>
  );
}