import PageHeader from "@/components/ui/page-header";
import About from "@/components/home/About";
import MissionVision from "@/components/about/MissionVision";
import History from "@/components/about/History";
import Leadership from "@/components/about/Leadership";
import CounterStats from "@/components/home/CounterStats";

export default function AboutPage() {
  return (
    <>
      <PageHeader 
        title="About Us" 
        description="Learn more about our school's history, mission, vision, and leadership"
        breadcrumbs={[{ label: "About Us" }]}
        backgroundImage="https://www.informalnewz.com/wp-content/uploads/2025/03/School-Admission-1200x675.jpg"
      />
      <About />
      <CounterStats />
      <MissionVision />
      <History />
      <Leadership />
    </>
  );
}
