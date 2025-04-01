import { motion } from "framer-motion";
import { Link } from "wouter";

// Facilities data
const facilities = [
  {
    image: "https://source.unsplash.com/random/600x400/?library,books",
    title: "Modern Library",
    description: "Our well-stocked library houses thousands of books, journals, and digital resources to foster a love for reading and research."
  },
  {
    image: "https://source.unsplash.com/random/600x400/?science,laboratory",
    title: "Science Laboratories",
    description: "Fully equipped physics, chemistry, and biology labs provide hands-on learning experiences and practical knowledge."
  },
  {
    image: "https://source.unsplash.com/random/600x400/?computer,lab",
    title: "Computer Labs",
    description: "Our computer labs feature the latest technology and software to equip students with essential digital skills for the future."
  },
  {
    image: "https://source.unsplash.com/random/600x400/?sports,field",
    title: "Sports Facilities",
    description: "Extensive outdoor fields and indoor courts for various sports including cricket, football, basketball, and badminton."
  },
  {
    image: "https://source.unsplash.com/random/600x400/?art,studio",
    title: "Art & Music Studios",
    description: "Dedicated spaces for creative expression through visual arts, music, dance, and other performing arts."
  },
  {
    image: "https://source.unsplash.com/random/600x400/?cafeteria,school",
    title: "Dining Hall",
    description: "Spacious cafeteria serving nutritious and balanced meals prepared in our hygienic kitchen by trained staff."
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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

export default function Facilities() {
  return (
    <section id="facilities" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Our Facilities</h2>
            <div className="h-1 w-20 bg-accent mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto">RP Public School offers state-of-the-art facilities that create an optimal learning environment and support the holistic development of our students.</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {facilities.map((facility, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md overflow-hidden"
              variants={itemVariants}
            >
              <div className="h-48 mb-4 overflow-hidden rounded-md">
                <img 
                  src={facility.image} 
                  alt={facility.title} 
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500" 
                />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">{facility.title}</h3>
              <p>{facility.description}</p>
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
            href="/facilities" 
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md shadow-md transition"
          >
            Explore All Facilities
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
