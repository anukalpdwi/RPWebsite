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
  Printer, Send, User, Users, GraduationCap, MapPin, 
  ChevronRight, ChevronLeft, CheckCircle2, Edit3, HeartPulse,
  Mail, Phone, Calendar, School
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { schoolInfo } from "@/lib/utils";

type FormStep = "student" | "parents" | "academic" | "review" | "success";

export default function FullAdmissionForm() {
  const { toast } = useToast();
  const [step, setStep] = useState<FormStep>("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  
  const form = useForm({
    resolver: zodResolver(insertAdmissionInquirySchema),
    mode: "onBlur",
    defaultValues: {
      parentName: "",
      email: "",
      phone: "",
      childName: "",
      grade: "",
      dob: "",
      gender: "",
      address: "",
      fatherName: "",
      motherName: "",
      fatherOccupation: "",
      motherOccupation: "",
      previousSchool: "",
      bloodGroup: "",
      academicYear: "2026-2027",
      mobileNo: "",
      emailId: "",
      message: ""
    },
  });

  const nextStep = async (currentFields: string[]) => {
    const isValid = await form.trigger(currentFields as any);
    if (isValid) {
      if (step === "student") setStep("parents");
      else if (step === "parents") setStep("academic");
      else if (step === "academic") setStep("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast({
        variant: "destructive",
        title: "Incomplete Details",
        description: "Please fill all required fields correctly before proceeding.",
      });
    }
  };

  const prevStep = () => {
    if (step === "parents") setStep("student");
    else if (step === "academic") setStep("parents");
    else if (step === "review") setStep("academic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function onSubmit(data: any) {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/admission-inquiry", data);
      setStep("success");
      window.scrollTo({ top: 0, behavior: "instant" });
      toast({
        title: "Application Submitted!",
        description: "We have received your admission inquiry. A copy has been sent to our desk.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "There was a problem submitting your form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  const renderProgress = () => {
    const steps: { key: FormStep; label: string; icon: any }[] = [
      { key: "student", label: "Student", icon: User },
      { key: "parents", label: "Family", icon: Users },
      { key: "academic", label: "Academic", icon: GraduationCap },
      { key: "review", label: "Review", icon: Edit3 },
    ];

    return (
      <div className="flex justify-between items-center mb-12 px-2 max-w-2xl mx-auto print:hidden">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.key;
          const isCompleted = steps.findIndex(x => x.key === step) > i;
          
          return (
            <div key={s.key} className="flex flex-col items-center relative flex-1">
              <div 
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${
                  isActive ? "bg-primary text-white scale-110 shadow-lg ring-4 ring-primary/20" : 
                  isCompleted ? "bg-green-500 text-white" : "bg-neutral-light text-neutral-dark"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] md:text-xs mt-2 font-bold uppercase tracking-wider ${isActive ? "text-primary" : "text-neutral-dark opacity-60"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className="absolute top-5 md:top-6 left-1/2 w-full h-[2px] bg-neutral-light -z-0 pointer-events-none">
                  <motion.div 
                    initial={false}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    className="h-full bg-green-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10">
      {/* Premium Print-only Header */}
      {/* Premium Print-only Document (Ultimate Single Page Design) */}
      <div ref={printRef} className="hidden print:block font-sans text-neutral-dark max-w-[850px] mx-auto p-0 border-4 border-double border-neutral-light bg-white relative overflow-hidden">
        
        {/* Subtle Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
          <img src="/Images/logo/favicon.jpg" alt="Watermark" className="w-[500px] h-[500px] object-contain grayscale" />
        </div>

        <div className="relative z-10">
          {/* Print Header: Ultra-Premium Blue Block */}
          <div className="bg-[#0f172a] text-white p-6 flex items-start justify-between relative">
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
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
               <div className="w-20 h-24 border border-white/20 bg-white/5 flex items-center justify-center text-[7px] font-bold text-white/30 uppercase text-center px-2 leading-tight">
                 PASSPORT SIZE PHOTO
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
                <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone tracking-tight">Contact Number</span>
                <p className="text-sm font-bold text-neutral-dark leading-tight mt-0.5">
                  {form.getValues("phone")}
                </p>
              </div>
              <div className="border-b border-neutral-light pb-1">
                <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone tracking-tight">Applying for Grade</span>
                <p className="text-sm font-black text-neutral-dark uppercase leading-tight mt-0.5">
                  GRADE {form.getValues("grade")}
                </p>
              </div>
              <div className="border-b border-neutral-light pb-1">
                <span className="text-[9px] font-black uppercase text-neutral-dark/50 tracking-widestone tracking-tight">Previous School</span>
                <p className="text-xs font-bold text-neutral-dark leading-tight mt-0.5">
                  {form.getValues("previousSchool") || "Primary Level"}
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
            className="max-w-2xl mx-auto py-20 text-center"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">Application Successful!</h2>
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

                   <FormField
                    control={form.control}
                    name="previousSchool"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold flex items-center gap-2">
                          <School className="w-4 h-4 text-primary" /> Previous School (if any)
                        </FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl bg-white" placeholder="Full name of last school" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="button" 
                    onClick={() => nextStep(["childName", "dob", "gender"])}
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
                    name="parentName"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel className="font-bold">Primary Guardian Name*</FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl bg-white" placeholder="Full name of Father/Mother/Guardian" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-500" /> Professional Email*
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
                    onClick={() => nextStep(["parentName", "email", "phone", "fatherName", "motherName"])}
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
                              <SelectItem key={i} value={String(i + 1)}>Grade {i + 1}</SelectItem>
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
                    <div className="space-y-3 md:space-y-4">
                      <h4 className="text-base md:text-lg font-black uppercase text-neutral-dark border-l-4 border-primary pl-3 flex items-center gap-2">
                        <User className="w-4 h-4 md:w-5 md:h-5" /> Student Identity
                      </h4>
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
                          <p className="font-bold text-base md:text-lg capitalize">{form.getValues("grade")}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-neutral-dark/60 uppercase">Academic Session</p>
                          <p className="font-bold text-base md:text-lg">{form.getValues("academicYear")}</p>
                        </div>
                        <div className="col-span-full">
                          <p className="text-[10px] font-bold text-neutral-dark/60 uppercase">Previous School</p>
                          <p className="font-bold text-sm md:text-base">{form.getValues("previousSchool") || "Primary Admission"}</p>
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
                          <span className="text-neutral-dark/70 font-bold">Guardian Name</span>
                          <span className="font-black text-primary">{form.getValues("parentName")}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-neutral-light shadow-sm">
                          <span className="text-neutral-dark/70 font-bold">Contact Phone</span>
                          <span className="font-black text-primary">{form.getValues("phone")}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-neutral-light shadow-sm">
                          <span className="text-neutral-dark/70 font-bold">Email Id</span>
                          <span className="font-black text-primary">{form.getValues("email")}</span>
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
            <p className="mt-1">© 2026-27 Secure Admission Portal. All rights reserved.</p>
          </div>
        </>
        )}
      </div>
    </div>
  );
}

