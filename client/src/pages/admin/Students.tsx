import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { queryClient } from "@/lib/queryClient";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  UserCircle,
  FileDown,
  Filter,
  MoreHorizontal,
  LayoutGrid,
  List,
  Eye,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  GraduationCap,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getGoogleDriveDirectLink } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const CLASSES = [
  "Nursery", "LKG", "UKG", 
  "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"
];

export default function StudentManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "classes">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    grade: "",
    dob: "",
    gender: "Male",
    address: "",
    fatherName: "",
    motherName: "",
    parentPhone: "",
    parentEmail: "",
    photoUrl: "",
    academicYear: "2026-27"
  });
  const { toast } = useToast();

  const { data: students, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/students"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = { ...data, photoUrl: getGoogleDriveDirectLink(data.photoUrl) };
      return await apiRequest("POST", "/api/admin/students", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      setIsAddModalOpen(false);
      setFormData({
        rollNumber: "", name: "", grade: "", dob: "", gender: "Male", address: "",
        fatherName: "", motherName: "", parentPhone: "", parentEmail: "", photoUrl: "", academicYear: "2026-27"
      });
      toast({ title: "Student Added Successfully" });
    },
    onError: () => {
      toast({ title: "Operation failed", description: "Ensure roll number is unique.", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      return await apiRequest("PATCH", `/api/admin/students/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      toast({ title: "Student Updated Successfully" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      toast({
        title: "Student Deleted",
        description: "The student record has been removed successfully.",
      });
    },
  });

  const filteredStudents = useMemo(() => {
    return students?.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.grade.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = selectedClass ? item.grade === selectedClass : true;
      
      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, selectedClass]);

  const classStats = useMemo(() => {
    const stats: Record<string, number> = {};
    CLASSES.forEach(c => {
      stats[c] = students?.filter(s => s.grade === c).length || 0;
    });
    return stats;
  }, [students]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this student record? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const handleExport = () => {
    if (!students) return;
    const dataToExport = filteredStudents || students;
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Roll No,Name,Grade,Gender,D.O.B,Father Name,Mother Name,Phone,Academic Year\n" + 
      dataToExport.map(s => `${s.rollNumber},${s.name},${s.grade},${s.gender},${s.dob},${s.fatherName},${s.motherName},${s.parentPhone},${s.academicYear}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_${selectedClass || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Student Records</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor students across all classes (Nursery to 8th).</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" size="sm" onClick={handleExport} className="border-slate-200">
              <FileDown className="w-4 h-4 mr-2" />
              Export List
            </Button>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Register Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
                <form onSubmit={handleAddSubmit}>
                  <DialogHeader>
                    <DialogTitle className="text-xl text-primary font-heading font-extrabold">New Enrollment</DialogTitle>
                    <DialogDescription>Enter the personal and academic profile details for the new student.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-5 py-6 mt-2 border-y border-slate-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rollNumber" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Admission/Roll No *</Label>
                        <Input id="rollNumber" required placeholder="e.g. 26001" value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} className="rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Full Name *</Label>
                        <Input id="name" required placeholder="e.g. Rahul Kumar" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-lg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="grade" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Class/Grade *</Label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-primary/20" 
                          id="grade" required value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})}
                        >
                          <option value="">Select Class</option>
                          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Date of Birth *</Label>
                        <Input id="dob" type="date" required value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Gender *</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="gender" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fatherName" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Father's Name *</Label>
                        <Input id="fatherName" required value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} className="rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motherName" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Mother's Name *</Label>
                        <Input id="motherName" required value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value})} className="rounded-lg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="parentPhone" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Parent Phone *</Label>
                        <Input id="parentPhone" required value={formData.parentPhone} onChange={(e) => setFormData({...formData, parentPhone: e.target.value})} className="rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="academicYear" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Academic Year *</Label>
                        <Input id="academicYear" required value={formData.academicYear} onChange={(e) => setFormData({...formData, academicYear: e.target.value})} className="rounded-lg" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Current Address *</Label>
                      <Input id="address" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photoUrl" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Student Photo (GDrive Link)</Label>
                      <Input id="photoUrl" placeholder="https://drive.google.com/..." value={formData.photoUrl} onChange={(e) => setFormData({...formData, photoUrl: e.target.value})} className="rounded-lg" />
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createMutation.isPending} className="bg-primary hover:bg-primary/90 font-bold px-8">
                      {createMutation.isPending ? "Syncing..." : "Finish Enrollment"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* View Selection & Class Grid */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
            <Button 
              variant={viewMode === "all" ? "secondary" : "ghost"} 
              size="sm" 
              className={cn("rounded-lg font-bold text-xs px-4 shadow-none", viewMode === "all" && "shadow-sm bg-white")}
              onClick={() => { setViewMode("all"); setSelectedClass(null); }}
            >
              <Users className="w-4 h-4 mr-2" /> All Students
            </Button>
            <Button 
              variant={viewMode === "classes" ? "secondary" : "ghost"} 
              size="sm" 
              className={cn("rounded-lg font-bold text-xs px-4 shadow-none", viewMode === "classes" && "shadow-sm bg-white")}
              onClick={() => setViewMode("classes")}
            >
              <LayoutGrid className="w-4 h-4 mr-2" /> By Class
            </Button>
          </div>

          {viewMode === "classes" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-in fade-in zoom-in-95 duration-500">
               {CLASSES.map(c => (
                 <Card 
                    key={c} 
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-all border-slate-100 group relative overflow-hidden",
                      selectedClass === c ? "ring-2 ring-primary border-primary/20 bg-primary/5" : "hover:bg-slate-50"
                    )}
                    onClick={() => { setSelectedClass(selectedClass === c ? null : c); setViewMode("all"); }}
                 >
                   <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
                        selectedClass === c ? "bg-primary text-white" : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                      )}>
                        <GraduationCap className="w-5 h-5 font-black" />
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight">{c}</h3>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{classStats[c]} Students</p>
                      
                      {selectedClass === c && (
                        <div className="absolute top-2 right-2">
                           <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        </div>
                      )}
                   </CardContent>
                 </Card>
               ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/40 backdrop-blur-sm">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input 
                  placeholder="Seach by name or roll no..." 
                  className="pl-10 bg-white/80 border-slate-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {selectedClass && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 py-1.5 px-3 rounded-lg flex gap-2 items-center">
                  <span className="font-black">Class: {selectedClass}</span>
                  <button onClick={() => setSelectedClass(null)} className="hover:text-red-500 transition-colors">
                    <XCircleIcon className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
               <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 py-1 px-3 font-black text-xs">
                {filteredStudents?.length || 0} TOTAL RECORDS
               </Badge>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 border-b border-slate-100 tracking-tight text-slate-500 uppercase font-black text-[11px]">
                  <TableHead className="w-[120px] pl-6">Roll/Adm No</TableHead>
                  <TableHead>Student Identity</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Parent/Guardian</TableHead>
                  <TableHead>Primary Phone</TableHead>
                  <TableHead>Docs Health</TableHead>
                  <TableHead className="text-right pr-6">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                   Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell colSpan={7} className="h-16 bg-slate-50/30" />
                    </TableRow>
                  ))
                ) : !filteredStudents || filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-24 text-slate-400 font-medium">
                      <div className="flex flex-col items-center gap-3">
                         <div className="p-4 bg-slate-50 rounded-full">
                            <Users className="w-10 h-10 opacity-20" />
                         </div>
                         <p>No student records found in this category.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 group">
                      <TableCell className="pl-6 font-black text-primary tracking-tighter">
                        #{student.rollNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:scale-105 transition-transform">
                            <AvatarImage src={student.photoUrl || ""} />
                            <AvatarFallback className="bg-slate-100 text-slate-400 font-black text-xs">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 leading-none group-hover:text-primary transition-colors">{student.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{student.gender}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-black border-none px-2 rounded-md text-[10px] uppercase">
                          {student.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700 font-bold tracking-tight text-sm">
                        {student.fatherName}
                      </TableCell>
                      <TableCell className="text-[11px] font-black text-slate-500 flex items-center gap-1.5 mt-4">
                        <div className="p-1 rounded-md bg-slate-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                           <Phone className="w-2.5 h-2.5" />
                        </div>
                        {student.parentPhone}
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-1">
                            {( [student.aadhaarStatus, student.birthCertStatus, student.tcStatus].filter(s => s === 'missing' || !s).length > 0) ? (
                               <Badge variant="destructive" className="h-5 px-1.5 text-[9px] font-black animate-pulse">
                                  {[student.aadhaarStatus, student.birthCertStatus, student.tcStatus].filter(s => s === 'missing' || !s).length} MISSING
                               </Badge>
                            ) : (
                               <Badge variant="outline" className="h-5 px-1.5 text-[9px] font-black bg-green-50 text-green-700 border-green-100 uppercase">
                                  VERIFIED
                               </Badge>
                            )}
                         </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                         <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-primary hover:bg-primary/10"
                              onClick={() => setLocation(`/admin/students/${student.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(student.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Student Profile Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-4xl h-[90vh] p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col">
              {selectedStudent && (
                <>
                   <div className="bg-slate-900 px-6 py-10 relative overflow-hidden flex-shrink-0">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10" />
                      
                      <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6">
                        <Avatar className="h-32 w-32 border-4 border-white/20 shadow-2xl rounded-2xl">
                            <AvatarImage src={selectedStudent.photoUrl || ""} className="object-cover" />
                            <AvatarFallback className="bg-white/10 text-white text-3xl font-bold">
                              {selectedStudent.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center md:text-left space-y-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                              <h2 className="text-3xl font-black text-white tracking-tight">{selectedStudent.name}</h2>
                              <Badge className="bg-primary/20 text-primary border-primary/30 font-black uppercase tracking-widest text-[10px] px-3 py-1">
                                ACTIVE STUDENT
                              </Badge>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/60 text-sm font-medium">
                                <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> {selectedStudent.grade}</span>
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Roll: {selectedStudent.rollNumber}</span>
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {selectedStudent.academicYear} SESSION</span>
                            </div>
                        </div>
                      </div>
                   </div>

                   <ScrollArea className="flex-1 px-8 py-8 bg-slate-50/50">
                      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="space-y-6">
                           <ProfileSection title="Identity Details" icon={<User className="w-4 h-4 text-primary" />}>
                              <InfoItem label="Full Student Name" value={selectedStudent.name} highlight />
                              <InfoItem label="Date of Birth" value={selectedStudent.dob} />
                              <InfoItem label="Gender" value={selectedStudent.gender} />
                              <InfoItem label="Blood Group" value={selectedStudent.bloodGroup || "Not Specified"} />
                           </ProfileSection>

                           <ProfileSection title="Residential Profile" icon={<MapPin className="w-4 h-4 text-primary" />}>
                              <p className="text-sm font-bold text-slate-700 bg-white p-4 rounded-xl border border-slate-100 leading-relaxed">
                                {selectedStudent.address}
                              </p>
                           </ProfileSection>
                        </div>

                        <div className="space-y-6">
                           <ProfileSection title="Parental Control" icon={<Users className="w-4 h-4 text-primary" />}>
                              <InfoItem label="Father's Name" value={selectedStudent.fatherName} />
                              <InfoItem label="Mother's Name" value={selectedStudent.motherName} />
                           </ProfileSection>

                           <ProfileSection title="Communication" icon={<Phone className="w-4 h-4 text-primary" />}>
                              <div className="space-y-3">
                                 <ContactItem icon={<Phone />} label="Parent Contact" value={selectedStudent.parentPhone} />
                                 <ContactItem icon={<Mail />} label="Email (Office)" value={selectedStudent.parentEmail || "No email records"} />
                              </div>
                           </ProfileSection>
                        </div>
                      </div>
                   </ScrollArea>

                   <div className="px-8 py-6 border-t flex items-center justify-between flex-shrink-0">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         Registered At: {new Date(selectedStudent.admittedAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" className="font-bold border-slate-200" onClick={() => setIsDetailsOpen(false)}>Close View</Button>
                         <Button className="bg-primary hover:bg-primary/90 font-bold shadow-lg">
                           <Edit className="w-4 h-4 mr-2" /> Edit Records
                         </Button>
                      </div>
                   </div>
                </>
              )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

function ProfileSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
       <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
             {icon}
          </div>
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">{title}</h3>
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
       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>
       <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400 group-hover:text-primary transition-colors">{icon}</span>}
          <span className={cn(
            "text-sm font-bold tracking-tight text-slate-700",
            highlight && "text-primary text-base font-black"
          )}>{value}</span>
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

function XCircleIcon({ className }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
  );
}

import { cloneElement } from "react";
