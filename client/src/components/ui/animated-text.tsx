import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  type?: "heading" | "paragraph";
}

export default function AnimatedText({ text, className = "", delay = 0, type = "heading" }: AnimatedTextProps) {
  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05 + delay,
        duration: 0.5,
      },
    }),
  };

  const paragraphVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.7,
      },
    },
  };

  if (type === "paragraph") {
    return (
      <motion.p
        className={className}
        variants={paragraphVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {text}
      </motion.p>
    );
  }

  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      {text.split(" ").map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-1"
          custom={index}
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
