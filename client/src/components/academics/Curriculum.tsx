import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import { 
  FaGraduationCap, 
  FaChalkboardTeacher, 
  FaClipboardCheck, 
  FaBook,
  FaFlask,
  FaCalculator,
  FaGlobe,
  FaPalette,
  FaRunning,
  FaLaptopCode
} from "react-icons/fa";

// Curriculum approach points
const approachPoints = [
  {
    icon: <FaChalkboardTeacher />,
    title: "Student-Centered Learning",
    description: "Our teaching methods focus on individual student needs, interests, and learning styles."
  },
  {
    icon: <FaClipboardCheck />,
    title: "Continuous Assessment",
    description: "Regular formative and summative assessments to track progress and provide timely feedback."
  },
  {
    icon: <FaGraduationCap />,
    title: "Skill Development",
    description: "Focus on developing critical thinking, problem-solving, and communication skills."
  },
  {
    icon: <FaBook />,
    title: "Comprehensive Resources",
    description: "Access to diverse learning materials including textbooks, digital resources, and reference materials."
  }
];

// Subject offerings
const subjects = [
  {
    icon: <FaBook className="text-2xl" />,
    title: "Languages",
    list: ["English", "Hindi", "Sanskrit"]
  },
  {
    icon: <FaCalculator className="text-2xl" />,
    title: "Mathematics",
    list: ["Arithmetic", "Algebra", "Geometry", "Calculus"]
  },
  {
    icon: <FaFlask className="text-2xl" />,
    title: "Sciences",
    list: ["Physics", "Chemistry", "Biology", "Environmental Science"]
  },
  {
    icon: <FaGlobe className="text-2xl" />,
    title: "Social Studies",
    list: ["History", "Geography", "Civics", "Economics"]
  },
  {
    icon: <FaPalette className="text-2xl" />,
    title: "Arts & Music",
    list: ["Visual Arts", "Performing Arts", "Music Appreciation", "Dance"]
  },
  {
    icon: <FaRunning className="text-2xl" />,
    title: "Physical Education",
    list: ["Sports", "Yoga", "Health Education", "Outdoor Activities"]
  },
  {
    icon: <FaLaptopCode className="text-2xl" />,
    title: "Computer Science",
    list: ["Computer Fundamentals", "Programming", "Digital Literacy", "IT Applications"]
  }
];

export default function Curriculum() {
  return (
    <section id="curriculum" className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Our Curriculum" 
          subtitle="RP Public School follows a comprehensive CBSE curriculum designed to provide a strong academic foundation while developing critical thinking and practical skills."
        />
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-4">Curriculum Philosophy</h3>
              <p className="mb-4">
                At RP Public School, we believe in a balanced curriculum that blends academic rigor with practical learning experiences. Our curriculum is designed to:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Foster curiosity and a love for learning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Develop strong foundational knowledge across disciplines</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Encourage creative thinking and problem-solving abilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Build essential life skills and ethical values</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Prepare students for future academic and professional success</span>
                </li>
              </ul>
              <p>
                Our curriculum follows the Central Board of Secondary Education (CBSE) guidelines, enhanced with additional resources and innovative teaching methodologies to ensure a well-rounded education.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approachPoints.map((point, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-white mb-3">
                    {point.icon}
                  </div>
                  <h4 className="text-lg font-heading font-bold mb-2">{point.title}</h4>
                  <p className="text-sm">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        <div>
          <h3 className="text-2xl font-heading font-bold text-primary mb-8 text-center">Subject Offerings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md flex"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-white">
                    {subject.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-heading font-bold mb-2">{subject.title}</h4>
                  <ul className="space-y-1">
                    {subject.list.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm flex items-start">
                        <span className="text-accent mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
