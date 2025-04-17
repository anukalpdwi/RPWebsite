import { Link } from "wouter";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { formatDate } from "@/lib/utils";

// News data
const newsItems = [
  {
    image: "/Images/annual-day/5.jpg",
    title: "Annual Academic Excellence Awards",
    description: "Our school celebrated the Annual Academic Excellence Awards ceremony, recognizing outstanding student achievements across all grades.",
    date: new Date(2025, 1, 7), 
    link: "/news/academic-awards"
  },
  {
    image: "/Images/students/stu 1.webp",
    title: "Inter-school Science Exhibition",
    description: "RP Public School will host the annual Inter-school Science Exhibition showcasing innovative projects from students across the region.",
    date: new Date(2025, 3, 20),
    link: "/news/science-exhibition"
  },
  {
    image: "/Images/annual-day/sports2.JPG",
    title: "Annual Sports Meet",
    description: "The upcoming Annual Sports Meet will feature track and field events, team sports competitions, and various athletic demonstrations.",
    date: new Date(2025, 1, 20), // December 15, 2023
    link: "/news/sports-meet"
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

export default function News() {
  return (
    <section id="news" className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">News & Events</h2>
            <div className="h-1 w-20 bg-accent mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto">Stay updated with the latest happenings and upcoming events at RP Public School.</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {newsItems.map((news, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2 text-sm text-neutral-dark">
                  <FaCalendarAlt className="mr-2" /> {formatDate(news.date)}
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">{news.title}</h3>
                <p className="mb-4">{news.description}</p>
                <Link 
                  href={news.link} 
                  className="text-accent font-medium hover:text-accent-dark transition flex items-center"
                >
                  Read More <FaArrowRight className="ml-1" />
                </Link>
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
            href="/news" 
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md shadow-md transition"
          >
            View All News
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
