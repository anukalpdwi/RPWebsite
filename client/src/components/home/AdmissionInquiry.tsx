import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { schoolInfo } from "@/lib/utils";

// Admission inquiry form schema
const inquirySchema = z.object({
  parentName: z.string().min(3, "Parent name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  studentName: z.string().min(3, "Student name is required"),
  gradeApplying: z.string().min(1, "Please select a grade"),
  academicYear: z.string().min(1, "Please select an academic year"),
  message: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export default function AdmissionInquiry() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      parentName: "",
      phoneNumber: "",
      email: "",
      studentName: "",
      gradeApplying: "",
      academicYear: "",
      message: "",
      consent: false,
    },
  });

  async function onSubmit(data: InquiryFormData) {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/admission-inquiry", data);
      toast({
        title: "Inquiry Submitted Successfully",
        description: "Our admissions team will contact you soon.",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Please try again later or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="admission-inquiry" className="py-16 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border-4 border-white"></div>
        <div className="absolute -left-40 -bottom-20 w-96 h-96 rounded-full border-4 border-white"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-8 md:mb-0 md:pr-8 text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Admission Inquiry</h2>
            <div className="h-1 w-20 bg-accent mb-6"></div>
            <p className="mb-6">Thank you for your interest in {schoolInfo.name}. We invite you to fill out the inquiry form, and our admissions team will reach out to you with further information.</p>
            
            <div className="mb-6">
              <h3 className="text-xl font-heading font-bold mb-3">Admission Process</h3>
              <ol className="space-y-2">
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white mr-3 flex-shrink-0">1</span>
                  <span>Submit an online inquiry or visit the school admission office</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white mr-3 flex-shrink-0">2</span>
                  <span>Complete the application form with necessary documents</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white mr-3 flex-shrink-0">3</span>
                  <span>Schedule an entrance assessment and student interview</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white mr-3 flex-shrink-0">4</span>
                  <span>Receive admission decision and complete enrollment process</span>
                </li>
              </ol>
            </div>
            
            <Link 
              href="/admissions" 
              className="inline-block px-6 py-3 bg-white text-primary font-medium rounded-md shadow-md hover:bg-neutral-light transition"
            >
              Learn More About Admissions
            </Link>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-heading font-bold text-primary mb-4">Inquiry Form</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="parentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent/Guardian Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
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
                          <FormLabel>Email Address*</FormLabel>
                          <FormControl>
                            <Input placeholder="Email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Student name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gradeApplying"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Applying For*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nursery">Nursery</SelectItem>
                              <SelectItem value="kg">Kindergarten</SelectItem>
                              {[...Array(12)].map((_, i) => (
                                <SelectItem key={i} value={String(i + 1)}>
                                  Grade {i + 1}
                                </SelectItem>
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
                          <FormLabel>Academic Year*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2023-2024">2023-2024</SelectItem>
                              <SelectItem value="2024-2025">2024-2025</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any specific details you would like to share" {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to receive communications from {schoolInfo.name} and consent to the processing of my personal data.*
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
