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
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.7281574229837!2d81.3908538!3d23.6856776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39868fd5decc19c9%3A0x16cc0bc5a56b6b9c!2sRP%20PUBLIC%20SCHOOL%20JAISINGHNAGAR!5e0!3m2!1sen!2sin!4v1743529828316!5m2!1sen!2sin"
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
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
