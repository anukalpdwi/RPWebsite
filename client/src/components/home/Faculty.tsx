import { motion } from "framer-motion";
import { Link } from "wouter";
import { FaEnvelope, FaLinkedinIn } from "react-icons/fa";

// Faculty data
const facultyMembers = [
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8eRZ7rZwCsqz9O5HyOhpBmuCyT9MX0BOPDg&s",
    name: "Mr. Prakash Narayan Tiwari",
    position: "Director",
    bio: "Successful entrepreneur with extensive experience in leadership and education. His vision focuses on fostering excellence and nurturing future leaders.",
    email: "#",
    linkedin: "#"
  },
  {
    image: "https://clipart-library.com/8300/principal-.png",
    name: "Mrs. Deepti Tiwari",
    position: "Principal",
    bio: "Masters in Mathematics with expertise in curriculum development and teacher training.",
    email: "#",
    linkedin: "#"
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMEdcbBWgjmIZM0q1PPWrNRbIHrI7MJvfJGLF6fDQbwCkJTboADyT-uCTTR2EOeVPZZbI&usqp=CAU",
    name: "Mrs. Bharti Pandey",
    position: "Vice Principal",
    bio: "Masters in Education with 10+ years of experience in academic leadership.",
    email: "#",
    linkedin: "#"
  },
  {
    image: "https://static.vecteezy.com/system/resources/thumbnails/003/524/750/small_2x/a-man-working-with-laptop-free-vector.jpg",
    name: "Mr. Pradeep Pandey",
    position: "Head of Staff",
    bio: "Experienced in leadership and education. His vision focuses on fostering excellence and nurturing future leaders.",
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
