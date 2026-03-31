import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { X } from "lucide-react";

export default function GlobalPopup() {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch the active popups
  const { data: popups } = useQuery<any[]>({
    queryKey: ["/api/popups"],
  });

  useEffect(() => {
    // Show popup if there's an active one and user hasn't seen it recently
    const hasSeenPopup = sessionStorage.getItem("seen_global_popup");
    
    if (popups && popups.length > 0 && popups[0].isActive && !hasSeenPopup) {
      // Delay showing the popup for a better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [popups]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("seen_global_popup", "true");
  };

  if (!popups || popups.length === 0 || !popups[0].isActive) return null;

  const popup = popups[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-2 border-primary bg-white/95 backdrop-blur">
        <div className="absolute top-2 right-2 z-50">
           <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/50 text-slate-800">
             <X className="w-4 h-4" />
           </Button>
        </div>
        
        <div className="pt-8 pb-10 px-6 sm:px-10 flex flex-col items-center text-center">
          <div className="mb-4 bg-primary/10 rounded-full p-4">
             <span className="text-4xl text-primary">📣</span>
          </div>
          <h2 className="text-2xl font-bold font-heading text-primary mb-3 leading-tight">
            {popup.title}
          </h2>
          <p className="text-slate-600 mb-8 font-medium">
            {popup.imageUrl} {/* Mapping we used: imageUrl holds content */}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link href={popup.linkUrl || "#"} className="flex-1">
              <Button onClick={handleClose} className="w-full bg-accent hover:bg-accent-dark font-bold text-base h-11">
                View Details
              </Button>
            </Link>
            <Button variant="outline" onClick={handleClose} className="flex-1 font-bold h-11 border-slate-300 text-slate-600 hover:bg-slate-50">
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
