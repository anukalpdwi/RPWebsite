import { Link } from "wouter";
import { schoolInfo } from "@/lib/utils";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaChevronRight, FaPaperPlane } from "react-icons/fa";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    // You would usually call an API here to subscribe the user
    toast({
      title: "Thank you for subscribing!",
      description: "You'll now receive our newsletter updates.",
    });
    
    setEmail("");
  };

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 bg-white rounded-md flex items-center justify-center text-primary font-bold text-xl mr-3">
                RP
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold">{schoolInfo.name}</h3>
                <p className="text-sm italic">{schoolInfo.location}</p>
              </div>
            </div>
            <p className="mb-4">Nurturing Excellence, Building Character, Creating Future Leaders since {schoolInfo.founded}.</p>
            <div className="flex space-x-3">
              <a href={schoolInfo.socialMedia.facebook} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-accent transition" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href={schoolInfo.socialMedia.twitter} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-accent transition" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href={schoolInfo.socialMedia.instagram} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-accent transition" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href={schoolInfo.socialMedia.youtube} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-accent transition" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-accent transition flex items-center"><FaChevronRight className="mr-1 text-xs" /> About Us</Link></li>
              <li><Link href="/academics" className="hover:text-accent transition flex items-center"><FaChevronRight className="mr-1 text-xs" /> Academics</Link></li>
              <li><Link href="/admissions" className="hover:text-accent transition flex items-center"><FaChevronRight className="mr-1 text-xs" /> Admissions</Link></li>
              <li><Link href="/facilities" className="hover:text-accent transition flex items-center"><FaChevronRight className="mr-1 text-xs" /> Facilities</Link></li>
              <li><Link href="/faculty" className="hover:text-accent transition flex items-center"><FaChevronRight className="mr-1 text-xs" /> Faculty</Link></li>
              <li><Link href="/gallery" className="hover:text-accent transition flex items-center"><FaChevronRight className="mr-1 text-xs" /> Gallery</Link></li>
              <li><Link href="/news" className="hover:text-accent transition flex items-center"><FaChevronRight className="mr-1 text-xs" /> News & Events</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition flex items-center"><FaChevronRight className="mr-1 text-xs" /> Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex">
                <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
                <span>{schoolInfo.address}</span>
              </li>
              <li className="flex">
                <FaPhoneAlt className="mt-1 mr-3 flex-shrink-0" />
                <span>{schoolInfo.phone}</span>
              </li>
              <li className="flex">
                <FaEnvelope className="mt-1 mr-3 flex-shrink-0" />
                <span>{schoolInfo.email}</span>
              </li>
              <li className="flex">
                <FaClock className="mt-1 mr-3 flex-shrink-0" />
                <span>Monday - Saturday<br />{schoolInfo.hours}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe to receive updates on school news, events, and announcements.</p>
            <form className="mb-4" onSubmit={handleSubscribe}>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="px-3 py-2 rounded-l-md w-full focus:outline-none text-neutral-dark"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  className="bg-accent hover:bg-accent-dark px-4 py-2 rounded-r-md transition"
                  aria-label="Subscribe"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
            <p className="text-sm">By subscribing, you agree to receive emails from RP Public School.</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/20 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-2 md:mb-0">&copy; {new Date().getFullYear()} {schoolInfo.name}, {schoolInfo.location}. All Rights Reserved.</p>
          <div className="flex text-sm">
            <Link href="/privacy" className="mr-4 hover:text-accent transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent transition">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
