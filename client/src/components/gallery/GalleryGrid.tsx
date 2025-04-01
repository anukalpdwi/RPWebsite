import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "@/components/ui/lightbox";

interface Image {
  src: string;
  alt: string;
  className?: string;
}

interface GalleryGridProps {
  images: Image[];
}

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

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={images.length} // Force re-animation when images change
      >
        {images.map((image, index) => (
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
      
      {images.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg text-gray-500">No images available in this category.</p>
        </motion.div>
      )}
      
      <Lightbox 
        images={images}
        isOpen={lightboxOpen}
        initialIndex={currentImageIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
