
import { Mail, Linkedin, Github } from "lucide-react";

const Contact = () => {
  return <section id="contact" className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-zinc-950">Contact Me</h2>
          
          <div className="max-w-2xl mx-auto">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <div className="space-y-1">
                      <a href="mailto:bidisha_roy@sfu.ca" className="block text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        bidisha_roy@sfu.ca
                      </a>
                      <a href="mailto:bidisharoybrn@gmail.com" className="block text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        bidisharoybrn@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Linkedin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">LinkedIn</p>
                    <a href="https://www.linkedin.com/in/bidisha--roy/" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors">
                      https://www.linkedin.com/in/bidisha--roy/
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Github className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Github</p>
                    <a href="https://github.com/bidishaaroy" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                      https://github.com/bidishaaroy
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default Contact;
