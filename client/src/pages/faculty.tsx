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

// Faculty data by department
const facultyByDepartment = {
  administration: [
    {
      name: "Mr. Prakash Narayan Tiwari",
      position: "Director",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8eRZ7rZwCsqz9O5HyOhpBmuCyT9MX0BOPDg&s",
      bio: "Dr. Rajesh Sharma has over 25 years of experience in education and academic leadership. He holds a Ph.D. in Education Administration and has previously served as the head of several prestigious institutions. Under his guidance, RP Public School has achieved numerous milestones in academic excellence and holistic education.",
      education: "L.LB, MBA, Entrepreneurship",
      experience: "15+ years in academic leadership",
      quote: "Education is not just about academics; it's about nurturing compassionate, critical thinkers who can shape a better world.",
      email: "#",
      linkedin: "#"
    },
    {
      name: "Mrs. Bharti Pandey",
      position: "Principal",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMEdcbBWgjmIZM0q1PPWrNRbIHrI7MJvfJGLF6fDQbwCkJTboADyT-uCTTR2EOeVPZZbI&usqp=CAU",
      bio: "Mrs. Bharti Pandey brings 18 years of experience in curriculum development and teacher training.",
      education: "M.Phil in Mathematics, Ph.D. in Educational Psychology",
      experience: "10+ years in education",
      quote: "Every child has unique potential waiting to be discovered and nurtured through thoughtful education.",
      email: "#",
      linkedin: "#"
    }
  ],
  sciences: [
    {
      name: "Mr. Anand Kapoor",
      position: "Head of Sciences",
      image: "https://source.unsplash.com/random/400x500/?professor,man",
      bio: "With over 15 years of experience teaching Physics, Mr. Kapoor specializes in making complex scientific concepts accessible and engaging for students. He has led numerous science exhibitions and research projects that have won district and state-level awards.",
      education: "M.Sc. in Physics, B.Ed.",
      experience: "15 years in science education",
      quote: "Science education should spark curiosity and encourage students to question, explore, and discover the world around them.",
      email: "#",
      linkedin: "#"
    },
    {
      name: "Dr. Meena Singh",
      position: "Chemistry Teacher",
      image: "https://source.unsplash.com/random/400x500/?teacher,woman",
      bio: "Dr. Meena Singh holds a Ph.D. in Chemistry and has contributed to research publications in organic chemistry. Her practical approach to teaching chemistry has made the subject popular among students. She coordinates the school's Science Club and annual Science Fair.",
      education: "Ph.D. in Chemistry, B.Ed.",
      experience: "12 years in teaching",
      quote: "The best way to learn chemistry is through hands-on experiments that connect theoretical concepts to real-world applications.",
      email: "#",
      linkedin: "#"
    },
    {
      name: "Mr. Rakesh Jain",
      position: "Biology Teacher",
      image: "https://source.unsplash.com/random/400x500/?teacher,indian,man",
      bio: "Mr. Jain specializes in environmental biology and has led numerous field trips and nature study programs. He has developed an innovative curriculum that integrates environmental awareness with the study of biology.",
      education: "M.Sc. in Zoology, B.Ed.",
      experience: "10 years in education",
      quote: "Biology is best learned in nature's classroom, where students can observe living systems firsthand.",
      email: "#",
      linkedin: "#"
    }
  ],
  mathematics: [
    {
      name: "Mrs. Kavita Sharma",
      position: "Mathematics Teacher",
      image: "https://source.unsplash.com/random/400x500/?teacher,indian,woman",
      bio: "Mrs. Sharma has a strong background in pure mathematics and is known for her ability to make abstract mathematical concepts clear and approachable. She has coached multiple students to success in mathematics olympiads.",
      education: "M.A. in Mathematics, B.Ed.",
      experience: "14 years in teaching",
      quote: "Mathematics is not about numbers, equations, or algorithms; it's about understanding patterns and relationships.",
      email: "#",
      linkedin: "#"
    },
    {
      name: "Mr. Suresh Reddy",
      position: "Senior Mathematics Teacher",
      image: "https://source.unsplash.com/random/400x500/?teacher,man",
      bio: "Mr. Reddy specializes in applied mathematics and statistics. He has developed interactive teaching methods that help students connect mathematical concepts to real-world applications. He leads the school's Math Club and coordinates mathematics competitions.",
      education: "M.Sc. in Mathematics, B.Ed.",
      experience: "18 years in education",
      quote: "Mathematical thinking is not just for mathematicians—it's an essential life skill for problem-solving and decision-making.",
      email: "#",
      linkedin: "#"
    }
  ],
  languages: [
    {
      name: "Mrs. Sunita Patel",
      position: "Head of Languages",
      image: "https://source.unsplash.com/random/400x500/?teacher,lady",
      bio: "Mrs. Patel has extensive experience in language education and creative writing. She has developed the school's comprehensive English language curriculum and coordinates literary events and competitions. Her innovative teaching methods promote language fluency and appreciation of literature.",
      education: "M.A. in English Literature, B.Ed.",
      experience: "16 years in language education",
      quote: "Language is not just a means of communication; it's a window to different cultures, perspectives, and ways of thinking.",
      email: "#",
      linkedin: "#"
    },
    {
      name: "Mr. Amit Kumar",
      position: "Senior Teacher (Hindi)",
      image: "https://source.unsplash.com/random/400x500/?teacher,indian,man",
      bio: "Mr. Kumar is a published author of Hindi literature and brings his passion for the language to the classroom. He has organized numerous Hindi literary events and has mentored students who have excelled in Hindi language competitions at various levels.",
      education: "M.A. in Hindi, Ph.D.",
      experience: "20 years in teaching",
      quote: "Our mother tongue connects us to our roots and helps preserve our cultural heritage for future generations.",
      email: "#",
      linkedin: "#"
    },
    {
      name: "Mrs. Radha Sharma",
      position: "Sanskrit Teacher",
      image: "https://source.unsplash.com/random/400x500/?teacher,indian,woman",
      bio: "Mrs. Sharma specializes in classical Sanskrit literature and grammar. She has developed innovative methods to make this ancient language accessible and relevant to today's students. She coordinates the school's Sanskrit Club and annual Sanskrit Day celebrations.",
      education: "M.A. in Sanskrit",
      experience: "12 years in education",
      quote: "Sanskrit is not just a language but a gateway to India's rich philosophical and cultural traditions.",
      email: "#",
      linkedin: "#"
    }
  ],
  socialStudies: [
    {
      name: "Mrs. Anjali Gupta",
      position: "Head of Social Studies",
      image: "https://source.unsplash.com/random/400x500/?teacher,woman",
      bio: "Mrs. Gupta specializes in modern Indian history and has developed an engaging curriculum that connects historical events to contemporary issues. She coordinates the school's Model United Nations program and social awareness campaigns.",
      education: "M.A. in History, B.Ed.",
      experience: "15 years in education",
      quote: "History is not just about dates and events—it's about understanding the human story and learning from our past.",
      email: "#",
      linkedin: "#"
    },
    {
      name: "Mr. Vijay Nair",
      position: "Geography Teacher",
      image: "https://source.unsplash.com/random/400x500/?teacher,man",
      bio: "Mr. Nair brings geographic concepts to life through field studies, map-making workshops, and GIS projects. He has led numerous geographic expeditions and has developed a hands-on approach to teaching environmental geography.",
      education: "M.Sc. in Geography",
      experience: "11 years in teaching",
      quote: "Geography helps us understand the complex relationships between people, places, and environments in our ever-changing world.",
      email: "#",
      linkedin: "#"
    }
  ],
  computerScience: [
    {
      name: "Mr. Rahul Mehta",
      position: "Head of Computer Science",
      image: "https://source.unsplash.com/random/400x500/?teacher,technology,man",
      bio: "Mr. Mehta has a strong background in computer science and educational technology. He has developed the school's comprehensive computer science curriculum and leads initiatives in coding, robotics, and digital literacy. He organizes annual hackathons and technology exhibitions.",
      education: "M.Tech in Computer Science, B.Ed.",
      experience: "12 years in technology education",
      quote: "In today's digital world, computational thinking is as fundamental as reading, writing, and arithmetic.",
      email: "#",
      linkedin: "#"
    },
    {
      name: "Mrs. Deepa Verma",
      position: "Computer Science Teacher",
      image: "https://source.unsplash.com/random/400x500/?teacher,technology,woman",
      bio: "Mrs. Verma specializes in web development and graphic design. She has integrated creative digital projects into the computer science curriculum and mentors students in app development and digital content creation.",
      education: "B.Tech in IT, PGDCA",
      experience: "8 years in education",
      quote: "Computer science is not just about learning to code—it's about developing the skills to solve problems creatively using technology.",
      email: "#",
      linkedin: "#"
    }
  ]
};

// Department names mapping
const departmentNames = {
  administration: "Administration",
  sciences: "Sciences",
  mathematics: "Mathematics",
  languages: "Languages",
  socialStudies: "Social Studies",
  computerScience: "Computer Science"
};

export default function FacultyPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("administration");
  
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
              
              {Object.entries(facultyByDepartment).map(([dept, members]) => (
                <TabsContent key={dept} value={dept} className="space-y-8">
                  {members.map((faculty, index) => (
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
                          className="w-full h-full object-cover" 
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
