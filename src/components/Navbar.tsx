
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, userType, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-primary text-2xl font-bold">Pet-Mate</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks isAuthenticated={isAuthenticated} userType={userType} logout={logout} />
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <NavLinks 
                isAuthenticated={isAuthenticated} 
                userType={userType} 
                logout={logout} 
                isMobile={true}
                closeMobileMenu={() => setMobileMenuOpen(false)} 
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

interface NavLinksProps {
  isAuthenticated: boolean;
  userType: "ngo" | "admin" | null;
  logout: () => void;
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

const NavLinks = ({ isAuthenticated, userType, logout, isMobile, closeMobileMenu }: NavLinksProps) => {
  const handleLinkClick = () => {
    if (isMobile && closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <>
      <Link 
        to="/" 
        className="text-gray-700 hover:text-primary font-medium transition-colors"
        onClick={handleLinkClick}
      >
        Home
      </Link>
      
      <Link 
        to="/report" 
        className="text-gray-700 hover:text-primary font-medium transition-colors"
        onClick={handleLinkClick}
      >
        Report Animal
      </Link>

      {isAuthenticated && userType === "ngo" ? (
        <>
          <Link 
            to="/ngo/dashboard" 
            className="text-gray-700 hover:text-primary font-medium transition-colors"
            onClick={handleLinkClick}
          >
            NGO Dashboard
          </Link>
          <Button 
            variant="outline" 
            onClick={() => {
              logout();
              if (isMobile && closeMobileMenu) {
                closeMobileMenu();
              }
            }}
          >
            Logout
          </Button>
        </>
      ) : !isAuthenticated || (isAuthenticated && userType !== "admin") ? (
        <Link 
          to="/ngo/auth" 
          className="text-gray-700 hover:text-primary font-medium transition-colors"
          onClick={handleLinkClick}
        >
          NGO Portal
        </Link>
      ) : null}

      {isAuthenticated && userType === "admin" && (
        <>
          <Link 
            to="/admin/dashboard" 
            className="text-gray-700 hover:text-primary font-medium transition-colors"
            onClick={handleLinkClick}
          >
            Admin Dashboard
          </Link>
          <Button 
            variant="outline" 
            onClick={() => {
              logout();
              if (isMobile && closeMobileMenu) {
                closeMobileMenu();
              }
            }}
          >
            Logout
          </Button>
        </>
      )}
    </>
  );
};

export default Navbar;
