import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/ui/page-header";
import SectionTitle from "@/components/ui/section-title";
import { FaEnvelope, FaLinkedinIn, FaUserTie, FaQuoteLeft } from "react-icons/fa";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { useQuery } from "@tanstack/react-query";
import { getGoogleDriveDirectLink } from "@/lib/utils";

// Department names mapping
const departmentNames: Record<string, string> = {
  administration: "Administration",
  sciences: "Sciences",
  mathematics: "Mathematics",
  languages: "Languages",
  socialStudies: "Social Studies",
  computerScience: "Computer Science"
};

export default function FacultyPage() {
  const { data: staff, isLoading } = useQuery<any[]>({
    queryKey: ["/api/staff"],
  });

  const [selectedDepartment, setSelectedDepartment] = useState<string>("administration");

  if (isLoading) {
    return (
       <>
        <PageHeader 
          title="Our Faculty" 
          description="Loading faculty directory..."
          breadcrumbs={[{ label: "Faculty" }]}
        />
        <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
       </>
    );
  }

  // Group staff by department
  const facultyByDepartment = staff?.reduce((acc: Record<string, any[]>, member: any) => {
    const dept = member.department || 'administration';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push({
      name: member.name,
      position: member.role,
      image: getGoogleDriveDirectLink(member.photoUrl) || "https://images.unsplash.com/photo-1544161515-4af6b1d462c2?q=80&w=2070&auto=format&fit=crop",
      bio: member.bio || "Dedicated faculty member at RP Public School, committed to fostering academic excellence and holistic development in every student.",
      education: member.qualification || "Degrees not specified",
      experience: member.experience || "Years of experience not specified",
      quote: member.quote || "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
      email: member.email ? `mailto:${member.email}` : "#",
      linkedin: member.linkedin || "#"
    });
    return acc;
  }, {} as Record<string, any[]>) || {};

  // Ensure all departments exist in the object even if empty
  Object.keys(departmentNames).forEach(dept => {
    if (!facultyByDepartment[dept]) facultyByDepartment[dept] = [];
  });
  
  return (
    <>
      <PageHeader 
        title="Our Faculty" 
        description="Meet our team of dedicated educators who are committed to excellence in teaching and nurturing young minds"
        breadcrumbs={[{ label: "Faculty" }]}
        backgroundImage="https://source.unsplash.com/random/1800x400/?teachers,education"
      />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Meet Our Educators" 
            subtitle="Our faculty members bring a wealth of knowledge, experience, and passion to create an inspiring learning environment."
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Tabs defaultValue="administration" value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <TabsList className="w-full flex flex-wrap justify-center mb-8">
                {Object.entries(departmentNames).map(([key, name]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className="px-4 py-2 m-1"
                  >
                    {name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(facultyByDepartment).map(([dept, members]: [string, any[]]) => (
                <TabsContent key={dept} value={dept} className="space-y-8">
                  {members.map((faculty: any, index: number) => (
                    <motion.div 
                      key={index}
                      className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-lg overflow-hidden"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: index * 0.2 }}
                    >
                      <div className="md:w-1/3 lg:w-1/4">
                        <img 
                          src={faculty.image} 
                          alt={faculty.name} 
                          className="w-full h-full object-cover object-top" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6 md:w-2/3 lg:w-3/4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-heading font-bold text-primary mb-1">{faculty.name}</h3>
                            <p className="text-lg mb-2">{faculty.position}</p>
                          </div>
                          <div className="flex space-x-3 mt-2 md:mt-0">
                            <a href={faculty.email} className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white hover:bg-primary transition" aria-label="Email">
                              <FaEnvelope />
                            </a>
                            <a href={faculty.linkedin} className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white hover:bg-primary transition" aria-label="LinkedIn">
                              <FaLinkedinIn />
                            </a>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center">
                            <FaUserTie className="text-primary mr-2" />
                            <span><strong>Education:</strong> {faculty.education}</span>
                          </div>
                          <div className="flex items-center">
                            <FaUserTie className="text-primary mr-2" />
                            <span><strong>Experience:</strong> {faculty.experience}</span>
                          </div>
                        </div>
                        
                        <p className="mb-4">{faculty.bio}</p>
                        
                        <div className="flex items-start">
                          <FaQuoteLeft className="text-accent text-xl mr-2 mt-1 flex-shrink-0" />
                          <p className="italic text-gray-700">{faculty.quote}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-primary text-white p-8 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-heading font-bold mb-4 text-center">Join Our Teaching Team</h3>
            <p className="text-center mb-6">
              We're always looking for talented educators who are passionate about making a difference in students' lives. If you're interested in joining our faculty, please send your resume to:
            </p>
            <p className="text-center text-xl">
              <a href="mailto:careers@rppublicschool.edu.in" className="underline hover:text-accent-light transition">careers@rppublicschool.edu.in</a>
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
