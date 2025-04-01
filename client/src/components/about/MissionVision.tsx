import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaUsers, FaUniversity, FaBook, FaGlobe, FaAward } from "react-icons/fa";
import SectionTitle from "@/components/ui/section-title";

// Values data
const values = [
  {
    icon: <FaChalkboardTeacher className="text-3xl" />,
    title: "Academic Excellence",
    description: "We strive for excellence in all academic pursuits, encouraging critical thinking and intellectual curiosity."
  },
  {
    icon: <FaUsers className="text-3xl" />,
    title: "Inclusivity",
    description: "We embrace diversity and create an inclusive environment where every student feels valued and respected."
  },
  {
    icon: <FaUniversity className="text-3xl" />,
    title: "Character Development",
    description: "We emphasize integrity, responsibility, and ethical values as essential aspects of education."
  },
  {
    icon: <FaBook className="text-3xl" />,
    title: "Lifelong Learning",
    description: "We foster a passion for continuous learning that extends beyond the classroom and throughout life."
  },
  {
    icon: <FaGlobe className="text-3xl" />,
    title: "Global Citizenship",
    description: "We prepare students to become responsible global citizens with awareness of world issues."
  },
  {
    icon: <FaAward className="text-3xl" />,
    title: "Innovation",
    description: "We encourage creative thinking and innovative approaches to problem-solving and learning."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function MissionVision() {
  return (
    <section id="mission" className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Our Mission & Vision" 
          subtitle="At RP Public School, we are dedicated to providing quality education that empowers students to excel academically, develop personally, and contribute positively to society."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-md"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-heading font-bold text-primary mb-4">Our Mission</h3>
            <div className="h-1 w-16 bg-accent mb-6"></div>
            <p className="mb-4">
              To provide a stimulating learning environment that encourages all students to realize their full potential through a balanced curriculum focusing on academic excellence, personal growth, and social responsibility.
            </p>
            <p>
              We are committed to creating an inclusive community where students from diverse backgrounds thrive together, developing the knowledge, skills, and character traits necessary to succeed in a rapidly evolving global society.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-md"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-heading font-bold text-primary mb-4">Our Vision</h3>
            <div className="h-1 w-16 bg-accent mb-6"></div>
            <p className="mb-4">
              To be recognized as a center of educational excellence that nurtures well-rounded individuals who are intellectually curious, emotionally intelligent, and socially conscious.
            </p>
            <p>
              We envision our graduates as confident lifelong learners who possess strong ethical values, critical thinking abilities, and the motivation to make meaningful contributions to their communities and the world at large.
            </p>
          </motion.div>
        </div>
        
        <div className="text-center mb-10">
          <h3 className="text-2xl font-heading font-bold text-primary mb-4">Our Core Values</h3>
          <div className="h-1 w-16 bg-accent mx-auto mb-6"></div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {values.map((value, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="w-16 h-16 flex items-center justify-center text-primary bg-neutral-light rounded-full mb-4">
                {value.icon}
              </div>
              <h4 className="text-xl font-heading font-bold mb-2">{value.title}</h4>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
