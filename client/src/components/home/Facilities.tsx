import { motion } from "framer-motion";
import { Link } from "wouter";

// Facilities data
const facilities = [
  {
    image: "https://images.theconversation.com/files/266481/original/file-20190329-139374-1z0c9i3.jpg?ixlib=rb-4.1.0&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip",
    title: "Modern Library",
    description: "Our well-stocked library houses thousands of books, journals, and digital resources to foster a love for reading and research."
  },
  {
    image: "/Images/annual-day/4.jpg",
    title: "Multi Purpose Hall",
    description: "The Multi-Purpose Hall at RP Public School is a versatile space for events, sports, and activities, fostering learning and creativity."
  },
  {
    image: "/Images/Facilities/Computer lab.webp",
    title: "Computer Labs",
    description: "Our computer labs feature the latest technology and software to equip students with essential digital skills for the future."
  },
  {
    image: "/Images/Facilities/Sports.jpg",
    title: "Sports Facilities",
    description: "Extensive outdoor fields and indoor courts for various sports including cricket, football, basketball, and badminton."
  },
  {
    image: "/Images/annual-day/23.jpg",
    title: "Art & Music Studios",
    description: "Dedicated spaces for creative expression through visual arts, music, dance, and other performing arts."
  },
  {
    image: "/Images/Facilities/smart tv.jpg",
    title: "Smart Classes",
    description: "To enhance the learning experience & incorporate modern educational technology, we utilize state-of-the-art Smart TVs as part of our teaching tools"
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
