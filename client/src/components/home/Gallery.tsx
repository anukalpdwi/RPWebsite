import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import Lightbox from "@/components/ui/lightbox";

// Gallery images
const galleryImages = [
  {
    src: "/Images/students/Arts.jpg",
    alt: "Arts and Crafts",
    type: "video",
    className: "aspect-square md:aspect-auto md:row-span-2"
  },
  {
    src: "/Images/Facilities/smart tv.jpg",
    alt: "Classroom Activity"
  },
  {
    src: "/Images/students/stu 1.webp",
    alt: "Science Exhibition"
  },
  {
    src: "/Images/Facilities/Sports.jpg",
    alt: "Sports Event",
    className: "aspect-square md:aspect-auto md:row-span-2"
  },
  {
    src: "/Images/annual-day/27.jpg",
    alt: "Cultural Performance"
  },
  {
    src: "/Images/banner/bg4.jpg",
    alt: "Art Class"
  },
  {
    src: "/Images/students/republic1.jpg",
    alt: "Republic Day Celebration",
    className: "col-span-2"
  },
  {
    src: "/Images/students/republic2.jpg",
    alt: "Republic Day Celebration",
    // className: "aspect-square md:aspect-auto md:row-span-2"
  },
  {
    src: "/Images/Facilities/Computer lab.webp",
    alt: "Computer Lab",
    // className: "aspect-square md:aspect-auto md:row-span-2"
  },
  {
    src: "/Images/students/krishna.jpg",
    alt: "Events and Celebrations",
    type: "video",
    className: "aspect-square md:aspect-auto md:row-span-2"
  },
  {
    src: "/Images/students/arts4.jpg",
    alt: "Arts and Crafts"
  },
  {
    src: "/Images/students/class.jpg",
    alt: "Classroom",
    className: "col-span-2"
  },
  {
    src: "/Images/students/parade.jpg",
    alt: "Parade"
  },
  {
    src: "/Images/students/stu3.jpg",
    alt: "Events and Celebrations",
    className: "aspect-square md:aspect-auto md:row-span-2"
  },
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">School Gallery</h2>
            <div className="h-1 w-20 bg-accent mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto">Glimpses of life at RP Public School, capturing moments of learning, growth, and achievement.</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {galleryImages.map((image, index) => (
            <motion.div 
              key={index}
              className={`gallery-item rounded-lg overflow-hidden shadow-md cursor-pointer ${image.className || ""}`}
              variants={itemVariants}
              onClick={() => openLightbox(index)}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
              />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link 
            href="/gallery" 
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md shadow-md transition"
          >
            View Full Gallery
          </Link>
        </motion.div>
      </div>
      
      <Lightbox 
        images={galleryImages}
        isOpen={lightboxOpen}
        initialIndex={currentImageIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
