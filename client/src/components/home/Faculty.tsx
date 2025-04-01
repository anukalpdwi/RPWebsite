import { motion } from "framer-motion";
import { Link } from "wouter";
import { FaEnvelope, FaLinkedinIn } from "react-icons/fa";

// Faculty data
const facultyMembers = [
  {
    image: "https://source.unsplash.com/random/300x400/?teacher,man",
    name: "Dr. Rajesh Sharma",
    position: "Principal",
    bio: "Ph.D. in Education with 25+ years of experience in academic leadership.",
    email: "#",
    linkedin: "#"
  },
  {
    image: "https://source.unsplash.com/random/300x400/?teacher,woman",
    name: "Dr. Priya Verma",
    position: "Vice Principal",
    bio: "M.Phil in Mathematics with expertise in curriculum development and teacher training.",
    email: "#",
    linkedin: "#"
  },
  {
    image: "https://source.unsplash.com/random/300x400/?professor,man",
    name: "Mr. Anand Kapoor",
    position: "Head of Sciences",
    bio: "M.Sc. in Physics with specialized training in innovative science teaching methodologies.",
    email: "#",
    linkedin: "#"
  },
  {
    image: "https://source.unsplash.com/random/300x400/?teacher,lady",
    name: "Mrs. Sunita Patel",
    position: "Head of Languages",
    bio: "M.A. in English Literature with extensive experience in language education and creative writing.",
    email: "#",
    linkedin: "#"
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

export default function Faculty() {
  return (
    <section id="faculty" className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Our Faculty</h2>
            <div className="h-1 w-20 bg-accent mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto">Our dedicated team of experienced educators is committed to providing quality education and nurturing the potential of every student.</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {facultyMembers.map((faculty, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={faculty.image} 
                  alt={faculty.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-xl font-heading font-bold mb-1">{faculty.name}</h3>
                <p className="text-sm text-neutral-dark mb-2">{faculty.position}</p>
                <p className="text-sm mb-3">{faculty.bio}</p>
                <div className="flex justify-center space-x-2">
                  <a href={faculty.email} className="text-primary hover:text-accent transition" aria-label="Email">
                    <FaEnvelope />
                  </a>
                  <a href={faculty.linkedin} className="text-primary hover:text-accent transition" aria-label="LinkedIn">
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link 
            href="/faculty" 
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md shadow-md transition"
          >
            View All Faculty
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
