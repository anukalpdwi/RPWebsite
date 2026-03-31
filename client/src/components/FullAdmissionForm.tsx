import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAdmissionInquirySchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Camera, Upload, Printer, Send, User, Users, GraduationCap, MapPin, 
  ChevronRight, ChevronLeft, CheckCircle2, Edit3, HeartPulse,
  Mail, Phone, Calendar, School, X, RotateCcw, Video, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { schoolInfo } from "@/lib/utils";

import { z } from "zod";

type FormStep = "student" | "parents" | "academic" | "review" | "success";
type InsertAdmissionInquiry = z.infer<typeof insertAdmissionInquirySchema>;

export default function FullAdmissionForm() {
  const { toast } = useToast();
  const [step, setStep] = useState<FormStep>("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [admissionNo, setAdmissionNo] = useState<number | null>(null);
  
  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const form = useForm({
    resolver: zodResolver(insertAdmissionInquirySchema),
    mode: "onBlur",
    defaultValues: {
      childName: "",
      grade: "",
      dob: "",
      gender: "",
      address: "",
      fatherName: "",
      motherName: "",
      fatherOccupation: "",
      motherOccupation: "",
      bloodGroup: "",
      academicYear: "2026-2027",
      email: "",
      phone: "",
      alternatePhone: "",
      studentPhoto: "",
      message: ""
    },
  });

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const startCamera = async () => {
    // Stop any existing stream first
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode, width: { ideal: 480 }, height: { ideal: 600 } } 
      });
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera access error (trying fallback):", err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(fallbackStream);
        setIsCameraOpen(true);
      } catch (fallbackErr) {
        toast({
          title: "Camera Error",
          description: "Could not access camera. Please check permissions or upload from gallery.",
          variant: "destructive"
        });
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    }
  }, [facingMode]);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [isCameraOpen, cameraStream]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        form.setValue("studentPhoto", dataUrl);
        stopCamera();
        toast({
          title: "Photo Captured",
          description: "Student photo has been saved to the form.",
        });
      }
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("studentPhoto", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (step === "success") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const nextStep = async (currentFields: string[]) => {
    const isValid = await form.trigger(currentFields as any);
    if (isValid) {
      if (step === "student") setStep("parents");
      else if (step === "parents") setStep("academic");
      else if (step === "academic") setStep("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast({
        title: "Information Required",
        description: "Please fill all mandatory fields to proceed.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    if (step === "parents") setStep("student");
    else if (step === "academic") setStep("parents");
    else if (step === "review") setStep("academic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generatePDF = async (): Promise<string> => {
    const element = printRef.current;
    if (!element) return "";
    
    try {
      // Temporarily show the element
      element.classList.remove('hidden');
      element.classList.add('block');
      
      // Give mobile browsers time to repaint
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const canvas = await html2canvas(element, {
        scale: 2.2, // Balanced for mobile memory and quality
        useCORS: true,
        logging: false,
        windowWidth: 1200,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('.print-container') as HTMLElement;
          if (el) {
            el.style.display = 'block';
            el.style.visibility = 'visible';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.75); 
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const ratio = imgProps.height / imgProps.width;
      const canvasHeight = pdfWidth * ratio;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, canvasHeight);
      
      // Re-hide the element
      element.classList.remove('block');
      element.classList.add('hidden');
      
      return pdf.output('datauristring');
    } catch (error) {
      console.error("PDF generation failed:", error);
      // Ensure element is hidden even on error
      element.classList.remove('block');
      element.classList.add('hidden');
      return "";
    }
  };

  const onSubmit = async (data: InsertAdmissionInquiry) => {
    setIsSubmitting(true);
    try {
      // 1. Submit form data first to get the ID and Admission Number
      // This ensures we have a real admission number before generating the PDF
      const res = await apiRequest("POST", "/api/admission", data);
      const resData = await res.json();
      
      if (resData.data && resData.data.id) {
        const newId = resData.data.id;
        const newAdm = resData.data.admissionNumber;
        
        // Update state so the hidden print template renders the real number
        setAdmissionNo(newAdm);
        
        // Brief pause to allow React to update the DOM in the hidden print containers
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 2. Generate the FINAL PDF which now includes the correct Admission Number
        const finalPdfBase64 = await generatePDF();
        
        // 3. Finalize the submission: Update storage with the PDF and trigger the email
        await apiRequest("POST", "/api/admission-finalize", { 
          id: newId, 
          pdfBase64: finalPdfBase64 
        });

        toast({
          title: "Registration Complete!",
          description: `Form submitted successfully with Admission No: ${newAdm}`,
        });
        
        window.scrollTo({ top: 0, behavior: "smooth" });
        setStep("success");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "An error occurred while finalizing your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = async () => {
    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your official form...",
    });
    
    const pdfDataUri = await generatePDF();
    if (pdfDataUri) {
      const link = document.createElement('a');
      link.href = pdfDataUri;
      link.download = `RP_Admission_Form_${admissionNo || 'Application'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print(); // Fallback to window.print if jsPDF fails
    }
  };

  const renderProgress = () => {
    const steps = [
      { id: "student", label: "Student", icon: User },
      { id: "parents", label: "Family", icon: Users },
      { id: "academic", label: "Academic", icon: GraduationCap },
      { id: "review", label: "Review", icon: Edit3 }
    ];

    return (
      <div className="flex justify-between items-center mb-12 max-w-4xl mx-auto px-4 relative overflow-hidden h-20 md:h-24">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-light -translate-y-1/2 z-0 hidden md:block" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500 hidden md:block"
          style={{ 
            width: `${(steps.findIndex(s => s.id === step) / (steps.length - 1)) * 100}%` 
          }}
        />

        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isCompleted = steps.findIndex(st => st.id === step) > idx;

          return (
            <div key={s.id} className="z-10 flex flex-col items-center group">
              <div 
                className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 border-4 shadow-xl ${
                  isActive ? "bg-primary border-primary-light scale-110" : 
                  isCompleted ? "bg-green-500 border-green-200" : "bg-white border-neutral-light"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-white" /> : 
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? "text-white" : "text-neutral-light group-hover:text-primary transition-colors"}`} />}
              </div>
              <span className={`text-[10px] md:text-xs font-black uppercase mt-3 tracking-widest ${isActive ? "text-primary" : "text-neutral-light"}`}>{s.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 px-4 md:py-12 md:px-8">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
          .print-container {
            width: 210mm !important;
            min-height: 297mm !important;
            height: auto !important;
            margin: 0 auto !important;
            padding: 0 !important;
            border: none !important;
            position: absolute !important;
            top: 0 !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            overflow: visible !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />
      <div className="max-w-6xl mx-auto mb-8 flex justify-end print:hidden">
        <Button onClick={handlePrint} variant="outline" className="border-2 border-primary text-primary hover:bg-primary/5 font-bold">
           <Printer className="mr-2 w-5 h-5" /> Print Blank Form
        </Button>
      </div>

      {/* Print View Layout */}
      <div ref={printRef} className="hidden print:block print-container font-sans text-slate-900 max-w-[850px] mx-auto p-0 border-[12px] border-double border-slate-200 bg-white !important relative overflow-hidden">
        
        {/* Decorative Corner Ornaments */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-slate-300 pointer-events-none z-20 m-4" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-slate-300 pointer-events-none z-20 m-4" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-slate-300 pointer-events-none z-20 m-4" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-slate-300 pointer-events-none z-20 m-4" />

        {/* Subtle Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none z-0">
          <img src="/Images/logo/favicon.jpg" alt="Watermark" className="w-[550px] h-[550px] object-contain grayscale" />
        </div>

        <div className="relative z-10">
          {/* Print Header: Ultra-Premium Clean Layout */}
          <div className="bg-white !important text-slate-900 !important p-10 flex items-start justify-between relative border-b-4 border-slate-900">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500" />
            
            <div className="flex items-center gap-8">
              <div className="bg-white p-1 border-2 border-slate-200 shadow-sm rounded-sm">
                 <img src="/Images/logo/favicon.jpg" alt="Logo" className="w-20 h-20 object-contain" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight leading-none uppercase text-slate-900 mb-1">{schoolInfo.name}</h1>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-[2px] w-8 bg-amber-500" />
                  <p className="text-[12px] font-extrabold text-amber-600 uppercase tracking-[0.2em] leading-none">Nurturing Excellence, Building Character</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase leading-none flex items-center gap-1">
                    <MapPin className="w-2 h-2" /> Jaisinghnagar, Shahdol, Madhya Pradesh - 484771
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase leading-none flex items-center gap-3">
                    <span className="flex items-center gap-1"><Phone className="w-2 h-2" /> +91 9893767392</span>
                    <span className="flex items-center gap-1"><Mail className="w-2 h-2" /> rppublicschool2021@gmail.com</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-3">
               <div className="w-24 h-28 border-2 border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner relative">
                 <div className="absolute inset-0 border border-slate-100 m-1" />
                 {form.getValues("studentPhoto") ? (
                   <img src={form.getValues("studentPhoto")} alt="Student" className="w-full h-full object-cover" />
                 ) : (
                   <div className="flex flex-col items-center gap-1 opacity-20">
                     <User className="w-8 h-8" />
                     <span className="text-[6px] font-black uppercase text-center leading-tight">AFFIX PHOTO HERE</span>
                   </div>
                 )}
               </div>
               <div className="mt-auto">
                 <div className="bg-slate-900 px-4 py-2 text-white">
                   <h2 className="text-xs font-black tracking-[0.3em] uppercase leading-none mb-1">Official Admission Form</h2>
                   <p className="text-[14px] font-black text-amber-400 tracking-tighter leading-none">NO: {admissionNo || "APP-2026/XXXX"}</p>
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest text-right">SESSION: 2026 - 2027</p>
               </div>
            </div>
          </div>

          {/* Print Body: Structured Data */}
          <div className="p-10 space-y-8">
            
            {/* Section 1: Student Identity */}
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-amber-500/30" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-900 rounded-full" /> Personal Identification
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="border-b border-slate-200 pb-2 relative">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Candidate's Full Name (In Block Letters)</span>
                  <p className="text-xl font-black text-slate-900 uppercase leading-none mt-1">
                    {form.getValues("childName") || "................................................................................"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Date of Birth</span>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {form.getValues("dob") || "DD / MM / YYYY"}
                    </p>
                  </div>
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Blood Group</span>
                    <p className="text-sm font-bold text-slate-900 uppercase mt-1">
                      {form.getValues("bloodGroup") || "...................."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Gender Identity</span>
                    <div className="flex gap-8 mt-2 text-[10px] font-black text-slate-900">
                       <label className="flex items-center gap-2 cursor-default">
                         <div className={`w-4 h-4 border-2 border-slate-900 flex items-center justify-center ${form.getValues("gender") === 'male' ? 'bg-slate-900 text-white' : ''}`}>
                           {form.getValues("gender") === 'male' && <CheckCircle2 className="w-3 h-3" />}
                         </div>
                         MALE
                       </label>
                       <label className="flex items-center gap-2 cursor-default">
                         <div className={`w-4 h-4 border-2 border-slate-900 flex items-center justify-center ${form.getValues("gender") === 'female' ? 'bg-slate-900 text-white' : ''}`}>
                           {form.getValues("gender") === 'female' && <CheckCircle2 className="w-3 h-3" />}
                         </div>
                         FEMALE
                       </label>
                    </div>
                  </div>
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Applying for Academic Class</span>
                    <p className="text-sm font-black text-slate-900 uppercase mt-1">
                      {form.getValues("grade") 
                        ? (form.getValues("grade") === "nursery" || form.getValues("grade") === "kg" 
                           ? form.getValues("grade").toUpperCase() 
                           : `CLASS - ${form.getValues("grade")}`)
                        : "...................."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Parentage & Contact */}
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-amber-500/30" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-900 rounded-full" /> Guardian & Contact Information
              </h3>

              <div className="grid grid-cols-2 gap-10">
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Father / Guardian's Name</span>
                  <p className="text-sm font-bold text-slate-900 uppercase mt-1">
                    {form.getValues("fatherName") || "........................................................"}
                  </p>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Mother's Name</span>
                  <p className="text-sm font-bold text-slate-900 uppercase mt-1">
                    {form.getValues("motherName") || "........................................................"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10 mt-6">
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Primary Telephone</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {form.getValues("phone") || "+91 - XXXXXXXXXX"}
                  </p>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Alternate Contact</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {form.getValues("alternatePhone") || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-6 border border-slate-100 p-4 rounded bg-slate-50/50 relative">
                <span className="absolute -top-2 left-4 px-2 bg-white text-[8px] font-black uppercase text-slate-400">Communication Address</span>
                <p className="text-[11px] font-bold text-slate-700 italic leading-relaxed">
                  {form.getValues("address") || "................................................................................................................................"}, Jaisinghnagar, Shahdol, Madhya Pradesh
                </p>
              </div>
            </div>

            {/* Section 3: Legal Binding */}
            <div className="pt-4 flex justify-between items-start gap-12">
               <div className="flex-1">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-2 border-b-2 border-amber-500 inline-block">Institutional Declaration</h3>
                 <p className="text-[9px] leading-relaxed text-slate-500 text-justify italic">
                   I, the undersigned, hereby certify that the information provided herein is accurate to the best of my knowledge. I acknowledge that any falsification of records may result in the immediate cancellation of the candidate's admission. I agree to abide by the rules and regulations of <strong>{schoolInfo.name}</strong> as formulated from time to time.
                 </p>
               </div>

               <div className="w-28 h-28 rounded-full border-4 border-double border-slate-100 flex items-center justify-center text-center p-3 opacity-20 -rotate-12">
                  <span className="text-[7px] font-black uppercase leading-tight tracking-[0.2em] text-slate-400">OFFICIAL<br/>INSTITUTIONAL<br/>SEAL</span>
               </div>
            </div>

            {/* Section 4: Authorized Signatories */}
            <div className="pt-4 flex justify-between items-end h-24">
              <div className="text-center group">
                 <div className="w-48 border-b-2 border-slate-200 mb-2 group-hover:border-slate-900 transition-colors" />
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Parent / Guardian Signature</span>
              </div>
              <div className="text-center group">
                 <div className="w-48 border-b-2 border-slate-200 mb-2 group-hover:border-slate-900 transition-colors" />
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Admissions Registrar</span>
              </div>
            </div>

            {/* Page Traceability Footer */}
            <div className="pt-6 text-center border-t border-slate-100 mt-auto">
               <p className="text-[7px] font-black tracking-[0.8em] text-slate-300 uppercase">
                 RP PUBLIC SCHOOL • EXCELLENCE • INTEGRITY • LEADERSHIP • {new Date().getFullYear()}
               </p>
            </div>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        {step === "success" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto py-10 md:py-20 text-center min-h-[60vh] flex flex-col justify-center"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-heading font-bold text-primary mb-2">Application Successful!</h2>
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6 inline-block">
              <p className="text-xs font-black uppercase tracking-widest text-primary/60">Your Admission Number</p>
              <p className="text-3xl font-black text-primary tracking-tighter">{admissionNo || "26XXX"}</p>
            </div>
            <p className="text-lg text-neutral-dark mb-8">
              Thank you for choosing {schoolInfo.name}. Our admissions office will review the details and contact you within 2-3 working days.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handlePrint} variant="outline" className="h-11 md:h-12 px-6 md:px-8 text-sm md:text-base">
                <Printer className="mr-2 w-4 h-4 md:w-5 md:h-5" /> Download Admission Form
              </Button>
              <Button onClick={() => setStep("student")} className="h-11 md:h-12 px-6 md:px-8 bg-primary text-white text-sm md:text-base">
                New Application
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-center text-primary mb-1">Admission Portal</h2>
        <p className="text-sm md:text-base text-center text-neutral-dark mb-6 md:mb-10">Join the excellence at {schoolInfo.name}</p>
        
        {renderProgress()}
        
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <AnimatePresence mode="wait">
            {/* STEP 1: STUDENT INFORMATION */}
            {step === "student" && (
              <motion.div
                key="student"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-white/50 backdrop-blur-sm p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white shadow-xl">
                  <div className="col-span-full border-b pb-3 mb-1 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <User className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-primary">Student Information</h3>
                  </div>

                  {/* Photo Upload Section */}
                  <div className="col-span-full flex flex-col items-center justify-center p-6 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 space-y-4">
                    <div className="relative group">
                      <div className="w-32 h-32 md:w-40 md:h-48 rounded-xl bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                        {form.watch("studentPhoto") ? (
                          <img 
                            src={form.watch("studentPhoto")} 
                            alt="Student" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-16 h-16 md:w-20 md:h-20 text-neutral-light" />
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 bg-white text-primary rounded-full shadow-lg hover:scale-110 transition-transform border border-primary/20"
                          title="Upload from Gallery"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={startCamera}
                          className="p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                          title="Take Live Photo"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-bold text-primary">Student Passport Photo*</p>
                      <p className="text-[10px] text-neutral-dark/60">Capture live or upload from gallery</p>
                    </div>

                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    
                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={startCamera}
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        <Video className="mr-2 w-4 h-4" /> Live Capture
                      </Button>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white border-neutral-light text-neutral-dark hover:bg-neutral-light/10"
                      >
                        <Upload className="mr-2 w-4 h-4" /> Gallery
                      </Button>
                    </div>
                  </div>

                  {/* Camera Dialog */}
                  <Dialog open={isCameraOpen} onOpenChange={(open) => !open && stopCamera()}>
                    <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-4 bg-primary text-white">
                        <DialogTitle className="flex items-center gap-2">
                          <Camera className="w-5 h-5" /> Live Student Capture
                        </DialogTitle>
                        <DialogDescription className="text-white/80 text-xs">
                          Align face within the frame and click capture.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="relative aspect-[3/4] bg-black flex items-center justify-center">
                        <video 
                          ref={(el) => {
                            if (el) {
                               videoRef.current = el;
                               if (cameraStream) el.srcObject = cameraStream;
                            }
                          }}
                          autoPlay 
                          playsInline 
                          muted
                          className="w-full h-full object-cover grayscale-[0.2]"
                        />
                        {/* Overlay Frame */}
                        <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                           <div className="w-full h-full border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                             <div className="w-48 h-64 border-2 border-white/30 rounded-full opacity-30" />
                           </div>
                        </div>
                      </div>

                      <DialogFooter className="p-6 bg-neutral-light/10 flex justify-center items-center gap-6 sm:justify-center">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={stopCamera}
                          className="rounded-full w-12 h-12 p-0 border-neutral-light hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                        >
                          <X className="w-6 h-6" />
                        </Button>
                        
                        <Button 
                          type="button" 
                          onClick={capturePhoto}
                          className="w-20 h-20 rounded-full bg-primary hover:bg-primary-dark shadow-xl hover:scale-105 transition-all p-0 flex items-center justify-center border-4 border-white"
                        >
                          <div className="w-14 h-14 rounded-full border-2 border-white/50 flex items-center justify-center">
                            <div className="w-10 h-10 bg-white rounded-full" />
                          </div>
                        </Button>

                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={toggleCamera}
                          className="rounded-full w-12 h-12 p-0 border-neutral-light bg-white hover:bg-primary/10 hover:text-primary transition-colors"
                          title="Switch Camera"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <FormField
                    control={form.control}
                    name="childName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Full Name of Student*</FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl border-neutral-light focus:ring-primary focus:border-primary bg-white" placeholder="Enter student's legal name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Date of Birth*</FormLabel>
                          <FormControl>
                            <Input className="h-12 rounded-xl bg-white" type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Gender*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl bg-white">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold flex items-center gap-2">
                          <HeartPulse className="w-4 h-4 text-red-500" /> Blood Group
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl bg-white">
                              <SelectValue placeholder="Select Blood Group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="button" 
                    onClick={() => nextStep(["childName", "dob", "gender", "studentPhoto"])}
                    className="h-14 px-10 bg-primary hover:bg-primary-dark rounded-2xl text-lg font-bold shadow-lg transition-all hover:scale-105 text-white"
                  >
                    Next: Family Details <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: PARENT INFORMATION */}
            {step === "parents" && (
              <motion.div
                key="parents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-white/50 backdrop-blur-sm p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white shadow-xl">
                  <div className="col-span-full border-b pb-3 mb-1 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Users className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-primary">Parent & Family Details</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-500" /> Primary Contact No*
                        </FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl bg-white" placeholder="10-digit mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alternatePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-500" /> Alternate Phone No.
                        </FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl bg-white" placeholder="Additional contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel className="font-bold flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-500" /> Professional Email
                        </FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl bg-white" type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Father's Name*</FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl bg-white" placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Mother's Name*</FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl bg-white" placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-2xl border-primary text-primary hover:bg-primary/5">
                    <ChevronLeft className="mr-2 w-5 h-5" /> Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => nextStep(["phone", "fatherName", "motherName"])}
                    className="h-14 px-10 bg-primary hover:bg-primary-dark rounded-2xl text-lg font-bold shadow-lg transition-all hover:scale-105 text-white"
                  >
                    Next: Academic Info <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: ACADEMIC INFORMATION */}
            {step === "academic" && (
              <motion.div
                key="academic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-white/50 backdrop-blur-sm p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white shadow-xl">
                  <div className="col-span-full border-b pb-3 mb-1 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-primary">Academic & Location</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Grade Applying For*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl bg-white">
                              <SelectValue placeholder="Select Grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="nursery">Nursery</SelectItem>
                            <SelectItem value="kg">Kindergarten</SelectItem>
                            {[...Array(12)].map((_, i) => (
                              <SelectItem key={i} value={String(i + 1)}>Grade {i + 1} (Class {i + 1})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" /> Academic Year*
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl bg-white">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="2026-2027">2026-2027</SelectItem>
                            <SelectItem value="2027-2028">2027-2028</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel className="font-bold flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" /> Residential Address*
                        </FormLabel>
                        <FormControl>
                          <Textarea className="rounded-2xl resize-none bg-white" placeholder="Provide complete permanent address" {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                   <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel className="font-bold">Medical Notes / Special Requirements</FormLabel>
                        <FormControl>
                          <Textarea className="rounded-2xl resize-none bg-white" placeholder="Any allergies, conditions, or special requests" {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-8 rounded-2xl border-primary text-primary hover:bg-primary/5">
                    <ChevronLeft className="mr-2 w-5 h-5" /> Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => nextStep(["grade", "academicYear", "address"])}
                    className="h-14 px-10 bg-primary hover:bg-primary-dark rounded-2xl text-lg font-bold shadow-lg transition-all hover:scale-105 text-white"
                  >
                    Review Application <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: REVIEW PAGE */}
            {step === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="bg-primary/5 border-2 border-primary/20 p-5 md:p-8 rounded-2xl md:rounded-3xl space-y-6 md:space-y-8 print:p-0 print:border-none print:bg-transparent">
                  <h3 className="text-xl md:text-3xl font-bold text-primary flex items-center gap-3 mb-4 md:mb-6 print:hidden">
                    <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" /> Review Your Application
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6 md:gap-y-10">
                    {/* Student Records Summary */}
                    <div className="space-y-4">
                      <h4 className="text-base md:text-lg font-black uppercase text-neutral-dark border-l-4 border-primary pl-3 flex items-center gap-2">
                        <User className="w-4 h-4 md:w-5 md:h-5" /> Student Identity
                      </h4>
                      
                      {form.getValues("studentPhoto") && (
                        <div className="ml-4 w-24 h-32 md:w-32 md:h-40 rounded-lg overflow-hidden border-2 border-primary/20 shadow-md">
                          <img src={form.getValues("studentPhoto")} alt="Student Preview" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 md:gap-4 ml-4">
                        <div>
                          <p className="text-[10px] font-bold text-neutral-dark/60 uppercase">Full Name</p>
                          <p className="font-bold text-base md:text-lg">{form.getValues("childName")}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-neutral-dark/60 uppercase">Date of Birth</p>
                          <p className="font-bold text-base md:text-lg">{form.getValues("dob")}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-neutral-dark/60 uppercase">Gender</p>
                          <p className="font-bold text-base md:text-lg capitalize">{form.getValues("gender")}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-neutral-dark/60 uppercase">Blood Group</p>
                          <p className="font-bold text-base md:text-lg">{form.getValues("bloodGroup") || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Academic Summary */}
                    <div className="space-y-3 md:space-y-4">
                      <h4 className="text-base md:text-lg font-black uppercase text-neutral-dark border-l-4 border-blue-500 pl-3 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 md:w-5 md:h-5" /> Grade & Level
                      </h4>
                      <div className="grid grid-cols-2 gap-3 md:gap-4 ml-4">
                        <div>
                          <p className="text-[10px] font-bold text-neutral-dark/60 uppercase">Applying for Grade</p>
                          <p className="font-bold text-base md:text-lg capitalize">
                            {(form.getValues("grade") === "nursery" || form.getValues("grade") === "kg")
                              ? form.getValues("grade")
                              : `Class ${form.getValues("grade")}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-neutral-dark/60 uppercase">Academic Session</p>
                          <p className="font-bold text-base md:text-lg">{form.getValues("academicYear")}</p>
                        </div>
                      </div>
                    </div>

                    {/* Family Contact Summary */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-black uppercase text-neutral-dark border-l-4 border-green-500 pl-3 flex items-center gap-2">
                        <Users className="w-5 h-5" /> Family & Contact
                      </h4>
                      <div className="grid grid-cols-1 gap-4 ml-4">
                        <div className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-neutral-light shadow-sm">
                          <span className="text-neutral-dark/70 font-bold">Primary Phone</span>
                          <span className="font-black text-primary">{form.getValues("phone")}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-neutral-light shadow-sm">
                          <span className="text-neutral-dark/70 font-bold">Alternate Phone</span>
                          <span className="font-black text-primary">{form.getValues("alternatePhone") || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-neutral-light shadow-sm">
                          <span className="text-neutral-dark/70 font-bold">Email Id</span>
                          <span className="font-black text-primary">{form.getValues("email") || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-neutral-light shadow-sm">
                          <span className="text-neutral-dark/70 font-bold">Father's Name</span>
                          <span className="font-black text-primary">{form.getValues("fatherName")}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-neutral-light shadow-sm">
                          <span className="text-neutral-dark/70 font-bold">Mother's Name</span>
                          <span className="font-black text-primary">{form.getValues("motherName")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Address Summary */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-black uppercase text-neutral-dark border-l-4 border-orange-500 pl-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5" /> Residency
                      </h4>
                      <div className="ml-4 p-4 bg-white rounded-xl border border-neutral-light shadow-sm">
                        <p className="text-xs font-bold text-neutral-dark/60 uppercase mb-2">Permanent Address</p>
                        <p className="text-sm leading-relaxed font-bold">{form.getValues("address")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 pt-6 md:pt-8 print:hidden">
                  <div className="flex gap-3 md:gap-4">
                    <Button type="button" variant="outline" onClick={prevStep} className="w-full sm:w-auto h-12 md:h-16 px-6 md:px-8 rounded-xl md:rounded-2xl border-2 border-primary text-primary hover:bg-primary/5 text-base md:text-lg font-bold">
                      <Edit3 className="mr-2 w-4 h-4 md:w-5 md:h-5" /> Edit Details
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto h-12 md:h-16 px-10 md:px-14 bg-green-600 hover:bg-green-700 rounded-xl md:rounded-2xl text-lg md:text-xl font-black shadow-xl transition-all hover:scale-105 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : (
                      <>Commit & Submit <Send className="ml-2 md:ml-3 w-5 h-5 md:w-6 md:h-6" /></>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </form>
      </Form>
      
      {/* Aesthetic info footer */}
      <div className="mt-8 md:mt-16 text-center text-muted-foreground text-[10px] md:text-sm print:hidden border-t pt-6 md:pt-8 border-neutral-light">
        <div className="flex justify-center gap-4 mb-4 opacity-40">
           <School className="w-5 h-5" />
           <GraduationCap className="w-5 h-5" />
           <Users className="w-5 h-5" />
        </div>
            <p className="font-bold text-neutral-dark">RP Public School is an ISO Certified Leading Institution</p>
            <p className="mt-1">© {new Date().getFullYear()}-{(new Date().getFullYear() + 1).toString().slice(-2)} Secure Admission Portal. All rights reserved.</p>
          </div>
        </>
        )}
      </div>
    </div>
  );
}

