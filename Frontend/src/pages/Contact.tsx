
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building, 
  Clock, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone, 
  Twitter 
} from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Contact Us</h1>
            <p className="text-primary-foreground/90 max-w-xl mx-auto">
              Have questions about our services? We're here to help and answer any questions you might have.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Your Name</label>
                        <Input placeholder="Enter your full name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <Input type="email" placeholder="Enter your email" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input placeholder="Enter your phone number" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <Input placeholder="What is this regarding?" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea placeholder="How can we help you?" rows={6} />
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="consent" className="mr-2" />
                      <label htmlFor="consent" className="text-sm text-gray-600">
                        I agree to be contacted via email or phone about my query
                      </label>
                    </div>
                    <Button className="w-full sm:w-auto">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-primary mt-1 mr-3" />
                      <div>
                        <h4 className="font-medium">Our Main Office</h4>
                        <p className="text-sm text-gray-600">
                          Legacy land Real Estate, 123 Business Park,<br />
                          Andheri East, Mumbai 400069,<br />
                          Maharashtra, India
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-primary mt-1 mr-3" />
                      <div>
                        <h4 className="font-medium">Phone</h4>
                        <p className="text-sm text-gray-600">+91 22 1234 5678</p>
                        <p className="text-sm text-gray-600">Toll-Free: 1800 123 4567</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-primary mt-1 mr-3" />
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <p className="text-sm text-gray-600">contact@legacyland.com</p>
                        <p className="text-sm text-gray-600">support@legacyland.com</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-primary mt-1 mr-3" />
                      <div>
                        <h4 className="font-medium">Working Hours</h4>
                        <p className="text-sm text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p className="text-sm text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                        <p className="text-sm text-gray-600">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Facebook size={18} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Twitter size={18} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Instagram size={18} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Linkedin size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Our Offices</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Building className="w-5 h-5 text-primary mt-1 mr-3" />
                      <div>
                        <h4 className="font-medium">Mumbai</h4>
                        <p className="text-sm text-gray-600">
                          123 Business Park, Andheri East, Mumbai 400069
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Building className="w-5 h-5 text-primary mt-1 mr-3" />
                      <div>
                        <h4 className="font-medium">Delhi NCR</h4>
                        <p className="text-sm text-gray-600">
                          456 Corporate Tower, Sector 62, Noida 201301
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Building className="w-5 h-5 text-primary mt-1 mr-3" />
                      <div>
                        <h4 className="font-medium">Bangalore</h4>
                        <p className="text-sm text-gray-600">
                          789 Tech Park, Whitefield, Bangalore 560066
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="py-8">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-8">Locate Us</h2>
            <div className="rounded-lg overflow-hidden h-[400px] w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241316.6433263778!2d72.74109995784882!3d19.08268809671888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1650356129619!5m2!1sen!2sin" 
                style={{ border: 0, width: '100%', height: '100%' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
