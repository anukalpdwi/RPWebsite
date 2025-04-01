import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaBook, FaFlask, FaLaptop, FaPalette, FaBasketballBall, FaUtensils, FaFirstAid, FaBus } from "react-icons/fa";

// Facilities data
const facilities = [
  {
    id: "academic",
    name: "Academic Facilities",
    description: "Our academic facilities provide an optimal learning environment with modern resources and technology integration.",
    items: [
      {
        icon: <FaBook className="text-2xl" />,
        title: "Modern Library",
        description: "Our well-stocked library houses thousands of books, journals, and digital resources to foster a love for reading and research. The library also includes a quiet study area, reading corners, and a digital resource center with online research databases.",
        image: "https://source.unsplash.com/random/600x400/?library,books"
      },
      {
        icon: <FaFlask className="text-2xl" />,
        title: "Science Laboratories",
        description: "Our physics, chemistry, and biology labs are equipped with state-of-the-art equipment and modern facilities for conducting experiments and practical work. Each lab includes dedicated demonstration areas, safety equipment, and digital learning tools.",
        image: "https://source.unsplash.com/random/600x400/?science,laboratory"
      },
      {
        icon: <FaLaptop className="text-2xl" />,
        title: "Computer Labs",
        description: "Our computer labs feature the latest hardware and software to equip students with essential digital skills for the future. The labs include high-speed internet, multimedia resources, coding stations, and collaborative work areas.",
        image: "https://source.unsplash.com/random/600x400/?computer,lab"
      },
      {
        icon: <FaPalette className="text-2xl" />,
        title: "Art & Music Studios",
        description: "Dedicated spaces for creative expression through visual arts, music, dance, and other performing arts. The studios feature specialized equipment for various art forms, performance spaces, and exhibition areas for student work.",
        image: "https://source.unsplash.com/random/600x400/?art,studio"
      }
    ]
  },
  {
    id: "sports",
    name: "Sports Facilities",
    description: "Our sports facilities promote physical fitness, teamwork, and sportsmanship through a variety of indoor and outdoor activities.",
    items: [
      {
        icon: <FaBasketballBall className="text-2xl" />,
        title: "Sports Complex",
        description: "Our sports complex includes facilities for various sports including cricket, football, basketball, and badminton. The complex features well-maintained fields, courts with proper markings, and spectator areas for school events.",
        image: "https://source.unsplash.com/random/600x400/?sports,field"
      },
      {
        icon: <FaBasketballBall className="text-2xl" />,
        title: "Indoor Sports Arena",
        description: "A multi-purpose indoor arena for table tennis, badminton, chess, carrom, and other indoor games. The arena includes proper lighting, ventilation, and specialized flooring for different activities.",
        image: "https://source.unsplash.com/random/600x400/?indoor,sports"
      },
      {
        icon: <FaBasketballBall className="text-2xl" />,
        title: "Swimming Pool",
        description: "A semi-Olympic size swimming pool with trained instructors for swimming lessons and competitive training. The facility includes changing rooms, shower areas, and safety equipment.",
        image: "https://source.unsplash.com/random/600x400/?swimming,pool"
      },
      {
        icon: <FaBasketballBall className="text-2xl" />,
        title: "Fitness Center",
        description: "A well-equipped fitness center with cardio machines, weight training equipment, and dedicated areas for yoga and aerobics. The center is supervised by trained fitness instructors who provide guidance and support.",
        image: "https://source.unsplash.com/random/600x400/?fitness,gym"
      }
    ]
  },
  {
    id: "other",
    name: "Other Facilities",
    description: "We provide additional facilities to ensure comfort, safety, and convenience for our students and staff.",
    items: [
      {
        icon: <FaUtensils className="text-2xl" />,
        title: "Dining Hall",
        description: "A spacious cafeteria serving nutritious and balanced meals prepared in our hygienic kitchen by trained staff. The dining hall accommodates multiple classes simultaneously and follows strict food safety protocols.",
        image: "https://source.unsplash.com/random/600x400/?cafeteria,school"
      },
      {
        icon: <FaFirstAid className="text-2xl" />,
        title: "Medical Center",
        description: "A fully equipped medical center with a qualified nurse on duty and regular visits by a doctor. The center provides first aid, handles minor health issues, and has arrangements with nearby hospitals for emergencies.",
        image: "https://source.unsplash.com/random/600x400/?medical,center"
      },
      {
        icon: <FaBus className="text-2xl" />,
        title: "Transportation",
        description: "A fleet of school buses covering various routes with GPS tracking and trained staff to ensure safe transportation. The buses undergo regular maintenance and safety checks.",
        image: "https://source.unsplash.com/random/600x400/?school,bus"
      }
    ]
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

export default function FacilitiesSection() {
  return (
    <section id="facilities" className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Our Facilities" 
          subtitle="RP Public School offers state-of-the-art facilities that create an optimal learning environment and support the holistic development of our students."
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Tabs defaultValue="academic" className="w-full">
            <TabsList className="w-full flex flex-wrap justify-center mb-8">
              {facilities.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="px-4 py-2 m-1"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {facilities.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                  <p>{category.description}</p>
                </div>
                
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {category.items.map((facility, index) => (
                    <motion.div 
                      key={index} 
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                      variants={itemVariants}
                    >
                      <div className="h-60 overflow-hidden">
                        <img 
                          src={facility.image} 
                          alt={facility.title} 
                          className="w-full h-full object-cover transform hover:scale-105 transition duration-500" 
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white mr-3">
                            {facility.icon}
                          </div>
                          <h3 className="text-xl font-heading font-bold">{facility.title}</h3>
                        </div>
                        <p>{facility.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
