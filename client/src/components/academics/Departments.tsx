import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Departments data
const departments = [
  {
    id: "languages",
    name: "Languages",
    description: "Our Languages department provides comprehensive instruction in English, Hindi, and Sanskrit. Through literature, grammar, and communication skills, students develop proficiency in reading, writing, and speaking multiple languages, preparing them for effective communication in diverse contexts.",
    highlights: [
      "Language Labs with audio-visual resources",
      "Regular literary events and competitions",
      "Language clubs for additional practice",
      "Creative writing workshops",
      "Public speaking and debate training"
    ],
    faculty: [
      {
        name: "Mrs. Sunita Patel",
        position: "Head of Department",
        qualification: "M.A. in English Literature, B.Ed."
      },
      {
        name: "Mr. Amit Kumar",
        position: "Senior Teacher (Hindi)",
        qualification: "M.A. in Hindi, Ph.D."
      },
      {
        name: "Mrs. Radha Sharma",
        position: "Sanskrit Teacher",
        qualification: "M.A. in Sanskrit"
      }
    ]
  },
  {
    id: "sciences",
    name: "Sciences",
    description: "The Science department offers a dynamic and engaging curriculum in Physics, Chemistry, and Biology. Through theoretical lessons and practical laboratory work, students develop scientific knowledge, inquiry skills, and an understanding of how science impacts our world.",
    highlights: [
      "Well-equipped laboratories for Physics, Chemistry, and Biology",
      "Regular science fairs and research projects",
      "Field trips and nature study programs",
      "Association with scientific institutions",
      "Preparation for competitive science examinations"
    ],
    faculty: [
      {
        name: "Mr. Anand Kapoor",
        position: "Head of Department",
        qualification: "M.Sc. in Physics, B.Ed."
      },
      {
        name: "Dr. Meena Singh",
        position: "Chemistry Teacher",
        qualification: "Ph.D. in Chemistry"
      },
      {
        name: "Mr. Rakesh Jain",
        position: "Biology Teacher",
        qualification: "M.Sc. in Zoology, B.Ed."
      }
    ]
  },
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Our Mathematics department fosters logical thinking, problem-solving abilities, and numerical literacy. From basic arithmetic to advanced calculus, students learn to apply mathematical concepts to real-world situations and develop analytical skills essential for various fields.",
    highlights: [
      "Interactive math labs with models and tools",
      "Math Olympiad training and participation",
      "Regular problem-solving workshops",
      "Use of technology in mathematical education",
      "Remedial classes for students needing additional support"
    ],
    faculty: [
      {
        name: "Dr. Priya Verma",
        position: "Head of Department",
        qualification: "M.Phil in Mathematics, Ph.D."
      },
      {
        name: "Mr. Suresh Reddy",
        position: "Senior Mathematics Teacher",
        qualification: "M.Sc. in Mathematics, B.Ed."
      },
      {
        name: "Mrs. Kavita Sharma",
        position: "Mathematics Teacher",
        qualification: "M.A. in Mathematics"
      }
    ]
  },
  {
    id: "social",
    name: "Social Studies",
    description: "The Social Studies department integrates History, Geography, Civics, and Economics to provide students with a comprehensive understanding of human societies, cultures, and environments. Through this curriculum, students develop informed perspectives on social issues and global awareness.",
    highlights: [
      "Social science resource center with maps and globes",
      "Historical excursions and field studies",
      "Model United Nations participation",
      "Civic engagement and community service projects",
      "Current affairs discussions and debates"
    ],
    faculty: [
      {
        name: "Mrs. Anjali Gupta",
        position: "Head of Department",
        qualification: "M.A. in History, B.Ed."
      },
      {
        name: "Mr. Vijay Nair",
        position: "Geography Teacher",
        qualification: "M.Sc. in Geography"
      },
      {
        name: "Mrs. Seema Khanna",
        position: "Economics Teacher",
        qualification: "M.A. in Economics, B.Ed."
      }
    ]
  },
  {
    id: "computer",
    name: "Computer Science",
    description: "Our Computer Science department equips students with essential digital literacy and programming skills. From basic computer operations to advanced programming concepts, students learn to leverage technology effectively in the modern world.",
    highlights: [
      "State-of-the-art computer laboratories",
      "Coding clubs and hackathons",
      "Web development and app design projects",
      "Digital literacy and cyber safety training",
      "Collaboration with technology companies for workshops"
    ],
    faculty: [
      {
        name: "Mr. Rahul Mehta",
        position: "Head of Department",
        qualification: "M.Tech in Computer Science, B.Ed."
      },
      {
        name: "Mrs. Deepa Verma",
        position: "Computer Science Teacher",
        qualification: "B.Tech in IT, PGDCA"
      },
      {
        name: "Mr. Anil Kumar",
        position: "Computer Applications Teacher",
        qualification: "MCA, B.Ed."
      }
    ]
  }
];

export default function Departments() {
  return (
    <section id="departments" className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Academic Departments" 
          subtitle="Our specialized academic departments are staffed by qualified educators who are experts in their respective fields and dedicated to providing quality education."
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Tabs defaultValue={departments[0].id} className="w-full">
            <TabsList className="w-full flex flex-wrap justify-center mb-8">
              {departments.map((dept) => (
                <TabsTrigger 
                  key={dept.id} 
                  value={dept.id}
                  className="px-4 py-2 m-1"
                >
                  {dept.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {departments.map((dept) => (
              <TabsContent key={dept.id} value={dept.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-2xl font-heading font-bold text-primary mb-4">{dept.name} Department</h3>
                    <p className="mb-6">{dept.description}</p>
                    
                    <h4 className="text-lg font-heading font-bold mb-3">Department Highlights:</h4>
                    <ul className="space-y-2 mb-6">
                      {dept.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-accent mr-2">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-heading font-bold mb-3">Faculty Members:</h4>
                    <div className="space-y-4">
                      {dept.faculty.map((member, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-md">
                          <h5 className="font-heading font-bold">{member.name}</h5>
                          <p className="text-sm text-gray-600">{member.position}</p>
                          <p className="text-sm">{member.qualification}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
