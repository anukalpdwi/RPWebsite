import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

// Layout components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/TopBar";
import BackToTop from "@/components/ui/backtotop";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import AdmissionPopup from "@/components/ui/AdmissionPopup";

// Pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Academics from "@/pages/academics";
import Admissions from "@/pages/admissions";
import Faculty from "@/pages/faculty";
import Facilities from "@/pages/facilities";
import Gallery from "@/pages/gallery";
import Contact from "@/pages/contact";
import AdmissionFormPage from "@/pages/admission-form";

// Admin Pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdmissionsManager from "@/pages/admin/Admissions";
import StudentManager from "@/pages/admin/Students";
import StaffManager from "@/pages/admin/Staff";
import CMSManager from "@/pages/admin/CMS";
import GalleryManager from "@/pages/admin/Gallery";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/academics" component={Academics} />
      <Route path="/admissions" component={Admissions} />
      <Route path="/faculty" component={Faculty} />
      <Route path="/facilities" component={Facilities} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />
      <Route path="/apply-now" component={AdmissionFormPage} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/admissions">
        <ProtectedRoute>
          <AdmissionsManager />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/students">
        <ProtectedRoute>
          <StudentManager />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/staff">
        <ProtectedRoute>
          <StaffManager />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/news">
        <ProtectedRoute>
          <CMSManager />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/gallery">
        <ProtectedRoute>
          <GalleryManager />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/cms">
        <ProtectedRoute>
          <CMSManager />
        </ProtectedRoute>
      </Route>

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminPath = location.startsWith("/admin");

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col min-h-screen">
          {!isAdminPath && (
            <div className="print:hidden">
              <TopBar />
              <Header />
            </div>
          )}
          <main className="flex-grow">
            <ScrollToTop />
            <Router />
          </main>
          {!isAdminPath && (
            <div className="print:hidden">
              <Footer />
              <BackToTop />
              <WhatsAppButton phoneNumber="9243998770" />
            </div>
          )}
        </div>
        <Toaster />
        <Analytics />
        {!isAdminPath && <AdmissionPopup />}
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
