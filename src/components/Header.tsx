import { Button } from "@/components/ui/button";
import { Music, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onLoginClick: () => void;
  onPricingClick: () => void;
}

const Header = ({ onLoginClick, onPricingClick }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/10 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SoundWave</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/help" className="text-white/80 hover:text-white transition-colors">
                  Help
                </Link>
                <Link to="/support" className="text-white/80 hover:text-white transition-colors">
                  Support
                </Link>
              </>
            ) : (
              <>
                <a href="#features" className="text-white/80 hover:text-white transition-colors">
                  Features
                </a>
                <button 
                  onClick={onPricingClick}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Pricing
                </button>
                <Link to="/help" className="text-white/80 hover:text-white transition-colors">
                  Help
                </Link>
                <Link to="/support" className="text-white/80 hover:text-white transition-colors">
                  Support
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-white/80 text-sm">
                  Welcome, {user?.name.split(' ')[0]}
                </span>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10"
                  onClick={onLoginClick}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                  onClick={onLoginClick}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard"
                    className="text-white/80 hover:text-white transition-colors px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/help"
                    className="text-white/80 hover:text-white transition-colors px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Help
                  </Link>
                  <Link 
                    to="/support"
                    className="text-white/80 hover:text-white transition-colors px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Support
                  </Link>
                  <div className="flex flex-col space-y-2 pt-4">
                    <span className="text-white/80 text-sm px-2">
                      Welcome, {user?.name.split(' ')[0]}
                    </span>
                    <Button 
                      variant="ghost" 
                      className="text-white hover:bg-white/10 justify-start"
                      onClick={() => {
                        logout();
                        navigate('/');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <a 
                    href="#features" 
                    className="text-white/80 hover:text-white transition-colors px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <button 
                    onClick={() => {
                      onPricingClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-white/80 hover:text-white transition-colors px-2 py-1 text-left"
                  >
                    Pricing
                  </button>
                  <Link 
                    to="/help"
                    className="text-white/80 hover:text-white transition-colors px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Help
                  </Link>
                  <Link 
                    to="/support"
                    className="text-white/80 hover:text-white transition-colors px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Support
                  </Link>
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button 
                      variant="ghost" 
                      className="text-white hover:bg-white/10 justify-start"
                      onClick={() => {
                        onLoginClick();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                      onClick={() => {
                        onLoginClick();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;