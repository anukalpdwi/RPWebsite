import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { queryClient } from "@/lib/queryClient";
import { 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Eye, 
  Search, 
  MoreVertical,
  Download,
  Filter,
  ArrowRight,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  XOctagon,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  School,
  Droplet,
  Briefcase
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function AdmissionsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  const { data: admissions, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/admissions"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/admissions/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/admissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Status Updated",
        description: "The admission inquiry status has been updated successfully.",
      });
      if (selectedInquiry) {
        setSelectedInquiry((prev: any) => ({ ...prev, status: updateStatusMutation.variables?.status }));
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/admissions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/admissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Record Deleted",
        description: "The admission record was permanently removed.",
        variant: "destructive"
      });
      setIsDetailsOpen(false);
    },
  });

  const filteredAdmissions = admissions?.filter(item => 
    item.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.admissionNumber?.toString().includes(searchTerm) ||
    item.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: admissions?.length || 0,
    pending: admissions?.filter(i => i.status === 'pending').length || 0,
    approved: admissions?.filter(i => i.status === 'approved').length || 0,
    rejected: admissions?.filter(i => i.status === 'rejected').length || 0,
  };

  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to permanently delete this application? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewDetails = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setIsDetailsOpen(true);
  };

  const handleExport = () => {
    if (!admissions) return;
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Admission No,Student Name,Grade,Gender,Parent Name,Phone,Email,Status,Date\n" + 
      admissions.map(i => `${i.id},${i.admissionNumber || 'N/A'},${i.childName},${i.grade},${i.gender},${i.fatherName},${i.phone},${i.email},${i.status},${i.submittedAt}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admissions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Admission Management</h1>
            <p className="text-muted-foreground mt-1">Review, approve, and manage new student applications efficiently.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleExport} className="border-slate-200 hover:bg-slate-50 transition-all font-semibold">
              <Download className="w-4 h-4 mr-2 text-slate-500" />
              Export Data
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg active:scale-95 transition-all font-semibold group">
              <PlusIcon className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
              Manual Entry
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Applications" value={stats.total} icon={<Users className="w-5 h-5" />} color="blue" />
          <StatCard title="Pending Review" value={stats.pending} icon={<Clock className="w-5 h-5" />} color="amber" />
          <StatCard title="Approved" value={stats.approved} icon={<CheckCircle className="w-5 h-5" />} color="emerald" />
          <StatCard title="Rejected" value={stats.rejected} icon={<XOctagon className="w-5 h-5" />} color="red" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/40 backdrop-blur-sm">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by name, grade, or inquiry ID..." 
                className="pl-10 bg-white/80 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-lg" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100/80">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-slate-50/50 border-b border-slate-100 tracking-tight text-slate-500 uppercase font-bold text-[11px]">
                  <TableHead className="w-[120px] pl-6 font-extrabold text-slate-400">Application ID</TableHead>
                  <TableHead className="font-extrabold text-slate-400">Student Details</TableHead>
                  <TableHead className="font-extrabold text-slate-400">Applied Grade</TableHead>
                  <TableHead className="font-extrabold text-slate-400">Parent Information</TableHead>
                  <TableHead className="font-extrabold text-slate-400">Status</TableHead>
                  <TableHead className="font-extrabold text-slate-400">Submission Date</TableHead>
                  <TableHead className="text-right pr-6 font-extrabold text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                   Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell colSpan={7} className="h-16 bg-slate-50/30" />
                    </TableRow>
                  ))
                ) : !filteredAdmissions || filteredAdmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-24 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-12 h-12 opacity-10" />
                        <p className="font-medium">No admission applications found matching your criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmissions.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 group">
                      <TableCell className="pl-6">
                        <div className="flex flex-col">
                          <span className="font-black text-primary tracking-tight">#{item.admissionNumber || item.id}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.academicYear}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:scale-105 transition-transform">
                            <AvatarImage src={item.studentPhoto || ""} />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                              {item.childName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{item.childName}</span>
                            <span className="text-[11px] text-slate-500 font-medium">{item.gender}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-2 rounded-md font-bold text-[11px]">
                          {item.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-[11px]">
                          <span className="font-bold text-slate-700">{item.fatherName}</span>
                          <span className="text-slate-500 mt-0.5 flex items-center gap-1 group-hover:text-slate-900 transition-colors">
                            <Phone className="w-2.5 h-2.5" /> {item.phone || item.mobileNo}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="text-slate-400 font-medium text-[11px]">
                        {new Date(item.submittedAt).toLocaleDateString("en-IN", { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                            onClick={() => handleViewDetails(item)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl shadow-2xl border-slate-100">
                               <DropdownMenuItem className="flex items-center gap-2 cursor-pointer p-2 focus:bg-slate-50 rounded-lg text-slate-700 font-medium" onClick={() => handleViewDetails(item)}>
                                <Eye className="w-4 h-4 text-primary" /> View Full Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center gap-2 cursor-pointer p-2 focus:bg-slate-50 rounded-lg text-slate-700 font-medium"
                                onClick={() => window.open(`/api/admission-download/${item.id}`, '_blank')}
                              >
                                <Printer className="w-4 h-4 text-slate-500" /> Generate Official PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {item.status !== 'approved' && (
                                <DropdownMenuItem 
                                  className="flex items-center gap-2 cursor-pointer p-2 focus:bg-emerald-50 rounded-lg text-emerald-600 font-bold"
                                  onClick={() => handleStatusChange(item.id, 'approved')}
                                >
                                  <CheckCircle2 className="w-4 h-4" /> Approve Admission
                                </DropdownMenuItem>
                              )}
                              {item.status !== 'rejected' && (
                                <DropdownMenuItem 
                                  className="flex items-center gap-2 cursor-pointer p-2 focus:bg-red-50 rounded-lg text-red-600 font-bold"
                                  onClick={() => handleStatusChange(item.id, 'rejected')}
                                >
                                  <XCircle className="w-4 h-4" /> Reject Admission
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="flex items-center gap-2 cursor-pointer p-2 focus:bg-red-50 rounded-lg text-red-600 font-bold"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="w-4 h-4" /> Delete Permanently
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Detailed Profile Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-4xl h-[90vh] p-0 overflow-hidden rounded-2xl border-none shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
             {selectedInquiry && (
               <>
                 <div className="bg-slate-900 px-6 py-10 relative overflow-hidden flex-shrink-0">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10" />
                    
                    <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6">
                       <Avatar className="h-32 w-32 border-4 border-white/20 shadow-2xl rounded-2xl">
                          <AvatarImage src={selectedInquiry.studentPhoto || ""} className="object-cover" />
                          <AvatarFallback className="bg-white/10 text-white text-3xl font-bold">
                            {selectedInquiry.childName.charAt(0)}
                          </AvatarFallback>
                       </Avatar>
                       <div className="flex-1 text-center md:text-left space-y-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <h2 className="text-3xl font-black text-white tracking-tight">{selectedInquiry.childName}</h2>
                            <StatusBadge status={selectedInquiry.status} isLg />
                          </div>
                          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/60 text-sm font-medium">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 opacity-70" /> Submitted on {new Date(selectedInquiry.submittedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><School className="w-4 h-4 opacity-70" /> {selectedInquiry.grade}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 opacity-70" /> DOB: {selectedInquiry.dob}</span>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <Button 
                            className="bg-white text-slate-900 hover:bg-slate-100 font-bold"
                            onClick={() => window.open(`/api/admission-download/${selectedInquiry.id}`, '_blank')}
                          >
                             <Printer className="w-4 h-4 mr-2" /> PDF Form
                          </Button>
                       </div>
                    </div>
                 </div>

                 <ScrollArea className="flex-1 px-8 py-8 bg-slate-50/50">
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                       {/* Identity Section */}
                       <div className="space-y-6">
                          <ProfileSection title="Identity & Academics" icon={<User className="w-4 h-4 text-primary" />}>
                             <InfoItem label="Full Name" value={selectedInquiry.childName} />
                             <InfoItem label="Gender" value={selectedInquiry.gender} />
                             <InfoItem label="Date of Birth" value={selectedInquiry.dob} />
                             <InfoItem label="Blood Group" value={selectedInquiry.bloodGroup || "Not Specified"} />
                             <Separator className="my-2 opacity-50" />
                             <InfoItem label="Applying Grade" value={selectedInquiry.grade} highlight />
                             <InfoItem label="Academic Year" value={selectedInquiry.academicYear} />
                             <InfoItem label="Previous School" value={selectedInquiry.previousSchool || "Fresh Admission"} />
                          </ProfileSection>

                          <ProfileSection title="Residential Address" icon={<MapPin className="w-4 h-4 text-primary" />}>
                             <p className="text-sm font-bold text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm leading-relaxed">
                                {selectedInquiry.address}
                             </p>
                          </ProfileSection>
                       </div>

                       {/* Family Section */}
                       <div className="space-y-6">
                          <ProfileSection title="Family Details" icon={<Users className="w-4 h-4 text-primary" />}>
                             <InfoItem label="Father's Name" value={selectedInquiry.fatherName} icon={<User className="w-3 h-3" />} />
                             <InfoItem label="Occupation" value={selectedInquiry.fatherOccupation || "N/A"} icon={<Briefcase className="w-3 h-3" />} />
                             <Separator className="my-2 opacity-50" />
                             <InfoItem label="Mother's Name" value={selectedInquiry.motherName} icon={<User className="w-3 h-3" />} />
                             <InfoItem label="Occupation" value={selectedInquiry.motherOccupation || "N/A"} icon={<Briefcase className="w-3 h-3" />} />
                          </ProfileSection>

                          <ProfileSection title="Contact Information" icon={<Phone className="w-4 h-4 text-primary" />}>
                             <div className="grid grid-cols-1 gap-3">
                                <ContactItem icon={<Phone />} label="Primary Phone" value={selectedInquiry.phone || selectedInquiry.mobileNo} />
                                {selectedInquiry.alternatePhone && <ContactItem icon={<Phone />} label="Alternate" value={selectedInquiry.alternatePhone} />}
                                <ContactItem icon={<Mail />} label="Email Address" value={selectedInquiry.email || selectedInquiry.emailId || "No email provided"} />
                             </div>
                          </ProfileSection>

                          {selectedInquiry.message && (
                            <ProfileSection title="Additional Message" icon={<Briefcase className="w-4 h-4 text-primary" />}>
                               <p className="text-sm italic text-slate-500 bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                                  "{selectedInquiry.message}"
                               </p>
                            </ProfileSection>
                          )}
                       </div>
                    </div>
                 </ScrollArea>

                 <div className="px-8 py-6 border-t bg-white flex flex-col md:flex-row items-center justify-between gap-4 flex-shrink-0">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Process Action:</span>
                       {selectedInquiry.status === 'pending' ? (
                         <div className="flex gap-2">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-6 rounded-lg shadow-lg hover:shadow-emerald-200 transition-all" onClick={() => handleStatusChange(selectedInquiry.id, 'approved')}>
                               <CheckCircle2 className="w-4 h-4 mr-2" /> Approve & Register
                            </Button>
                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 font-bold h-10 px-6 rounded-lg transition-all" onClick={() => handleStatusChange(selectedInquiry.id, 'rejected')}>
                               <XCircle className="w-4 h-4 mr-2" /> Reject Application
                            </Button>
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Currently</span>
                            <StatusBadge status={selectedInquiry.status} />
                            <Button variant="link" size="sm" className="text-xs font-bold text-primary h-auto p-0" onClick={() => handleStatusChange(selectedInquiry.id, 'pending')}>
                               Reset to Pending
                            </Button>
                         </div>
                       )}
                    </div>
                    <Button variant="ghost" className="font-bold text-slate-500 hover:bg-slate-100" onClick={() => setIsDetailsOpen(false)}>
                       Close Profile
                    </Button>
                 </div>
               </>
             )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/50",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50",
    red: "bg-red-50 text-red-600 border-red-100 hover:bg-red-100/50",
  };

  return (
    <Card className={`border shadow-sm hover:shadow-md transition-all overflow-hidden ${colors[color]} group cursor-default`}>
      <CardContent className="p-4 md:p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status, isLg = false }: { status: string; isLg?: boolean }) {
  const styles: Record<string, string> = {
    approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-600 border-red-500/20",
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  };

  const labels: Record<string, string> = {
    approved: "Verified & Approved",
    rejected: "Application Rejected",
    pending: "Review Pending",
  };

  return (
    <span className={`
      inline-flex items-center border font-bold uppercase tracking-widest leading-none text-center
      ${isLg ? 'px-3 py-1.5 text-xs rounded-lg' : 'px-2 py-1 text-[9px] rounded-md'}
      ${styles[status] || styles.pending}
    `}>
      {status === 'approved' && <CheckCircle2 className={`${isLg ? 'w-3.5 h-3.5 mr-1.5' : 'w-2.5 h-2.5 mr-1'} font-black`} />}
      {status === 'rejected' && <XCircle className={`${isLg ? 'w-3.5 h-3.5 mr-1.5' : 'w-2.5 h-2.5 mr-1'} font-black`} />}
      {status === 'pending' && <Clock className={`${isLg ? 'w-3.5 h-3.5 mr-1.5' : 'w-2.5 h-2.5 mr-1'} font-black`} />}
      {labels[status] || labels.pending}
    </span>
  );
}

function ProfileSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
       <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
             {icon}
          </div>
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">{title}</h3>
       </div>
       <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white p-5 space-y-4 shadow-sm ring-1 ring-slate-900/5">
          {children}
       </div>
    </div>
  );
}

function InfoItem({ label, value, icon, highlight = false }: { label: string; value: string; icon?: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1 group">
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
       <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400 group-hover:text-primary transition-colors">{icon}</span>}
          <span className={`text-sm font-bold tracking-tight ${highlight ? 'text-primary text-base font-black' : 'text-slate-700'}`}>{value}</span>
       </div>
    </div>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100 shadow-sm group hover:border-primary/20 transition-all">
       <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
          {cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
       </div>
       <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>
          <span className="text-sm font-bold text-slate-700 leading-none">{value}</span>
       </div>
    </div>
  );
}

import { cloneElement } from "react";
import { PlusIcon } from "lucide-react";
