import { motion } from "framer-motion";
import { Link } from "wouter";
import { FaHome, FaChevronRight } from "react-icons/fa";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; link?: string }[];
  backgroundImage?: string;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  backgroundImage = "https://source.unsplash.com/random/1800x400/?school,education",
}: PageHeaderProps) {
  return (
    <div className="relative bg-primary py-20 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 text-center">
            {title}
          </h1>

          {description && (
            <p className="text-white/90 text-center max-w-3xl mx-auto mb-6">
              {description}
            </p>
          )}

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center justify-center text-white/80 text-sm">
              <Link href="/">
                <a className="flex items-center hover:text-white">
                  <FaHome className="mr-1" /> Home
                </a>
              </Link>

              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  <FaChevronRight className="mx-2" />
                  {crumb.link ? (
                    <Link href={crumb.link}>
                      <a className="hover:text-white">{crumb.label}</a>
                    </Link>
                  ) : (
                    <span className="text-white">{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
