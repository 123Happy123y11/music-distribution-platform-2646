import { useState, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UploadForm from "@/components/UploadForm";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const handleUploadClick = () => {
    setIsUploadFormOpen(true);
  };

  const handleCloseUploadForm = () => {
    setIsUploadFormOpen(false);
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handlePricingClick = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header 
        onLoginClick={handleLoginClick} 
        onPricingClick={handlePricingClick}
      />
      
      <Hero 
        onUploadClick={handleUploadClick} 
        onPricingClick={handlePricingClick}
      />
      
      <div id="features">
        <Features />
      </div>
      
      <div ref={pricingRef}>
        <Pricing onGetStarted={handleLoginClick} />
      </div>
      
      <Stats />
      <Footer />
      
      <UploadForm 
        isOpen={isUploadFormOpen} 
        onClose={handleCloseUploadForm} 
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal} 
      />
    </div>
  );
};

export default Index;