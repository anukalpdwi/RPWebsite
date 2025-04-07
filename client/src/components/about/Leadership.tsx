import { motion } from "framer-motion";
import { FaEnvelope, FaLinkedinIn, FaQuoteLeft } from "react-icons/fa";
import SectionTitle from "@/components/ui/section-title";

// Leadership team data
const leadershipTeam = [
  {
    name: "Mr. Prakash Narayan Tiwari",
    position: "Director",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8eRZ7rZwCsqz9O5HyOhpBmuCyT9MX0BOPDg&s",
    bio: "Successful entrepreneur with extensive experience in leadership and education. His vision focuses on fostering excellence and nurturing future leaders.",
    quote: "Education is not just about academics; it's about nurturing compassionate, critical thinkers who can shape a better world.",
    email: "#",
    linkedin: "#"
  },
  {
    name: "Mrs. Bharti Pandey",
    position: "Principal",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMEdcbBWgjmIZM0q1PPWrNRbIHrI7MJvfJGLF6fDQbwCkJTboADyT-uCTTR2EOeVPZZbI&usqp=CAU",
    bio: "Masters in Education with 10+ years of experience in academic leadership.",
    quote: "Every child has unique potential waiting to be discovered and nurtured through thoughtful education.",
    email: "#",
    linkedin: "#"
  }
];

// Board members data
const boardMembers = [
  {
    name: "Mr. Deep Narayan Tiwari",
    position: "Chairman",
    image: "https://source.unsplash.com/random/300x300/?businessman"
  },
  {
    name: "Mr. Pradeep Pandey",
    position: "Board Member",
    image: "https://source.unsplash.com/random/300x300/?businesswoman"
  },
  {
    name: "Mrs. Savita Dwivedi",
    position: "Treasurer",
    image: "https://source.unsplash.com/random/300x300/?executive,man"
  },
  {
    name: "Mrs. Deepti Tiwari ",
    position: "Board Member",
    image: "https://source.unsplash.com/random/300x300/?professor,woman"
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function Leadership() {
  return (
    <section id="leadership" className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="School Leadership" 
          subtitle="Our school is guided by experienced educational leaders who are dedicated to upholding our values and vision while ensuring excellence in all aspects of school operations."
        />
        
        {/* School Administrators */}
        <div className="mb-16">
          {leadershipTeam.map((leader, index) => (
            <motion.div 
              key={index}
              className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-lg overflow-hidden mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="md:w-1/3">
                <img 
                  src={leader.image} 
                  alt={leader.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="text-2xl font-heading font-bold text-primary mb-1">{leader.name}</h3>
                <p className="text-lg mb-4">{leader.position}</p>
                <p className="mb-4">{leader.bio}</p>
                <div className="mb-4 flex items-start">
                  <FaQuoteLeft className="text-accent text-xl mr-2 mt-1" />
                  <p className="italic text-gray-700">{leader.quote}</p>
                </div>
                <div className="flex space-x-3">
                  <a href={leader.email} className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white hover:bg-primary transition" aria-label="Email">
                    <FaEnvelope />
                  </a>
                  <a href={leader.linkedin} className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white hover:bg-primary transition" aria-label="LinkedIn">
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Board of Directors */}
        <div>
          <h3 className="text-2xl font-heading font-bold text-primary mb-6 text-center">Board of Directors</h3>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {boardMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden text-center card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                variants={itemVariants}
              >
                <div className="h-60 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-heading font-bold mb-1">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.position}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
