import Hero from "@/components/home/Hero";
import QuickLinks from "@/components/home/QuickLinks";
import About from "@/components/home/About";
import CounterStats from "@/components/home/CounterStats";
import Programs from "@/components/home/Programs";
import Facilities from "@/components/home/Facilities";
import Faculty from "@/components/home/Faculty";
import Testimonials from "@/components/home/Testimonials";
import Gallery from "@/components/home/Gallery";
import News from "@/components/home/News";
import AdmissionInquiry from "@/components/home/AdmissionInquiry";
import Contact from "@/components/home/Contact";
import StudentNotifications from "@/components/home/StudentNotifications";
import GlobalPopup from "@/components/home/GlobalPopup";

export default function Home() {
  return (
    <>
      <GlobalPopup />
      <Hero />
      <StudentNotifications />
      <QuickLinks />
      <About />
      <CounterStats />
      <Programs />
      <Facilities />
      <Faculty />
      <Testimonials />
      <Gallery />
      <News />
      <AdmissionInquiry />
      <Contact />
    </>
  );
}
