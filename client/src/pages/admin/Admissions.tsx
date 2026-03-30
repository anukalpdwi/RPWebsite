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
  ArrowRight
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

export default function AdmissionsManager() {
  const [searchTerm, setSearchTerm] = useState("");
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
        description: "The admission inquiry has been updated.",
      });
    },
  });

  const filteredAdmissions = admissions?.filter(item => 
    item.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.admissionNumber?.toString().includes(searchTerm)
  );

  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
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
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">Admission Management</h1>
            <p className="text-muted-foreground mt-1">Review, approve, and manage new student applications.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary-dark">
              New Application
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search by name or admission no..." 
                className="pl-10 bg-white" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-slate-500">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto text-sm">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-slate-50/80 tracking-tight text-muted-foreground uppercase font-bold text-[11px]">
                  <TableHead className="w-[100px]">Adm No.</TableHead>
                  <TableHead>Student Details</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Parent Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted On</TableHead>
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
                ) : !filteredAdmissions || filteredAdmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                      No applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmissions.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-primary">
                        {item.admissionNumber || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{item.childName}</span>
                          <span className="text-xs text-muted-foreground">{item.gender}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold">
                          {item.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs">
                          <span className="font-medium">{item.fatherName}</span>
                          <span className="text-muted-foreground">{item.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {new Date(item.submittedAt).toLocaleDateString("en-IN", { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                              <Eye className="w-4 h-4 text-blue-500" /> View Detailed Form
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => window.open(`/api/admission-download/${item.id}`, '_blank')}
                            >
                              <Printer className="w-4 h-4 text-slate-500" /> Print PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {item.status !== 'approved' && (
                              <DropdownMenuItem 
                                className="flex items-center gap-2 cursor-pointer text-emerald-600 font-semibold"
                                onClick={() => handleStatusChange(item.id, 'approved')}
                              >
                                <CheckCircle2 className="w-4 h-4" /> Approve Admission
                              </DropdownMenuItem>
                            )}
                            {item.status !== 'rejected' && (
                              <DropdownMenuItem 
                                className="flex items-center gap-2 cursor-pointer text-red-600 font-semibold"
                                onClick={() => handleStatusChange(item.id, 'rejected')}
                              >
                                <XCircle className="w-4 h-4" /> Reject Admission
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') return <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Approved</span>;
  if (status === 'rejected') return <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">Rejected</span>;
  return <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider text-center">Pending Review</span>;
}
