import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/ui/page-header";
import SectionTitle from "@/components/ui/section-title";
import AdmissionInquiry from "@/components/home/AdmissionInquiry";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaDownload, FaClipboardList, FaUserTie, FaFileAlt, FaCalendarCheck, FaGraduationCap } from "react-icons/fa";

// Admission process steps
const admissionSteps = [
  {
    icon: <FaClipboardList className="text-2xl" />,
    title: "Step 1: Inquiry & Application",
    description: "Submit an admission inquiry form online or visit our admissions office to obtain and submit the application form along with the required documents.",
    documents: [
      "Birth Certificate",
      "Transfer Certificate (if applicable)",
      "Previous Academic Records",
      "Passport-sized Photographs",
      "Aadhar Card"
    ]
  },
  {
    icon: <FaUserTie className="text-2xl" />,
    title: "Step 2: Entrance Assessment & Interview",
    description: "Schedule and complete an entrance assessment appropriate for the grade level. Students and parents may also be invited for an interview with school administrators.",
    details: [
      "Assessment covers grade-appropriate knowledge and skills",
      "Parent interview focuses on educational philosophy alignment",
      "Student interview assesses interests and personality"
    ]
  },
  {
    icon: <FaFileAlt className="text-2xl" />,
    title: "Step 3: Admission Decision",
    description: "Receive the admission decision based on the assessment results, interview, and availability of seats. Shortlisted candidates will receive an offer letter.",
    timeframe: "Within 7-10 working days after the assessment and interview"
  },
  {
    icon: <FaCalendarCheck className="text-2xl" />,
    title: "Step 4: Fee Payment & Enrollment",
    description: "Complete the admission process by paying the required fees and submitting the remaining documents to secure your child's seat.",
    requirements: [
      "Payment of admission fee and first-term tuition",
      "Submission of original transfer certificate",
      "Completion of health form",
      "Signing of parent-school agreement"
    ]
  }
];

// Eligibility criteria
const eligibilityCriteria = [
  {
    grade: "Nursery",
    ageRequirement: "3+ years as of April 1st",
    assessment: "Basic readiness assessment and interaction"
  },
  {
    grade: "Kindergarten",
    ageRequirement: "4+ years as of April 1st",
    assessment: "Basic skills assessment and interaction"
  },
  {
    grade: "Grade I",
    ageRequirement: "5+ years as of April 1st",
    assessment: "Grade-appropriate knowledge and skills assessment"
  },
  {
    grade: "Grades II-V",
    ageRequirement: "Age appropriate to the grade",
    assessment: "Previous academic records and entrance test in core subjects"
  },
  {
    grade: "Grades VI-IX",
    ageRequirement: "Age appropriate to the grade",
    assessment: "Previous academic records and entrance test in core subjects"
  },
  {
    grade: "Grade XI",
    ageRequirement: "16+ years as of April 1st",
    assessment: "Based on Class X results and entrance test for chosen stream"
  }
];

// FAQ data
const faqItems = [
  {
    question: "When does the admission process for the new academic year begin?",
    answer: "The admission process for the new academic year typically begins in October of the previous year. Applications are accepted until seats are filled. We recommend applying early as seats are limited."
  },
  {
    question: "Does the school provide transportation facilities?",
    answer: "Yes, RP Public School provides transportation facilities for students from various parts of the city. The school buses are equipped with safety features and are monitored regularly. Transportation fees are separate from tuition fees."
  },
  {
    question: "What is the student-teacher ratio at RP Public School?",
    answer: "We maintain a student-teacher ratio of 25:1 in primary classes and 30:1 in higher classes to ensure personalized attention for each student and effective classroom management."
  },
  {
    question: "Are mid-session admissions available?",
    answer: "Mid-session admissions are considered based on seat availability and the student's academic record. Additional bridging support may be provided to help students adjust to the curriculum."
  },
  {
    question: "What are the school timings?",
    answer: "The school operates from Monday to Saturday. Timings are 8:00 AM to 2:30 PM for primary classes (I-V) and 8:00 AM to 3:30 PM for secondary classes (VI-XII). Pre-primary classes (Nursery & KG) run from 9:00 AM to 12:30 PM."
  },
  {
    question: "Does the school offer scholarships?",
    answer: "Yes, RP Public School offers merit-based and need-based scholarships to deserving students. Scholarship applications are reviewed annually, and awards are based on academic performance, extracurricular achievements, and financial need."
  },
  {
    question: "What curriculum does the school follow?",
    answer: "RP Public School follows the Central Board of Secondary Education (CBSE) curriculum, enhanced with additional resources and innovative teaching methodologies to provide a comprehensive education."
  },
  {
    question: "How are parents involved in their child's education?",
    answer: "We believe in a strong parent-school partnership. Regular parent-teacher meetings, a parent portal for academic updates, parent workshops, and participation in school events provide multiple avenues for parental involvement."
  }
];

export default function AdmissionsPage() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  
  return (
    <>
      <PageHeader 
        title="Admissions" 
        description="Join our school community and embark on a journey of academic excellence and holistic development"
        breadcrumbs={[{ label: "Admissions" }]}
        backgroundImage="https://www.informalnewz.com/wp-content/uploads/2025/03/School-Admission-1200x675.jpg"
      />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Admission Process" 
            subtitle="RP Public School welcomes applications from students who aspire to excel academically and grow personally in a nurturing environment."
          />
          
          <div className="mb-16">
            <div className="grid grid-cols-1 gap-16">
              {admissionSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col md:flex-row gap-8 relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  {/* Connector line for desktop */}
                  {index < admissionSteps.length - 1 && (
                    <div className="absolute hidden md:block left-14 top-20 bottom-0 w-1 bg-primary-light z-0"></div>
                  )}
                  
                  <div className="md:w-28 flex-shrink-0 flex justify-center">
                    <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center text-white z-10">
                      {step.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-heading font-bold text-primary mb-3">{step.title}</h3>
                    <p className="mb-4">{step.description}</p>
                    
                    {step.documents && (
                      <div className="mb-2">
                        <h4 className="font-medium mb-2">Required Documents:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {step.documents.map((doc, i) => (
                            <li key={i}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {step.details && (
                      <div className="mb-2">
                        <h4 className="font-medium mb-2">Details:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {step.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {step.timeframe && (
                      <div className="mb-2">
                        <h4 className="font-medium mb-2">Timeframe:</h4>
                        <p className="text-sm">{step.timeframe}</p>
                      </div>
                    )}
                    
                    {step.requirements && (
                      <div className="mb-2">
                        <h4 className="font-medium mb-2">Requirements:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {step.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FaGraduationCap className="mr-2 text-primary" /> Eligibility Criteria
                  </CardTitle>
                  <CardDescription>
                    Age requirements and assessment criteria for different grade levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Grade</th>
                        <th className="text-left py-2">Age Requirement</th>
                        <th className="text-left py-2">Assessment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eligibilityCriteria.map((criteria, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 font-medium">{criteria.grade}</td>
                          <td className="py-2">{criteria.ageRequirement}</td>
                          <td className="py-2">{criteria.assessment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FaDownload className="mr-2 text-primary" /> Downloadable Forms
                  </CardTitle>
                  <CardDescription>
                    Access and download the necessary forms for admission
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-bold mb-2">Admission Application Form</h4>
                      <p className="text-sm mb-3">Complete application form for new student enrollment</p>
                      <Button variant="outline" className="flex items-center">
                        <FaDownload className="mr-2" /> Download Form
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-bold mb-2">Student Health Form</h4>
                      <p className="text-sm mb-3">Medical information and emergency contact details</p>
                      <Button variant="outline" className="flex items-center">
                        <FaDownload className="mr-2" /> Download Form
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-bold mb-2">Transport Request Form</h4>
                      <p className="text-sm mb-3">Application for school bus transportation service</p>
                      <Button variant="outline" className="flex items-center">
                        <FaDownload className="mr-2" /> Download Form
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-bold mb-2">Fee Structure 2023-24</h4>
                      <p className="text-sm mb-3">Detailed fee structure for the current academic year</p>
                      <Button variant="outline" className="flex items-center">
                        <FaDownload className="mr-2" /> Download PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <SectionTitle 
              title="Frequently Asked Questions" 
              subtitle="Find answers to common questions about our admission process, facilities, and academic programs."
            />
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <Accordion type="single" collapsible value={activeAccordion || undefined} onValueChange={setActiveAccordion}>
                {faqItems.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-heading font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </section>
      
      <AdmissionInquiry />
    </>
  );
}
