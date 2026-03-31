import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, GraduationCap, ArrowRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function AdmissionPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const { data: popups } = useQuery<any[]>({
    queryKey: ["/api/popups"]
  });

  useEffect(() => {
    // Show popup on every reload after a short delay if active and scheduled
    const timer = setTimeout(() => {
      if (popups && popups.length > 0) {
        const popup = popups[0];
        if (!popup.isActive) return;

        // Check Scheduler Dates
        const now = new Date().getTime();
        const start = popup.startDate ? new Date(popup.startDate).getTime() : 0;
        const end = popup.endDate ? new Date(popup.endDate).getTime() : Infinity;

        if (now >= start && now <= end) {
          setIsOpen(true);
        }
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [popups]);

  const handleApply = () => {
    setIsOpen(false);
    setLocation("/apply-now");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 max-h-[95vh] flex flex-col"
          >
            {/* Premium Header/Background */}
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-br from-primary via-primary-dark to-primary-light shrink-0">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative pt-6 pb-6 px-6 text-center overflow-y-auto custom-scrollbar">
              {/* Floating Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg mb-4 relative z-10 border-4 border-primary/10 mt-2">
                <GraduationCap className="w-8 h-8 text-primary animate-bounce" />
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase tracking-widest border border-yellow-200">
                  <Sparkles className="w-3 h-3" /> Session 2026 - 2027
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tighter leading-tight">
                    {popups?.[0]?.title || "ADMISSIONS OPEN!"} <br />
                  </h2>
                  <div className="h-1 w-12 bg-yellow-500 mx-auto rounded-full" />
                </div>

                <div className="space-y-2 pt-1 px-2">
                  <p className="text-sm md:text-lg font-bold text-neutral-dark italic leading-tight">
                    "Nurturing Excellence, Building Character"
                  </p>
                  <p className="text-neutral-mid text-xs md:text-sm font-medium leading-relaxed">
                    {popups?.[0]?.imageUrl || "Join Central India's leading ISO Certified school. Give your child the foundation they deserve."}
                  </p>
                </div>

                <div className="pt-4 space-y-3">
                  <Button 
                    onClick={handleApply}
                    className="w-full h-14 md:h-16 rounded-xl bg-primary hover:bg-primary-dark text-white font-black md:text-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group"
                  >
                    APPLY NOW | अभी आवेदन करें
                    <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-mid hover:text-primary font-bold text-xs tracking-widest uppercase transition-colors"
                  >
                    Close | अब नहीं
                  </button>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none opacity-10">
                <Bell className="w-full h-full text-primary rotate-12" />
              </div>
            </div>

            {/* Close Icon Top Right */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
