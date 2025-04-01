import { Link } from "wouter";
import { motion } from "framer-motion";
import { FaUserGraduate, FaCalendarAlt, FaNewspaper, FaArrowRight } from "react-icons/fa";

// Quick links data
const quickLinks = [
  {
    icon: <FaUserGraduate className="text-4xl" />,
    title: "Admissions Open",
    description: "Applications are now being accepted for the upcoming academic year. Limited seats available.",
    link: "/admissions",
    linkText: "Learn More"
  },
  {
    icon: <FaCalendarAlt className="text-4xl" />,
    title: "School Calendar",
    description: "Stay updated with important dates, events, holidays, and examination schedules.",
    link: "/academics#calendar",
    linkText: "View Calendar"
  },
  {
    icon: <FaNewspaper className="text-4xl" />,
    title: "Latest News",
    description: "Keep up with the latest happenings, achievements, and announcements from our school.",
    link: "/news",
    linkText: "Read News"
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function QuickLinks() {
  return (
    <section className="py-10 bg-neutral-light">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {quickLinks.map((item, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="mb-4 text-primary">
                {item.icon}
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">{item.title}</h3>
              <p className="mb-4">{item.description}</p>
              <Link 
                href={item.link} 
                className="text-accent font-medium hover:text-accent-dark transition flex items-center"
              >
                {item.linkText} <FaArrowRight className="ml-1" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
