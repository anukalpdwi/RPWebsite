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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "teaching",
    qualification: "",
    experience: "",
    phone: "",
    email: "",
    photoUrl: ""
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
      toast({
        title: "Staff Member Removed",
        description: "The profile has been successfully deleted.",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/staff", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/staff"] });
      setIsAddModalOpen(false);
      setFormData({
        name: "", role: "", department: "teaching", qualification: "", experience: "", phone: "", email: "", photoUrl: ""
      });
      toast({
        title: "Staff Added",
        description: "New faculty member successfully added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not add staff member. Check fields.",
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
    createMutation.mutate(payload);
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
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary-dark shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Register New Faculty
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Register New Faculty</DialogTitle>
                    <DialogDescription>
                      Add a new member to the school's staff directory.
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
                      <Label htmlFor="department" className="text-right text-xs font-bold uppercase">Type</Label>
                      <select 
                        id="department" 
                        value={formData.department} 
                        onChange={(e) => setFormData({...formData, department: e.target.value})} 
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
                      >
                        <option value="teaching">Teaching Staff</option>
                        <option value="administration">Administration</option>
                        <option value="support">Support Staff</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="qualification" className="text-right text-xs font-bold uppercase">Qualif.</Label>
                      <Input id="qualification" placeholder="e.g. M.Sc, B.Ed" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="photoUrl" className="text-right text-xs font-bold uppercase">Photo URL</Label>
                      <Input id="photoUrl" placeholder="https://..." value={formData.photoUrl} onChange={(e) => setFormData({...formData, photoUrl: e.target.value})} className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Saving..." : "Save Record"}
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
                      <TableRow key={member.id} className="group hover:bg-slate-50 transition-all duration-200">
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="ghost" size="icon" className="h-6 w-6"><MoveUp className="w-3 h-3" /></Button>
                             <Button variant="ghost" size="icon" className="h-6 w-6"><MoveDown className="w-3 h-3" /></Button>
                          </div>
                          <span className="font-bold text-slate-400 group-hover:hidden">{member.order}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                <AvatarImage src={member.photoUrl || ""} />
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
                              <span className="text-[11px] text-muted-foreground mt-1 font-medium">{member.qualification}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-700">
                          {member.role}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-bold text-slate-500 uppercase">{member.experience} EXP</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "font-bold uppercase text-[9px] tracking-widest px-2 py-0.5",
                              member.department === 'teaching' ? "border-blue-200 text-blue-700 bg-blue-50" : "border-slate-200 text-slate-700 bg-slate-50"
                            )}
                          >
                            {member.department}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-6">
                           <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200">
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
