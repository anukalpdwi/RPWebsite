import PageHeader from "@/components/ui/page-header";
import FullAdmissionForm from "@/components/FullAdmissionForm";
import { motion } from "framer-motion";

export default function AdmissionFormPage() {
  return (
    <>
      <div className="print:hidden">
        <PageHeader 
          title="Online Admission Form" 
          description="Complete and submit your ward's admission application online."
          breadcrumbs={[
            { label: "Admissions", link: "/admissions" },
            { label: "Admission Form" }
          ]}
          backgroundImage="https://images.unsplash.com/photo-1454165833767-027558a7fd00?q=80&w=2070&auto=format&fit=crop"
        />
      </div>
      
      <section className="py-12 bg-neutral-light/30 print:bg-transparent print:py-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="print:mt-0"
        >
          <FullAdmissionForm />
        </motion.div>
      </section>
    </>
  );
}
