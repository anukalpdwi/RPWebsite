import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { queryClient } from "@/lib/queryClient";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  UserCircle,
  MoveUp,
  MoveDown,
  Camera,
  Check,
  ChevronRight
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getGoogleDriveDirectLink, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function StaffManager() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "teaching",
    qualification: "",
    experience: "",
    phone: "",
    email: "",
    linkedin: "",
    photoUrl: "",
    bio: "",
    quote: ""
  });

  const { data: staff, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/staff"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/staff/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/staff"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({
        title: "Staff Member Removed",
        description: "The profile has been successfully deleted.",
      });
    },
  });

   const updateMutation = useMutation({
    mutationFn: async ({id, data}: {id: number, data: any}) => {
      return await apiRequest("PATCH", `/api/admin/staff/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/staff"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      setIsModalOpen(false);
      toast({
        title: "Staff Updated",
        description: "Faculty profile successfully updated.",
      });
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/staff", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/staff"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      setIsModalOpen(false);
      setFormData({
        name: "", role: "", department: "teaching", qualification: "", experience: "", phone: "", email: "", linkedin: "", photoUrl: "", bio: "", quote: ""
      });
      toast({
        title: "Staff Added",
        description: "New faculty member successfully added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not save staff member. Check fields.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      photoUrl: getGoogleDriveDirectLink(formData.photoUrl)
    };
    
    if (isEditMode && editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (member: any) => {
    setEditingId(member.id);
    setIsEditMode(true);
    setFormData({
      name: member.name || "",
      role: member.role || "",
      department: member.department || "teaching",
      qualification: member.qualification || "",
      experience: member.experience || "",
      phone: member.phone || "",
      email: member.email || "",
      linkedin: member.linkedin || "",
      photoUrl: member.photoUrl || "",
      bio: member.bio || "",
      quote: member.quote || ""
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setIsEditMode(false);
    setFormData({
      name: "", role: "", department: "teaching", qualification: "", experience: "", phone: "", email: "", linkedin: "", photoUrl: "", bio: "", quote: ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the staff records?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">Staff & Faculty Directory</h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium uppercase tracking-wider opacity-70">Internal Management Portal</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary-dark shadow-md" onClick={handleAddNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Register New Faculty
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? "Update Faculty Profile" : "Register New Faculty"}</DialogTitle>
                    <DialogDescription>
                      {isEditMode ? "Modify the details of an existing faculty member." : "Add a new member to the school's staff directory."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right text-xs font-bold uppercase">Name</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right text-xs font-bold uppercase">Designation</Label>
                      <Input id="role" placeholder="e.g. Mathematics Teacher" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right text-xs font-bold uppercase">Department</Label>
                      <select 
                        id="department" 
                        value={formData.department} 
                        onChange={(e) => setFormData({...formData, department: e.target.value})} 
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
                      >
                        <option value="administration">Administration</option>
                        <option value="sciences">Sciences</option>
                        <option value="mathematics">Mathematics</option>
                        <option value="languages">Languages</option>
                        <option value="socialStudies">Social Studies</option>
                        <option value="computerScience">Computer Science</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="qualification" className="text-xs font-bold uppercase">Qualification</Label>
                        <Input id="qualification" placeholder="e.g. M.Sc, B.Ed" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-xs font-bold uppercase">Experience</Label>
                        <Input id="experience" placeholder="e.g. 15 Years" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold uppercase">Email</Label>
                        <Input id="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="text-xs font-bold uppercase">LinkedIn</Label>
                        <Input id="linkedin" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photoUrl" className="text-xs font-bold uppercase">Photo URL</Label>
                      <Input id="photoUrl" placeholder="Google Drive Link..." value={formData.photoUrl} onChange={(e) => setFormData({...formData, photoUrl: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-xs font-bold uppercase">Biography</Label>
                      <textarea 
                        id="bio" 
                        value={formData.bio} 
                        onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Write a short professional bio..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quote" className="text-xs font-bold uppercase">Personal Quote</Label>
                      <Input id="quote" placeholder="Education is..." value={formData.quote} onChange={(e) => setFormData({...formData, quote: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : "Save Record"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 tracking-tight text-muted-foreground uppercase font-bold text-[11px]">
                    <TableHead className="w-[80px] text-center">Order</TableHead>
                    <TableHead>Faculty Member</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right px-6">Management Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                     Array(4).fill(0).map((_, i) => (
                      <TableRow key={i} className="animate-pulse">
                        <TableCell colSpan={6} className="h-16 bg-slate-50/30" />
                      </TableRow>
                    ))
                  ) : !staff || staff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-20 text-muted-foreground italic font-medium">
                        No staff members currently registered.
                      </TableCell>
                    </TableRow>
                  ) : (
                    staff.map((member, index) => (
                      <TableRow key={member.id} className="group hover:bg-slate-50 transition-colors duration-200">
                        <TableCell className="text-center relative w-20 h-16">
                           <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-inherit">
                              <Button variant="ghost" size="icon" className="h-6 w-6"><MoveUp className="w-3 h-3 text-slate-500" /></Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6"><MoveDown className="w-3 h-3 text-slate-500" /></Button>
                           </div>
                           <span className="font-bold text-slate-400 group-hover:opacity-0 transition-opacity">{member.order}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                <AvatarImage src={member.photoUrl ?? undefined} />
                                <AvatarFallback className="bg-slate-200 text-slate-500">
                                  <UserCircle className="w-6 h-6" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                                <Check className="w-2 h-2 text-white" />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 leading-none">{member.name}</span>
                              <span className="text-[11px] text-muted-foreground mt-1 font-medium">{member.qualification ?? ""}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-700">
                          {member.role}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-bold text-slate-500 uppercase">{member.experience ?? "N/A"} EXP</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "font-bold uppercase text-[9px] tracking-widest px-2 py-0.5",
                              member.department === 'administration' ? "border-amber-200 text-amber-700 bg-amber-50" :
                              member.department === 'sciences' ? "border-blue-200 text-blue-700 bg-blue-50" :
                              member.department === 'mathematics' ? "border-emerald-200 text-emerald-700 bg-emerald-50" :
                              member.department === 'computerScience' ? "border-indigo-200 text-indigo-700 bg-indigo-50" :
                              "border-slate-200 text-slate-700 bg-slate-50"
                            )}
                          >
                            {member.department ?? "STAFF"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-6">
                           <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                                onClick={() => handleEdit(member)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                onClick={() => handleDelete(member.id, member.name)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900 rounded-lg transition-colors">
                                <ChevronRight className="w-4 h-4" />
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
      </div>
    </AdminLayout>
  );
}
