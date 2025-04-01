import PageHeader from "@/components/ui/page-header";
import FacilitiesSection from "@/components/facilities/Facilities";
import ActivitiesSection from "@/components/facilities/Activities";
import SportsSection from "@/components/facilities/Sports";
import SectionTitle from "@/components/ui/section-title";
import { motion } from "framer-motion";

export default function FacilitiesPage() {
  return (
    <>
      <PageHeader 
        title="Campus Life" 
        description="Explore our world-class facilities, extracurricular activities, and sports programs"
        breadcrumbs={[{ label: "Campus Life" }]}
        backgroundImage="https://source.unsplash.com/random/1800x400/?school,campus"
      />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <SectionTitle 
              title="Experience Excellence" 
              subtitle="At RP Public School, we provide state-of-the-art facilities, diverse extracurricular activities, and comprehensive sports programs to ensure the holistic development of our students."
            />
            
            <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">
                Our campus is designed to create an optimal learning environment that inspires creativity, encourages exploration, and supports academic excellence. We believe that physical infrastructure plays a crucial role in shaping the educational experience of our students.
              </p>
              <p>
                Beyond academics, we offer a wide range of extracurricular activities and sports programs that allow students to discover and develop their talents, build teamwork skills, and maintain physical fitness. Our philosophy emphasizes the development of the whole child – intellectually, physically, socially, and emotionally.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      <FacilitiesSection />
      <ActivitiesSection />
      <SportsSection />
    </>
  );
}
