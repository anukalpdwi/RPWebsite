import { useState } from "react";
import PageHeader from "@/components/ui/page-header";
import SectionTitle from "@/components/ui/section-title";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

// Gallery categories
const categories = [
  {
    id: "all",
    name: "All Photos"
  },
  {
    id: "campus",
    name: "Campus"
  },
  {
    id: "events",
    name: "Events"
  },
  {
    id: "sports",
    name: "Sports"
  },
  {
    id: "activities",
    name: "Activities"
  },
  {
    id: "classroom",
    name: "Classroom"
  }
];

// Gallery images by category
const galleryImages = {
  campus: [
    { src: "/Images/Hero Images/rpbg2.jpg", className: "aspect-square md:aspect-auto md:row-span-2" },
    { src: "/Images/annual-day/Skit 1.JPG", alt: "School Campus" },
    
  ],
  events: [
    { src: "/Images/annual-day/27.jpg", alt: "Annual Day Celebration" },
    { src: "/Images/annual-day/1.jpg", alt: "Annual Day Celebration" },
    { src: "/Images/students/republic1.jpg", alt: "Republic Day" },
    { src: "/Images/students/republic2.jpg", className: "aspect-square md:aspect-auto md:row-span-2" },
    { src: "/Images/annual-day/3.jpg", alt: "Annual Day Celebration" },
    { src: "/Images/annual-day/7.jpg", alt: "Annual Day Celebration" },
    { src: "/Images/annual-day/8.jpg", alt: "Annual Day Celebration", className: "col-span-2" }
  ],
  sports: [
  //   { src: "https://source.unsplash.com/random/600x800/?school,sports", alt: "Sports Day", className: "aspect-square md:aspect-auto md:row-span-2" },
  //   { src: "https://source.unsplash.com/random/600x400/?school,football", alt: "Football Match" },
  //   { src: "https://source.unsplash.com/random/600x400/?school,basketball", alt: "Basketball Tournament" },
  //   { src: "https://source.unsplash.com/random/600x400/?school,athletics", alt: "Athletics Meet" },
  //   { src: "https://source.unsplash.com/random/600x400/?school,swimming", alt: "Swimming Competition" },
  //   { src: "https://source.unsplash.com/random/800x400/?school,volleyball", alt: "Volleyball Match", className: "col-span-2" }
   ],
  activities: [
    { src: "/Images/banner/bg4.jpg", alt: "Art Class" },
    // { src: "https://source.unsplash.com/random/600x400/?music,performance", alt: "Music Performance" },
    // { src: "https://source.unsplash.com/random/600x800/?dance,school", alt: "Dance Performance", className: "aspect-square md:aspect-auto md:row-span-2" },
    // { src: "https://source.unsplash.com/random/600x400/?debate,school", alt: "Debate Competition" },
    // { src: "https://source.unsplash.com/random/600x400/?robotics,school", alt: "Robotics Club" },
    // { src: "https://source.unsplash.com/random/600x400/?drama,school", alt: "Drama Club" },
    // { src: "https://source.unsplash.com/random/800x400/?exhibition,school", alt: "Science Exhibition", className: "col-span-2" }
  ],
  classroom: [
    { src: "/Images/students/class.jpg", alt: "Classroom Learning" },
    // { src: "https://source.unsplash.com/random/600x800/?students,studying", alt: "Students Studying", className: "aspect-square md:aspect-auto md:row-span-2" },
    // { src: "https://source.unsplash.com/random/600x400/?science,experiment", alt: "Science Experiment" },
    // { src: "https://source.unsplash.com/random/600x400/?computer,class", alt: "Computer Class" },
    // { src: "https://source.unsplash.com/random/600x400/?teacher,teaching", alt: "Teacher Teaching" },
    // { src: "https://source.unsplash.com/random/800x400/?group,project", alt: "Group Project", className: "col-span-2" }
  ]
};

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Combine all images for "all" category
  const allImages = [
    ...galleryImages.campus,
    ...galleryImages.events,
    ...galleryImages.sports,
    ...galleryImages.activities,
    ...galleryImages.classroom
  ];
  
  // Get images based on selected category
  const getImagesForCategory = () => {
    if (activeCategory === "all") {
      return allImages;
    }
    return galleryImages[activeCategory as keyof typeof galleryImages] || [];
  };
  
  return (
    <>
      <PageHeader 
        title="School Gallery" 
        description="Explore visual highlights of our campus, events, and student activities"
        breadcrumbs={[{ label: "Gallery" }]}
        backgroundImage="https://source.unsplash.com/random/1800x400/?school,photos"
      />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionTitle 
              title="School Gallery" 
              subtitle="Glimpses of life at RP Public School, capturing moments of learning, growth, and achievement."
            />
            
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
              <TabsList className="w-full flex flex-wrap justify-center">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="px-4 py-2 m-1"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>
          
          <GalleryGrid images={getImagesForCategory()} />
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
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Share Your Memories</h2>
            <p className="max-w-3xl mx-auto mb-8">
              If you have photos from school events, activities, or achievements that you'd like to share in our gallery, please send them to:
            </p>
            <p className="text-xl mb-8">
              <a href="mailto:gallery@rppublicschool.edu.in" className="underline hover:text-accent-light transition">gallery@rppublicschool.edu.in</a>
            </p>
            <p className="text-sm">
              Note: Photos may be reviewed before being added to the official school gallery.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
