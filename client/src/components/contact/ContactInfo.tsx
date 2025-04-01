import { motion } from "framer-motion";
import { schoolInfo } from "@/lib/utils";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

// Contact info items
const contactInfoItems = [
  {
    icon: <FaMapMarkerAlt className="text-2xl" />,
    title: "Our Location",
    content: schoolInfo.address.split(", ").map((line, i) => (
      <span key={i} className="block">{line}</span>
    )),
  },
  {
    icon: <FaPhoneAlt className="text-2xl" />,
    title: "Call Us",
    content: (
      <>
        <span className="block">Main Office: <a href={`tel:${schoolInfo.phone}`} className="hover:text-primary transition">{schoolInfo.phone}</a></span>
        <span className="block">Admissions: <a href={`tel:${schoolInfo.admissionsPhone}`} className="hover:text-primary transition">{schoolInfo.admissionsPhone}</a></span>
        <span className="block">Principal's Office: <a href={`tel:${schoolInfo.principalPhone}`} className="hover:text-primary transition">{schoolInfo.principalPhone}</a></span>
      </>
    ),
  },
  {
    icon: <FaEnvelope className="text-2xl" />,
    title: "Email Us",
    content: (
      <>
        <span className="block">General Inquiries: <a href={`mailto:${schoolInfo.email}`} className="hover:text-primary transition">{schoolInfo.email}</a></span>
        <span className="block">Admissions: <a href={`mailto:${schoolInfo.admissionsEmail}`} className="hover:text-primary transition">{schoolInfo.admissionsEmail}</a></span>
        <span className="block">Principal: <a href={`mailto:${schoolInfo.principalEmail}`} className="hover:text-primary transition">{schoolInfo.principalEmail}</a></span>
      </>
    ),
  },
  {
    icon: <FaClock className="text-2xl" />,
    title: "School Hours",
    content: (
      <>
        <span className="block">Monday - Saturday</span>
        <span className="block">Pre-primary: 9:00 AM - 12:30 PM</span>
        <span className="block">Primary: 8:00 AM - 2:30 PM</span>
        <span className="block">Secondary: 8:00 AM - 3:30 PM</span>
      </>
    ),
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function ContactInfo() {
  return (
    <div className="h-full">
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {contactInfoItems.map((item, index) => (
          <motion.div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-md"
            variants={itemVariants}
          >
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-white mr-4 flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold mb-2">{item.title}</h3>
                <p>{item.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
        
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          variants={itemVariants}
        >
          <h3 className="text-xl font-heading font-bold mb-3">Connect With Us</h3>
          <p className="mb-4">Follow us on social media to stay updated with school activities and announcements.</p>
          <div className="flex space-x-4">
            <a href={schoolInfo.socialMedia.facebook} className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white hover:bg-primary transition" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href={schoolInfo.socialMedia.twitter} className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white hover:bg-primary transition" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href={schoolInfo.socialMedia.instagram} className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white hover:bg-primary transition" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href={schoolInfo.socialMedia.youtube} className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white hover:bg-primary transition" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
