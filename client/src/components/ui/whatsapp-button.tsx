import { FaWhatsapp } from "react-icons/fa";

interface WhatsAppButtonProps {
  phoneNumber: string;
}

export default function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  // Format the phone number to include country code (91 for India) if not already included
  const formattedPhoneNumber = phoneNumber.startsWith("+") 
    ? phoneNumber.substring(1) 
    : `91${phoneNumber}`;
    
  const whatsappUrl = `https://wa.me/${formattedPhoneNumber}`;
  
  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 bg-green-500 text-white rounded-full p-4 shadow-lg z-50 hover:bg-green-600 transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
    </a>
  );
}