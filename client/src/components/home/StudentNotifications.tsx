import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function StudentNotifications() {
  const { data: remoteNotifications } = useQuery<any[]>({
    queryKey: ["/api/student-notifications"],
    refetchInterval: 5000, // Refresh every 5 seconds for better responsiveness during testing
  });

  const activeRemote = remoteNotifications?.filter(n => n.isActive).map(n => n.content) || [];
  
  // Only show the bar if we have actual data from the DB
  if (activeRemote.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-[#003366] to-[#004d99] text-white overflow-hidden py-3 shadow-lg relative flex items-center z-10 h-12 border-y border-white/5">
      <div className="absolute left-0 top-0 bottom-0 bg-[#FFB74D] px-4 md:px-8 flex items-center justify-center font-black z-20 shadow-[10px_0_20px_rgba(0,0,0,0.4)] uppercase tracking-tighter text-xs md:text-sm text-[#002244]">
        <span className="flex items-center gap-2">
          <span className="animate-bounce">🔥</span> 
          <span className="hidden md:inline">Student Updates</span>
          <span className="md:hidden">Updates</span>
        </span>
        <div className="absolute -right-3 top-0 bottom-0 w-3 bg-[#FFB74D] transform skew-x-12 origin-bottom"></div>
      </div>
      
      <div className="flex-1 overflow-hidden ml-32 md:ml-52">
        <div className="animate-marquee-infinite flex items-center">
          {/* Multiply by 10 to ensure even a single word loops without gaps on wide screens */}
          {Array.from({ length: 10 }).flatMap(() => activeRemote).map((note, index) => (
             <div key={index} className="flex items-center text-sm md:text-base font-bold px-10 hover:text-[#FFD54F] transition-colors cursor-pointer whitespace-nowrap">
               <span className="w-2.5 h-2.5 rounded-full bg-[#FFD54F] mr-4 animate-pulse shadow-[0_0_15px_rgba(255,213,79,1)]"></span>
               {note}
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
