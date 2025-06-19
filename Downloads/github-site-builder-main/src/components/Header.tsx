
import { Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({
      behavior: 'smooth'
    });
    setIsMenuOpen(false);
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <button onClick={scrollToTop} className="text-2xl font-bold text-black hover:text-blue-600 transition-colors cursor-pointer">My Portfolio</button>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('projects')} className="text-gray-700 hover:text-blue-600 transition-colors">
              Projects
            </button>
            <button onClick={() => scrollToSection('experience')} className="text-gray-700 hover:text-blue-600 transition-colors">
              Experience
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href="https://github.com/bidishaaroy" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors" aria-label="GitHub Profile">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/bidisha--roy/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors" aria-label="LinkedIn Profile">
              <Linkedin size={20} />
            </a>
            <a href="mailto:bidisha_roy@sfu.ca" className="text-gray-700 hover:text-blue-600 transition-colors" aria-label="Email Contact">
              <Mail size={20} />
            </a>
          </div>

          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </nav>

        {isMenuOpen && <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('about')} className="text-left text-gray-700 hover:text-blue-600 transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('projects')} className="text-left text-gray-700 hover:text-blue-600 transition-colors">
                Projects
              </button>
              <button onClick={() => scrollToSection('experience')} className="text-left text-gray-700 hover:text-blue-600 transition-colors">
                Experience
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-gray-700 hover:text-blue-600 transition-colors">
                Contact
              </button>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                <a href="https://github.com/bidishaaroy" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors" aria-label="GitHub Profile">
                  <Github size={20} />
                </a>
                <a href="https://www.linkedin.com/in/bidisha--roy/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors" aria-label="LinkedIn Profile">
                  <Linkedin size={20} />
                </a>
                <a href="mailto:bidisha_roy@sfu.ca" className="text-gray-700 hover:text-blue-600 transition-colors" aria-label="Email Contact">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>}
      </div>
    </header>;
};

export default Header;
