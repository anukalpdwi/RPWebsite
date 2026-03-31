import { motion } from "framer-motion";

export default function StudentNotifications() {
  const notifications = [
    "Final Exams Schedule Released - Check Student Portal",
    "Winter Break Commences from Dec 24th to Jan 2nd",
    "Fee Submission Deadline for Q3 is approaching",
    "Annual Sports Day Selections happening this Friday",
    "Science Fair Registration Open for Grades 8-12",
    "Parent-Teacher Meeting for Grades 1-5 on Saturday"
  ];

  return (
    <div className="bg-gradient-to-r from-primary-dark to-primary text-white overflow-hidden py-3 shadow-md relative flex items-center z-10">
      <div className="absolute left-0 top-0 bottom-0 bg-accent px-4 md:px-8 flex items-center justify-center font-bold z-20 shadow-[4px_0_10px_rgba(0,0,0,0.2)] uppercase tracking-wider text-sm whitespace-nowrap">
        <span className="hidden md:inline">🔥 Student Updates</span>
        <span className="md:hidden">🔥 Updates</span>
        <div className="absolute -right-3 top-0 bottom-0 w-3 bg-accent transform skew-x-12 origin-bottom shadow-[4px_0_10px_rgba(0,0,0,0.2)]"></div>
      </div>
      <div className="w-full flex ml-32 md:ml-56 overflow-hidden relative">
        <motion.div
          animate={{ x: [0, -3000] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 35,
          }}
          className="flex whitespace-nowrap items-center hover:[animation-play-state:paused]"
        >
          {[...notifications, ...notifications, ...notifications].map((note, index) => (
             <div key={index} className="flex items-center text-sm md:text-base font-medium px-8 hover:text-accent-light transition-colors cursor-pointer leading-none">
               <span className="w-2 h-2 rounded-full bg-accent-light mr-3 animate-pulse shadow-[0_0_8px_rgba(255,183,77,0.8)]"></span>
               {note}
             </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
