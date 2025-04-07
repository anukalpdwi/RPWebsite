import PageHeader from "@/components/ui/page-header";
import Programs from "@/components/home/Programs";
import Curriculum from "@/components/academics/Curriculum";
import Departments from "@/components/academics/Departments";
import Calendar from "@/components/academics/Calendar";

export default function AcademicsPage() {
  return (
    <>
      <PageHeader 
        title="Academics" 
        description="Explore our comprehensive academic programs, curriculum, teaching methodology, and educational resources"
        breadcrumbs={[{ label: "Academics" }]}
        backgroundImage="https://www.theindianschool.in/uploads/posts/L-16972674476964-pre-primary-magic-years-main.jpg"
      />
      <Programs />
      <Curriculum />
      <Departments />
      <Calendar />
    </>
  );
}
