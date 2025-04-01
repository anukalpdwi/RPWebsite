import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  center = true,
  className = "",
}: SectionTitleProps) {
  return (
    <motion.div
      className={`mb-12 ${center ? "text-center" : ""} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
        {title}
      </h2>
      <div className={`h-1 w-20 bg-accent mb-6 ${center ? "mx-auto" : ""}`}></div>
      {subtitle && <p className={`max-w-3xl ${center ? "mx-auto" : ""}`}>{subtitle}</p>}
    </motion.div>
  );
}
