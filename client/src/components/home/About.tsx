import { Link } from "wouter";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { schoolInfo } from "@/lib/utils";
import AnimatedText from "@/components/ui/animated-text";

// Features list
const features = [
  "Experienced Faculty",
  "Modern Facilities",
  "Sports Excellence",
  "Holistic Development"
];

export default function About() {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <img 
              src="\Images\students/arts2.jpg" 
              alt="RP Public School Campus" 
              className="rounded-lg shadow-lg object-cover w-full h-full" 
            />
          </motion.div>
          
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                About {schoolInfo.fullName}
              </h2>
              <div className="h-1 w-20 bg-accent mb-6"></div>
              <p className="mb-4">
                {schoolInfo.name} in {schoolInfo.location} is committed to providing quality education that nurtures the intellectual, physical, and emotional development of our students. With a perfect blend of traditional values and modern teaching methodologies, we strive to create a stimulating learning environment.
              </p>
              <p className="mb-6">
                Founded in {schoolInfo.founded}, our school has grown to become one of the leading educational institutions in the region. Our dedicated faculty, state-of-the-art facilities, and comprehensive curriculum ensure that every student receives personalized attention and achieves their full potential.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-2 gap-4 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="text-accent mr-3">
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link 
                href="/about#mission" 
                className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md shadow-md transition"
              >
                Our Mission & Vision
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
