import { useCounter } from "@/hooks/use-counter";
import { motion } from "framer-motion";

// Stats data
const stats = [
  { value: 1500, label: "Students" },
  { value: 120, label: "Expert Faculty" },
  { value: 25, label: "Years of Excellence" },
  { value: 50, label: "Extracurricular Activities" }
];

export default function CounterStats() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <StatCounter value={stat.value} label={stat.label} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface StatCounterProps {
  value: number;
  label: string;
}

function StatCounter({ value, label }: StatCounterProps) {
  const counter = useCounter({
    end: value,
    duration: 2,
    viewportMargin: "-100px"
  });

  return (
    <div>
      <div className="text-4xl font-bold mb-2">{counter}</div>
      <p className="text-lg">{label}</p>
    </div>
  );
}
