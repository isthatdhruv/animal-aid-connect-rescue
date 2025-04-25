
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Animal Aid Connect</h3>
            <p className="text-gray-600 mb-4">
              Connecting those who find injured animals with the organizations 
              that can help them.
            </p>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Made with</span> 
              <Heart size={16} className="text-red-500 fill-red-500" /> 
              <span className="text-gray-600 ml-2">for animals in need</span>
            </div>
          </div>
          
          {/* Column 2: Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-gray-600 hover:text-primary transition-colors">
                  Report Animal
                </Link>
              </li>
              <li>
                <Link to="/ngo/auth" className="text-gray-600 hover:text-primary transition-colors">
                  NGO Portal
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-600 hover:text-primary transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-600 mb-2">
              Have questions or feedback?
            </p>
            <a 
              href="mailto:contact@animalaidconnect.org" 
              className="text-primary hover:underline"
            >
              contact@animalaidconnect.org
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-600">
          <p>&copy; {currentYear} Animal Aid Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
