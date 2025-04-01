import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import { 
  FaRunning, 
  FaFutbol, 
  FaBasketballBall, 
  FaTableTennis, 
  FaVolleyballBall,
  FaSwimmer
} from "react-icons/fa";

// Sports programs data
const sportsPrograms = [
  {
    icon: <FaRunning className="text-4xl" />,
    title: "Athletics",
    description: "Track and field events including sprints, relays, long jump, high jump, shot put, and more.",
    achievements: [
      "District Champions in 4x100m Relay (2022)",
      "State-level medals in Long Jump and Shot Put",
      "Annual Athletic Meet with over 20 competitive events"
    ],
    image: "https://source.unsplash.com/random/600x400/?athletics,track"
  },
  {
    icon: <FaFutbol className="text-4xl" />,
    title: "Football",
    description: "Comprehensive football training program with junior and senior teams competing at various levels.",
    achievements: [
      "Inter-school Football Tournament Winners (2021)",
      "District-level Participation",
      "Annual Football League for all age groups"
    ],
    image: "https://source.unsplash.com/random/600x400/?football,soccer"
  },
  {
    icon: <FaBasketballBall className="text-4xl" />,
    title: "Basketball",
    description: "Basketball training for both boys and girls teams with emphasis on technique and teamwork.",
    achievements: [
      "Regional Basketball Tournament Runners-up (2022)",
      "Inter-school Basketball Championship Participation",
      "Quarterly Friendly Matches with Neighboring Schools"
    ],
    image: "https://source.unsplash.com/random/600x400/?basketball"
  },
  {
    icon: <FaVolleyballBall className="text-4xl" />,
    title: "Volleyball",
    description: "Volleyball coaching for junior and senior teams focusing on skills and strategic gameplay.",
    achievements: [
      "District Volleyball Tournament Participation",
      "Inter-house Volleyball Competitions",
      "Annual Volleyball Camp with Guest Coaches"
    ],
    image: "https://source.unsplash.com/random/600x400/?volleyball"
  },
  {
    icon: <FaTableTennis className="text-4xl" />,
    title: "Table Tennis",
    description: "Individual and team training in table tennis with regular practice sessions and tournaments.",
    achievements: [
      "State-level Table Tennis Championship Qualification",
      "District Singles and Doubles Champions",
      "Monthly Table Tennis Tournaments"
    ],
    image: "https://source.unsplash.com/random/600x400/?table,tennis"
  },
  {
    icon: <FaSwimmer className="text-4xl" />,
    title: "Swimming",
    description: "Swimming training for various strokes, techniques, and competitive swimming events.",
    achievements: [
      "District Swimming Championship Medals",
      "Annual Swimming Gala",
      "Learn-to-Swim Program for Beginners"
    ],
    image: "https://source.unsplash.com/random/600x400/?swimming"
  }
];

// Sports coaching staff
const coachingStaff = [
  {
    name: "Mr. Rajiv Singh",
    position: "Physical Education Director",
    specialization: "Athletics, Football",
    experience: "15+ years of coaching experience including state-level athletes"
  },
  {
    name: "Ms. Anita Sharma",
    position: "Assistant Sports Coach",
    specialization: "Basketball, Volleyball",
    experience: "Former national-level basketball player with 10 years of coaching experience"
  },
  {
    name: "Mr. Sunil Kumar",
    position: "Swimming Coach",
    specialization: "All swimming strokes and water safety",
    experience: "Certified swimming instructor with experience training competitive swimmers"
  },
  {
    name: "Mrs. Deepa Patel",
    position: "Table Tennis Coach",
    specialization: "Table Tennis techniques and strategy",
    experience: "Former state champion with specialized training in junior development"
  }
];

export default function SportsSection() {
  return (
    <section id="sports" className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Sports Programs" 
          subtitle="Our comprehensive sports programs promote physical fitness, teamwork, sportsmanship, and a healthy competitive spirit among students."
        />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <p className="mb-4">
              At RP Public School, we believe that sports are an integral part of education. Our sports program is designed to:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span>Develop physical fitness and coordination</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span>Foster teamwork, leadership, and sportsmanship</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span>Build discipline, perseverance, and resilience</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span>Encourage healthy competition and fair play</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span>Provide opportunities for talent identification and development</span>
              </li>
            </ul>
            <p>
              Our sports facilities are equipped with modern amenities, and all training is conducted under the supervision of qualified coaches who ensure proper technique and safety.
            </p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sportsPrograms.map((sport, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={sport.image} 
                  alt={sport.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-white mr-4 flex-shrink-0">
                    {sport.icon}
                  </div>
                  <h3 className="text-xl font-heading font-bold">{sport.title}</h3>
                </div>
                <p className="mb-3">{sport.description}</p>
                <h4 className="font-medium mb-2">Key Achievements:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-2">
                  {sport.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-heading font-bold text-primary mb-6 text-center">Our Coaching Staff</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coachingStaff.map((coach, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-heading font-bold text-lg mb-2">{coach.name}</h4>
                <p className="text-primary font-medium mb-2">{coach.position}</p>
                <p className="text-sm mb-1"><strong>Specialization:</strong> {coach.specialization}</p>
                <p className="text-sm"><strong>Experience:</strong> {coach.experience}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-primary text-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-heading font-bold mb-4">Annual Sports Meet</h3>
            <p className="mb-4">
              Our Annual Sports Meet is a major event in the school calendar, featuring track and field events, team sports competitions, and various athletic displays. It provides an opportunity for students to showcase their sporting talents and for parents to witness their achievements.
            </p>
            <p className="text-lg font-medium">
              Next Sports Meet: December 15, 2023
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
