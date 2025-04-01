
import { Link } from "wouter";
import { motion } from "framer-motion";
import { FaChild, FaBookReader, FaGraduationCap, FaCheck, FaArrowRight } from "react-icons/fa";

// Programs data
const programs = [
  {
    icon: <FaChild className="text-2xl" />,
    title: "Pre-Primary Section",
    description: "Nursery, LKG and UKG classes focus on early childhood development through play-based learning and foundational skills.",
    features: [
      "Age-appropriate learning activities",
      "Development of motor skills",
      "Introduction to basic concepts"
    ],
    link: "/academics#pre-primary",
    linkText: "Learn More"
  },
  {
    icon: <FaBookReader className="text-2xl" />,
    title: "Primary Section",
    description: "Classes 1st to 5th focus on building strong foundations in core subjects through engaging and interactive learning methods.",
    features: [
      "Core subject fundamentals",
      "Activity-based learning",
      "Regular assessments and feedback"
    ],
    link: "/academics#primary",
    linkText: "Learn More"
  },
  {
    icon: <FaGraduationCap className="text-2xl" />,
    title: "Middle Section",
    description: "Classes 6th to 8th build on foundational knowledge while introducing advanced concepts and analytical thinking.",
    features: [
      "Advanced subject content",
      "Project-based learning",
      "Critical thinking development"
    ],
    link: "/academics#middle",
    linkText: "Learn More"
  }
];

// Animation variants
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Programs() {
  return (
    <section id="academics" className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Academic Programs</h2>
            <div className="h-1 w-20 bg-accent mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto">Our comprehensive academic programs are designed to provide students with a strong foundation while nurturing their overall development.</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {programs.map((program, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="h-16 w-16 rounded-full bg-primary-light flex items-center justify-center text-white mb-4">
                {program.icon}
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">{program.title}</h3>
              <p className="mb-4">{program.description}</p>
              <ul className="mb-4 space-y-2">
                {program.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <FaCheck className="text-accent mt-1 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href={program.link} 
                className="text-accent font-medium hover:text-accent-dark transition flex items-center"
              >
                {program.linkText} <FaArrowRight className="ml-1" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
