import PageHeader from "@/components/ui/page-header";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { schoolInfo } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <>
      <PageHeader 
        title="Contact Us" 
        description="Get in touch with RP Public School through various channels"
        breadcrumbs={[{ label: "Contact" }]}
        backgroundImage="https://source.unsplash.com/random/1800x400/?school,contact"
      />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">We'd Love to Hear From You</h2>
            <p className="max-w-3xl mx-auto">
              Whether you have questions about admissions, want to learn more about our programs, or need general information, we're here to help. Reach out to us using any of the following contact methods.
            </p>
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-8 mb-16">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <ContactInfo />
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <ContactForm />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <div className="h-[400px] w-full bg-gray-200 flex items-center justify-center">
              <div className="text-center p-6 bg-white/80 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-heading font-bold mb-4">School Location</h3>
                <p className="mb-4">{schoolInfo.address}</p>
                <p className="text-sm mb-3">This map would show our exact location and directions</p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" className="flex items-center">
                    <FaPhoneAlt className="mr-2" /> Call for Directions
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <FaEnvelope className="mr-2" /> Email for Directions
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Visit Our Campus</h2>
            <p className="max-w-3xl mx-auto mb-8">
              We welcome prospective parents and students to visit our campus and experience the learning environment firsthand. Schedule a campus tour to see our facilities and meet our faculty.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-primary hover:bg-neutral-light">
                Schedule a Tour
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More About Admissions
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
