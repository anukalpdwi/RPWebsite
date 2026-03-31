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
  MoreHorizontal
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
import { useState } from "react";
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

export default function StudentManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

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

  const filteredStudents = students?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this student record? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleExport = () => {
    if (!students) return;
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Roll No,Name,Grade,Gender,D.O.B,Father Name,Mother Name,Phone,Academic Year\n" + 
      students.map(s => `${s.rollNumber},${s.name},${s.grade},${s.gender},${s.dob},${s.fatherName},${s.motherName},${s.parentPhone},${s.academicYear}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading text-primary">Student Records</h1>
            <p className="text-muted-foreground mt-1">Manage all enrolled students, their profiles, and academic status.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" size="sm" onClick={handleExport}>
              <FileDown className="w-4 h-4 mr-2" />
              Export Records
            </Button>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary-dark shadow-sm hover:shadow active:scale-95 transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleAddSubmit}>
                  <DialogHeader>
                    <DialogTitle className="text-xl text-primary font-heading font-bold">Register New Student</DialogTitle>
                    <DialogDescription>Fill in the student's personal and academic details. Fields marked * are required.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-5 py-6 mt-2 border-y">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rollNumber" className="text-xs font-bold uppercase required">Roll Number *</Label>
                        <Input id="rollNumber" required placeholder="e.g. 26001" value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold uppercase">Full Name *</Label>
                        <Input id="name" required placeholder="e.g. Rahul Kumar" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="grade" className="text-xs font-bold uppercase">Class/Grade *</Label>
                        <Input id="grade" required placeholder="e.g. Class 10" value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob" className="text-xs font-bold uppercase">Date of Birth *</Label>
                        <Input id="dob" type="date" required value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-xs font-bold uppercase">Gender *</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" id="gender" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fatherName" className="text-xs font-bold uppercase">Father's Name *</Label>
                        <Input id="fatherName" required value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motherName" className="text-xs font-bold uppercase">Mother's Name *</Label>
                        <Input id="motherName" required value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="parentPhone" className="text-xs font-bold uppercase">Parent Phone *</Label>
                        <Input id="parentPhone" required value={formData.parentPhone} onChange={(e) => setFormData({...formData, parentPhone: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="academicYear" className="text-xs font-bold uppercase">Academic Year *</Label>
                        <Input id="academicYear" required value={formData.academicYear} onChange={(e) => setFormData({...formData, academicYear: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-xs font-bold uppercase">Residential Address *</Label>
                      <Input id="address" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photoUrl" className="text-xs font-bold uppercase cursor-pointer">Photo URL (Drive Link)</Label>
                      <Input id="photoUrl" placeholder="https://drive.google.com/..." value={formData.photoUrl} onChange={(e) => setFormData({...formData, photoUrl: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createMutation.isPending} className="bg-primary hover:bg-primary-dark">
                      {createMutation.isPending ? "Saving..." : "Register Student"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search by name, roll no, or class..." 
                className="pl-10 bg-white" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
               <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">Total: {students?.length || 0}</Badge>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 tracking-tight text-muted-foreground uppercase font-bold text-[11px]">
                  <TableHead className="w-[120px]">Roll Number</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Parent Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                   Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell colSpan={7} className="h-16 bg-slate-50/50" />
                    </TableRow>
                  ))
                ) : !filteredStudents || filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                      No student records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-primary tracking-tighter">
                        {student.rollNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage src={student.photoUrl || ""} />
                            <AvatarFallback className="bg-slate-100 text-slate-400">
                              <UserCircle className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 leading-none">{student.name}</span>
                            <span className="text-[11px] text-muted-foreground mt-1">{student.gender}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold">
                          {student.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700 font-medium tracking-tight">
                        {student.fatherName}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-600">
                        {student.parentPhone}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {student.academicYear}
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="flex items-center justify-end gap-1">
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
      </div>
    </AdminLayout>
  );
}
