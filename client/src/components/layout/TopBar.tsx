import { schoolInfo } from "@/lib/utils";
import { FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="bg-primary text-white py-2 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0 flex items-center text-sm">
          <a 
            href={`tel:${schoolInfo.phone}`} 
            className="flex items-center mr-4 hover:text-accent-light transition"
          >
            <FaPhone className="mr-1" /> {schoolInfo.phone}
          </a>
          <a 
            href={`mailto:${schoolInfo.email}`} 
            className="flex items-center hover:text-accent-light transition"
          >
            <FaEnvelope className="mr-1" /> {schoolInfo.email}
          </a>
        </div>
        <div className="flex items-center">
          <div className="mr-4 text-sm">
            <span className="font-medium">School Hours:</span> {schoolInfo.hours}
          </div>
          <div className="flex">
            <a href={schoolInfo.socialMedia.facebook} className="mx-1 hover:text-accent-light transition" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href={schoolInfo.socialMedia.twitter} className="mx-1 hover:text-accent-light transition" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href={schoolInfo.socialMedia.instagram} className="mx-1 hover:text-accent-light transition" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href={schoolInfo.socialMedia.youtube} className="mx-1 hover:text-accent-light transition" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
