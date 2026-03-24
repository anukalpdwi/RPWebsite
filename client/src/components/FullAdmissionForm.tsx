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
  Mail, Phone, Calendar, School, X, RotateCcw, Video
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 600 } } 
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
      // 1. Generate PDF for the application
      const pdfBase64 = await generatePDF();

      // 2. Submit data + PDF
      const payload = { ...data, pdfBase64 };
      const res = await apiRequest("POST", "/api/admission", payload);
      const resData = await res.json();
      
      if (resData.data && resData.data.admissionNumber) {
        setAdmissionNo(resData.data.admissionNumber);
      }
      
      toast({
        title: "Success!",
        description: "Application submitted successfully.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      setStep("success");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
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
      <div ref={printRef} className="hidden print:block print-container font-sans text-neutral-dark max-w-[850px] mx-auto p-0 border-4 border-double border-neutral-light bg-white !important relative overflow-hidden">
        
        {/* Subtle Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
          <img src="/Images/logo/favicon.jpg" alt="Watermark" className="w-[500px] h-[500px] object-contain grayscale" />
        </div>

        <div className="relative z-10">
          {/* Print Header: Ultra-Premium Blue Block */}
          <div className="bg-[#0f172a] !important text-white !important p-6 flex items-start justify-between relative">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/50" />
            
            <div className="flex items-center gap-6">
              <div className="bg-white p-2 rounded shadow-lg">
                 <img src="/Images/logo/favicon.jpg" alt="Logo" className="w-16 h-16 object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-none uppercase text-white shadow-sm">{schoolInfo.name}</h1>
                <p className="text-[11px] font-bold text-yellow-500 mt-1 uppercase tracking-widest leading-none">Nurturing Excellence, Building Character</p>
                <div className="mt-4 space-y-0.5">
                  <p className="text-[10px] font-medium opacity-80 uppercase leading-none">Jaisinghnagar, Shahdol, Madhya Pradesh</p>
                  <p className="text-[10px] font-medium opacity-80 uppercase leading-none">PH: +91 9893767392 • EMAIL: rppublicschool2021@gmail.com</p>
                  <div className="mt-2 inline-block px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded">
                    <p className="text-[10px] font-black tracking-widest text-yellow-500">ADMISSION NO: {admissionNo || "PENDING"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
               <div className="w-20 h-24 border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden">
                 {form.getValues("studentPhoto") ? (
                   <img src={form.getValues("studentPhoto")} alt="Student" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-[7px] font-bold text-white/30 uppercase text-center px-2 leading-tight">PASSPORT SIZE PHOTO</span>
                 )}
               </div>
               <div className="mt-auto">
                 <h2 className="text-2xl font-black tracking-tighter text-white leading-none">ADMISSION</h2>
                 <h2 className="text-sm font-black tracking-[0.4em] text-yellow-500 leading-none">FORM</h2>
                 <p className="text-[9px] font-black text-white/50 uppercase mt-2">SESSION: 2026 - 2027</p>
               </div>
            </div>
          </div>

          {/* Print Body: Structured Data */}
          <div className="p-8 space-y-6">
            
            {/* Row 1: Student Name */}
            <div className="border-b-2 border-neutral-light pb-1">
              <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone">Full Name of Student</span>
              <p className="text-lg font-black text-neutral-dark uppercase leading-tight -mt-0.5">
                {form.getValues("childName")}
              </p>
            </div>

            {/* Row 2: Parents */}
            <div className="grid grid-cols-2 gap-10">
              <div className="border-b border-neutral-light pb-1">
                <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone">Father's Full Name</span>
                <p className="text-sm font-bold text-neutral-dark uppercase leading-tight mt-0.5">
                  {form.getValues("fatherName")}
                </p>
              </div>
              <div className="border-b border-neutral-light pb-1">
                <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone">Mother's Full Name</span>
                <p className="text-sm font-bold text-neutral-dark uppercase leading-tight mt-0.5">
                  {form.getValues("motherName")}
                </p>
              </div>
            </div>

            {/* Row 3: DOB & Gender */}
            <div className="grid grid-cols-2 gap-10">
              <div className="flex gap-10">
                <div className="flex-1 border-b border-neutral-light pb-1">
                  <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone">Date of Birth</span>
                  <p className="text-sm font-bold text-neutral-dark leading-tight mt-0.5">
                    {form.getValues("dob")}
                  </p>
                </div>
                <div className="flex-1 border-b border-neutral-light pb-1">
                  <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone">Blood Group</span>
                  <p className="text-sm font-bold text-neutral-dark uppercase leading-tight mt-0.5">
                    {form.getValues("bloodGroup") || "N/A"}
                  </p>
                </div>
              </div>
              <div className="border-b border-neutral-light pb-1">
                <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone">Gender</span>
                <div className="flex gap-6 mt-1 text-[11px] font-bold text-neutral-dark items-center">
                   <div className="flex items-center gap-2">
                     <div className={`w-3 h-3 rounded-full border-2 border-neutral-dark ${form.getValues("gender") === 'male' ? 'bg-neutral-dark' : ''}`} />
                     MALE
                   </div>
                   <div className="flex items-center gap-2">
                     <div className={`w-3 h-3 rounded-full border-2 border-neutral-dark ${form.getValues("gender") === 'female' ? 'bg-neutral-dark' : ''}`} />
                     FEMALE
                   </div>
                </div>
              </div>
            </div>

            {/* Row 4: Address */}
            <div className="border border-neutral-light p-4 rounded-md bg-neutral-light/5">
              <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone">Permanent Residential Address</span>
              <p className="text-sm font-bold text-neutral-dark italic leading-relaxed mt-1">
                {form.getValues("address")}, Jaisinghnagar, Shahdol, Madhya Pradesh
              </p>
            </div>

            {/* Row 5: Contact & Academic */}
            <div className="grid grid-cols-3 gap-6">
              <div className="border-b border-neutral-light pb-1">
                <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone tracking-tight">Primary Phone</span>
                <p className="text-sm font-bold text-neutral-dark leading-tight mt-0.5">
                  {form.getValues("phone")}
                </p>
              </div>
              <div className="border-b border-neutral-light pb-1">
                <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone tracking-tight">Alternate Phone</span>
                <p className="text-sm font-bold text-neutral-dark leading-tight mt-0.5">
                  {form.getValues("alternatePhone") || "N/A"}
                </p>
              </div>
              <div className="border-b border-neutral-light pb-1">
                <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone tracking-tight">Applying for Grade</span>
                <p className="text-sm font-black text-neutral-dark uppercase leading-tight mt-0.5">
                  {(form.getValues("grade") === "nursery" || form.getValues("grade") === "kg")
                    ? form.getValues("grade").toUpperCase()
                    : `CLASS ${form.getValues("grade")}`}
                </p>
              </div>
            </div>

            {/* Declaration & Footer */}
            <div className="pt-8 flex justify-between items-start">
               {/* Declaration */}
               <div className="max-w-md">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0f172a] mb-2 border-b-2 border-[#0f172a] inline-block">Declaration</h3>
                 <p className="text-[9px] leading-relaxed text-neutral-dark/70 text-justify italic">
                   I hereby declare that all information provided for my child to <strong>{schoolInfo.name}</strong> is true and authentic. I commit to following all academic and discipline protocols of the institution.
                 </p>
               </div>

               {/* Stamp/Seal */}
               <div className="w-24 h-24 rounded-full border-4 border-double border-neutral-light/50 flex items-center justify-center text-center p-2 opacity-30 rotate-12">
                  <span className="text-[8px] font-black uppercase leading-[0.8] tracking-widest">Official<br/>School<br/>Seal</span>
               </div>
            </div>

            {/* Signature Area */}
            <div className="pt-2 flex justify-between items-end h-20 px-8">
              <div className="text-center">
                 <div className="w-40 border-b-2 border-neutral-dark/20 mb-2" />
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-dark/40">Student / Guardian Signature</span>
              </div>
              <div className="text-center">
                 <div className="w-40 border-b-2 border-neutral-dark/20 mb-2" />
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-dark/40">Admissions Authority</span>
              </div>
            </div>

            {/* Page Footer */}
            <div className="pt-8 text-center border-t border-neutral-light/30">
               <p className="text-[8px] font-black tracking-[0.5em] text-neutral-dark/30 uppercase">RP PUBLIC SCHOOL • EXCELLENCE IN EDUCATION • {new Date().getFullYear()}</p>
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
                          onClick={() => { stopCamera(); startCamera(); }}
                          className="rounded-full w-12 h-12 p-0 border-neutral-light"
                        >
                          <RotateCcw className="w-5 h-5 text-neutral-dark" />
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

