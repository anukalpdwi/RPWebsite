import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AnimatedText from "@/components/ui/animated-text";

// Hero slider data
const heroSlides = [
  {
    image: "/Images/annual-day/1.jpg",
    title: "Welcome  to  RP Public School",
    subtitle: "Nurturing Excellence, Building Character, Creating Future Leaders",
    buttons: [
      { text: "Apply Now", link: "/admissions#inquiry", primary: true },
      { text: "Discover More", link: "#about", primary: false }
    ]
  },
  {
    image: "/Images/Hero Images/rpbg2.jpg",
    title: "Excellence  in  Education",
    subtitle: "Modern Facilities, Expert Faculty, and Comprehensive Curriculum",
    buttons: [
      { text: "Academic Programs", link: "/academics", primary: true },
      { text: "View Images", link: "#tour", primary: false }
    ]
  },
  {
    image: "/Images/annual-day/sports.webp",
    title: "Holistic  Development",
    subtitle: "Sports, Arts, and Extracurricular Activities for Well-rounded Growth",
    buttons: [
      { text: "Explore Facilities", link: "/facilities", primary: true },
      { text: "Activities & Clubs", link: "/facilities#activities", primary: false }
    ]
  },
  {
    image: "/Images/annual-day/Skit 1.JPG",
    title: "Welcome  to  RP Public School",
    subtitle: "Nurturing Excellence, Building Character, Creating Future Leaders",
    buttons: [
      { text: "Apply Now", link: "/admissions#inquiry", primary: true },
      { text: "Discover More", link: "#about", primary: false }
    ]
  },
  {
    image: "/Images/students/Arts.jpg",
    title: "Excellence  in  Education",
    subtitle: "Modern Facilities, Expert Faculty, and Comprehensive Curriculum",
    buttons: [
      { text: "Academic Programs", link: "/academics", primary: true },
      { text: "View Images", link: "#tour", primary: false }
    ]
  },
  {
    image: "/Images/students/stu 1.webp",
    title: "Holistic  Development",
    subtitle: "Sports, Arts, and Extracurricular Activities for Well-rounded Growth",
    buttons: [
      { text: "Explore Facilities", link: "/facilities", primary: true },
      { text: "Activities & Clubs", link: "/facilities#activities", primary: false }
    ]
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to go to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  // Function to go to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Function to go to a specific slide
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Setup automatic slide transition
  useEffect(() => {
    slideIntervalRef.current = setInterval(nextSlide, 5000);
    
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, []);

  // Reset interval when slide changes manually
  const handleManualSlideChange = (callback: () => void) => {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }
    callback();
    slideIntervalRef.current = setInterval(nextSlide, 5000);
  };

  return (
    <section className="relative hero-slider overflow-hidden h-[600px] md:h-[600px]">
      <AnimatePresence mode="wait">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 ${index === currentSlide ? "z-10" : "z-0"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="object-cover w-full h-full" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
            
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="container mx-auto px-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
                    <AnimatedText text={slide.title} />
                  </h2>
                  <p className="text-xl md:text-2xl text-white mb-6 max-w-3xl mx-auto">
                    <AnimatedText text={slide.subtitle} type="paragraph" delay={0.4} />
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {slide.buttons.map((button, buttonIndex) => (
                      <motion.div
                        key={buttonIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + buttonIndex * 0.1 }}
                      >
                        <Link 
                          href={button.link} 
                          className={`px-6 py-3 ${
                            button.primary 
                              ? "bg-accent hover:bg-accent-dark" 
                              : "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                          } text-white font-medium rounded-md shadow-md transition inline-block`}
                        >
                          {button.text}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Slider Controls */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
        {heroSlides.map((_, index) => (
          <button 
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white" 
                : "bg-white/50"
            }`}
            onClick={() => handleManualSlideChange(() => goToSlide(index))}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition"
        onClick={() => handleManualSlideChange(prevSlide)}
        aria-label="Previous Slide"
      >
        <FaChevronLeft />
      </button>
      
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition"
        onClick={() => handleManualSlideChange(nextSlide)}
        aria-label="Next Slide"
      >
        <FaChevronRight />
      </button>
    </section>
  );
}
