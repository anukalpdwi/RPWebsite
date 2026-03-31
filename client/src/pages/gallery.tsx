import { useState } from "react";
import PageHeader from "@/components/ui/page-header";
import SectionTitle from "@/components/ui/section-title";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Image as ImageIcon } from "lucide-react";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const { data: events, isLoading } = useQuery<any[]>({
    queryKey: ["/api/gallery"],
  });

  // Map events to display grid format
  const displayImages = events?.map((event: any) => ({
    src: event.coverImageUrl,
    alt: event.eventName,
    title: event.eventName,
    subtitle: event.eventDate
  })) || [];
  
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
          </motion.div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : displayImages.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <ImageIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
               <h3 className="text-xl font-bold text-slate-600">No Albums Found</h3>
               <p className="text-slate-400">Please check back later or contact administration.</p>
            </div>
          ) : (
            <GalleryGrid images={displayImages} />
          )}
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
