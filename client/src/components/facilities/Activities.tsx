import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import { 
  FaMicrophone, 
  FaPaintBrush, 
  FaRobot, 
  FaGlobe, 
  FaCamera, 
  FaChessKnight,
  FaTheaterMasks,
  FaMusic,
  FaBook,
  FaLeaf
} from "react-icons/fa";

// Activities data
const activities = [
  {
    icon: <FaMusic className="text-3xl" />,
    title: "Music Club",
    description: "Students learn vocal and instrumental music, participate in recitals, and perform at school events.",
    schedule: "Tuesday & Thursday, 3:45 PM - 5:00 PM"
  },
  {
    icon: <FaTheaterMasks className="text-3xl" />,
    title: "Drama Club",
    description: "Students develop acting skills, stage presence, and produce theatrical performances throughout the year.",
    schedule: "Monday & Wednesday, 3:45 PM - 5:00 PM"
  },
  {
    icon: <FaPaintBrush className="text-3xl" />,
    title: "Art & Craft",
    description: "Students explore various art forms including painting, sketching, pottery, and handicrafts.",
    schedule: "Tuesday & Friday, 3:45 PM - 5:00 PM"
  },
  {
    icon: <FaRobot className="text-3xl" />,
    title: "Robotics Club",
    description: "Students design, build, and program robots while learning engineering and computational skills.",
    schedule: "Monday & Thursday, 3:45 PM - 5:00 PM"
  },
  {
    icon: <FaGlobe className="text-3xl" />,
    title: "Model United Nations",
    description: "Students simulate UN committees, debating global issues and developing diplomacy skills.",
    schedule: "Wednesday, 3:45 PM - 5:30 PM"
  },
  {
    icon: <FaCamera className="text-3xl" />,
    title: "Photography Club",
    description: "Students learn photography techniques, composition, and digital editing skills.",
    schedule: "Friday, 3:45 PM - 5:00 PM"
  },
  {
    icon: <FaChessKnight className="text-3xl" />,
    title: "Chess Club",
    description: "Students learn chess strategies, participate in tournaments, and develop critical thinking skills.",
    schedule: "Tuesday, 3:45 PM - 5:00 PM"
  },
  {
    icon: <FaMicrophone className="text-3xl" />,
    title: "Debate Club",
    description: "Students develop public speaking, critical thinking, and persuasive argument skills.",
    schedule: "Thursday, 3:45 PM - 5:00 PM"
  },
  {
    icon: <FaBook className="text-3xl" />,
    title: "Literary Club",
    description: "Students explore creative writing, poetry, and literature appreciation.",
    schedule: "Monday, 3:45 PM - 5:00 PM"
  },
  {
    icon: <FaLeaf className="text-3xl" />,
    title: "Eco Club",
    description: "Students participate in environmental awareness activities and sustainability projects.",
    schedule: "Wednesday, 3:45 PM - 5:00 PM"
  }
];

// Annual events
const annualEvents = [
  {
    name: "Annual Cultural Festival",
    description: "A week-long celebration of art, music, dance, and drama with performances by students across all grades.",
    month: "December"
  },
  {
    name: "Science Exhibition",
    description: "Students showcase innovative science projects and experiments developed throughout the year.",
    month: "November"
  },
  {
    name: "Literary Fest",
    description: "Includes debates, creative writing competitions, poetry recitation, and quiz competitions.",
    month: "August"
  },
  {
    name: "Sports Day",
    description: "Annual athletic meet featuring track and field events, team sports, and displays of physical fitness.",
    month: "January"
  },
  {
    name: "Art Exhibition",
    description: "Display of student artwork created throughout the year across various mediums and techniques.",
    month: "February"
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function ActivitiesSection() {
  return (
    <section id="activities" className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Activities & Clubs" 
          subtitle="We offer a wide range of extracurricular activities that help students discover and develop their talents and interests outside the classroom."
        />
        
        <div className="mb-16">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {activities.map((activity, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                variants={itemVariants}
              >
                <div className="flex items-start">
                  <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-white mr-4 flex-shrink-0">
                    {activity.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold mb-2">{activity.title}</h3>
                    <p className="mb-2">{activity.description}</p>
                    <p className="text-sm text-gray-600"><strong>Schedule:</strong> {activity.schedule}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-heading font-bold text-primary mb-6 text-center">Annual School Events</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {annualEvents.map((event, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center font-bold text-primary">
                    {event.month.substring(0, 3)}
                  </div>
                  <h4 className="ml-3 text-lg font-heading font-bold">{event.name}</h4>
                </div>
                <p>{event.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 font-medium text-lg">
            Through these activities, students develop important life skills such as teamwork, leadership, creativity, and time management.
          </p>
          <p>
            Participation in extracurricular activities is encouraged for all students as part of our commitment to holistic education.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
