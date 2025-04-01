import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Testimonials data
const testimonials = [
  {
    quote: "RP Public School has provided my daughter with not just academic excellence but also a nurturing environment that has helped her grow into a confident individual. The faculty's dedication and personalized attention make all the difference.",
    author: "Mrs. Anjali Gupta",
    role: "Parent of Riya Gupta, Class 5",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcx9AHEcXoUO7xsDRwI3jrN1N_yGYBmGyr1w&s"
  },
  {
    quote: "As a student at RP Public School for the past 2 years, I've had incredible opportunities to explore my interests in both academics and extracurricular activities. The school's approach to holistic education has truly shaped my personality.",
    author: "Arjuna Singh",
    role: "Class 6 Student",
    image: "Images/annual-day/2.jpg"
  },
  {
    quote: "The emphasis on values, discipline, and academic rigor at RP Public School has been instrumental in my son's development. The school's balanced approach ensures that students excel not just in studies but also develop essential life skills.",
    author: "Mr. Suresh Kumar",
    role: "Parent of Vikram Kumar, Class VIII",
    image: "https://source.unsplash.com/random/100x100/?man,portrait"
  }
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to go to next testimonial
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  // Function to go to previous testimonial
  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Function to go to a specific testimonial
  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  // Setup automatic testimonial transition
  useEffect(() => {
    testimonialIntervalRef.current = setInterval(nextTestimonial, 8000);
    
    return () => {
      if (testimonialIntervalRef.current) {
        clearInterval(testimonialIntervalRef.current);
      }
    };
  }, []);

  // Reset interval when testimonial changes manually
  const handleManualTestimonialChange = (callback: () => void) => {
    if (testimonialIntervalRef.current) {
      clearInterval(testimonialIntervalRef.current);
    }
    callback();
    testimonialIntervalRef.current = setInterval(nextTestimonial, 8000);
  };

  return (
    <section className="py-16 bg-primary text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10">
        <FaQuoteLeft className="text-9xl" />
      </div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">What Parents & Students Say</h2>
            <div className="h-1 w-20 bg-accent mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto">Hear from our community about their experiences at RP Public School.</p>
          </motion.div>
        </div>
        
        <div className="testimonial-slider relative">
          <AnimatePresence mode="wait">
            {testimonials.map((testimonial, index) => (
              index === currentTestimonial && (
                <motion.div
                  key={index}
                  className="max-w-3xl mx-auto text-center"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6 inline-block">
                    <FaQuoteLeft className="text-accent text-4xl" />
                  </div>
                  <p className="text-xl mb-6">{testimonial.quote}</p>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <h4 className="font-heading font-bold">{testimonial.author}</h4>
                    <p className="text-sm">{testimonial.role}</p>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
          
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? "bg-white" 
                    : "bg-white/50"
                }`}
                onClick={() => handleManualTestimonialChange(() => goToTestimonial(index))}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition"
            onClick={() => handleManualTestimonialChange(prevTestimonial)}
            aria-label="Previous Testimonial"
          >
            <FaChevronLeft />
          </button>
          
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition"
            onClick={() => handleManualTestimonialChange(nextTestimonial)}
            aria-label="Next Testimonial"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
