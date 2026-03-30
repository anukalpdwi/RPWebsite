import { Link } from "wouter";
import { schoolInfo } from "@/lib/utils";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaChevronRight, FaPaperPlane, FaLock } from "react-icons/fa";
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <div className="flex items-center mb-4">
            <img 
              src="/Images/logo/favicon.jpg" 
              alt="School Logo" 
              className="h-16 w-16 object-contain"
            />
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
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Link href="/about" className="hover:text-accent transition flex items-center text-sm"><FaChevronRight className="mr-1 text-[10px]" /> About Us</Link>
              <Link href="/academics" className="hover:text-accent transition flex items-center text-sm"><FaChevronRight className="mr-1 text-[10px]" /> Academics</Link>
              <Link href="/apply-now" className="hover:text-accent transition flex items-center text-sm"><FaChevronRight className="mr-1 text-[10px]" /> Apply Now</Link>
              <Link href="/facilities" className="hover:text-accent transition flex items-center text-sm"><FaChevronRight className="mr-1 text-[10px]" /> Facilities</Link>
              <Link href="/faculty" className="hover:text-accent transition flex items-center text-sm"><FaChevronRight className="mr-1 text-[10px]" /> Faculty</Link>
              <Link href="/gallery" className="hover:text-accent transition flex items-center text-sm"><FaChevronRight className="mr-1 text-[10px]" /> Gallery</Link>
              <Link href="/news" className="hover:text-accent transition flex items-center text-sm"><FaChevronRight className="mr-1 text-[10px]" /> News</Link>
              <Link href="/contact" className="hover:text-accent transition flex items-center text-sm"><FaChevronRight className="mr-1 text-[10px]" /> Contact</Link>
            </div>
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
                <span className="whitespace-nowrap">{schoolInfo.phone}</span>
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
          
        </div>
      </div>
      
      <div className="border-t border-white/20 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-2 md:mb-0">&copy; {new Date().getFullYear()} {schoolInfo.name}, {schoolInfo.location}. All Rights Reserved.</p>
          <p className="text-center text-sm text-white-500">
           Developed by: <a href="https://www.linkedin.com/in/anukalp-dwivedi" target="_blank" className="text-yellow-200 hover:underline">Anukalp Dwivedi</a></p>
          <div className="flex items-center text-sm">
            <Link href="/privacy" className="mr-4 hover:text-accent transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent transition">Terms of Use</Link>
            <span className="mx-2 text-white/30">|</span>
            <Link href="/admin/login" className="ml-2 text-white/50 hover:text-white transition group flex items-center gap-1">
              <FaLock className="w-3 h-3 group-hover:scale-110 transition-transform" /> Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
