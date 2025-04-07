import { motion } from "framer-motion";
import { schoolInfo } from "@/lib/utils";
import SectionTitle from "@/components/ui/section-title";

// Timeline data
const timeline = [
  {
    year: schoolInfo.founded,
    title: "Foundation",
    description: "RP Public School was established with just two classrooms and 50 students, with a vision of providing quality education in Jaisinghnagar."
  },
  {
    year: schoolInfo.founded + 1,
    title: "Campus Growth",
    description: "With increasing enrollment and community support, the campus expanded to include new classrooms and basic facilities, laying the foundation for a better learning environment."
  },
  {
    year: schoolInfo.founded + 2,
    title: "Academic Enrichment",
    description: "The school introduced activity-based learning programs, co-curricular events, and value education classes to make learning more engaging and holistic for students from Nursery to Class 8."
  },
  {
    year: schoolInfo.founded + 3,
    title: "Technological Integration",
    description: "Smart boards and digital learning tools were introduced to enhance classroom experiences, helping students stay updated with modern educational methods."
  }
];

export default function History() {
  return (
    <section id="history" className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Our History" 
          subtitle={`From humble beginnings to a prestigious educational institution, RP Public School has come a long way since its establishment in ${schoolInfo.founded}.`}
        />
        
        <div className="relative">
          {/* Center line for timeline */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-light z-0 hidden md:block"></div>
          
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              className={`mb-12 md:mb-0 relative z-10 flex ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className={`hidden md:block md:w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12"}`}>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-heading font-bold text-primary mb-2">{item.title}</h3>
                  <p className="mb-2">{item.description}</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg z-20">
                  {item.year}
                </div>
              </div>
              
              <div className="md:hidden flex items-start w-full">
                <div className="w-16 h-16 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white font-bold shadow-lg mr-4">
                  {item.year}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex-grow">
                  <h3 className="text-xl font-heading font-bold text-primary mb-2">{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
              
              <div className={`hidden md:block md:w-1/2 ${index % 2 === 0 ? "pl-12" : "pr-12 text-right"}`}></div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 bg-primary text-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-heading font-bold mb-4">Our Legacy Continues</h3>
          <p className="mb-4">
            Today, RP Public School stands as a testament to the vision of its founders and the dedication of its educators. With over {new Date().getFullYear() - schoolInfo.founded} years of service to the community, we continue to evolve while staying true to our core values.
          </p>
          <p>
            Our journey reflects our commitment to educational excellence and our ability to adapt to changing times while maintaining a nurturing environment for students to learn and grow.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
