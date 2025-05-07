
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { Building, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between mb-10">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <Building className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-white">Legacy land Real Estate</span>
            </div>
            <p className="text-gray-400 max-w-xs mb-6">
              India's No.1 Property Portal. Buy, Sell, Rent residential and commercial properties in India.
            </p>
            {/* <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-primary hover:bg-gray-800">
                <Facebook size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-primary hover:bg-gray-800">
                <Twitter size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-primary hover:bg-gray-800">
                <Instagram size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-primary hover:bg-gray-800">
                <Linkedin size={18} />
              </Button>
            </div> */}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Popular Locations</h3>
              <ul className="space-y-2">
                <li>Mumbai</li>
                <li>Delhi NCR</li>
                <li>Bangalore</li>
                <li>Hyderabad</li>
                <li>Pune</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Buy Property</h3>
              <ul className="space-y-2">
                <li>Popular Searches</li>
                <li>Premium Projects</li>
                <li>New Projects</li>
                <li>Builder Properties</li>
                <li>NRI Services</li>
              </ul>
            </div>
            
            {/* <div>
              <h3 className="text-white font-semibold mb-4">Rental Properties</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-primary">PG and Co-Living</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Serviced Apartments</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Rental Agreements</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Rental Trends</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Rental Yields</a></li>
              </ul>
            </div> */}
            
            {/* <div>
              <h3 className="text-white font-semibold mb-4">Legacy land Real Estate</h3>
              <ul className="space-y-2">
                <li><Link to="/about-us" className="text-gray-400 hover:text-primary">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-primary">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-primary">Contact Us</Link></li>
                <li><Link to="/advertise" className="text-gray-400 hover:text-primary">Advertise</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div> */}
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          {/* <div className="mb-6">
            <h3 className="text-white font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-800 border-gray-700 text-white w-1/5"
              />
              <Button className="bg-primary hover:bg-primary/90">Subscribe</Button>
            </div>
          </div> */}
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2023 Legacy land Real Estate. All rights reserved.
            </p>
            {/* <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-primary">Terms of Use</a>
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <a href="#" className="hover:text-primary">Cookie Policy</a>
              <a href="#" className="hover:text-primary">Sitemap</a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
