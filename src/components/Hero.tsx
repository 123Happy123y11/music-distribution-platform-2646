import { Button } from "@/components/ui/button";
import { Upload, Music, Headphones } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  onUploadClick: () => void;
  onPricingClick: () => void;
}

const Hero = ({ onUploadClick, onPricingClick }: HeroProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center space-x-4 text-white/80">
            <Music className="w-8 h-8" />
            <Headphones className="w-8 h-8" />
            <Music className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Share Your Music
          <span className="block bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            With The World
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          Upload your tracks and distribute them to Spotify, Apple Music, Amazon Music, 
          and 150+ other platforms. Keep 100% of your rights and royalties.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={onUploadClick}
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Your Music
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg rounded-full"
            onClick={onPricingClick}
          >
            View Pricing
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">150+</div>
            <div className="text-white/70">Streaming Platforms</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-white/70">Rights Ownership</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/70">Artist Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;