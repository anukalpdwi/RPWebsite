import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, User, Phone, MapPin, Droplets, HeartPulse, ShieldAlert,
  FileCheck, FileWarning, Wallet, History, Plus, FileText, Download,
  CheckCircle2, AlertCircle, AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useState } from "react";
import { Student, StudentAcademic, StudentFeeSummary, FeeTransaction } from "@shared/schema";

interface StudentDetails {
  student: Student;
  academics: StudentAcademic[];
  feeSummary: StudentFeeSummary;
  feeTransactions: FeeTransaction[];
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export default function StudentDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // State for document edit dialog
  const [docEditing, setDocEditing] = useState<string | null>(null);
  const [docUrlInput, setDocUrlInput] = useState("");
  const [docStatusInput, setDocStatusInput] = useState("missing");

  // State for fee transaction dialog
  const [isFeeDialogOpen, setIsFeeDialogOpen] = useState(false);
  const [feeForm, setFeeForm] = useState({
    amount: "",
    paymentMethod: "Cash",
    category: "Monthly Tuition",
    refId: ""
  });

  const { data: details, isLoading, error } = useQuery<StudentDetails>({
    queryKey: [`/api/admin/students/${id}/details`],
    enabled: !!id
  });

  const updateDocsMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/admin/students/${id}/documents`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/students/${id}/details`] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      toast({ title: "Documents Updated", description: "Student records have been saved successfully." });
      setDocEditing(null);
    }
  });

  const generateFeeReceipt = (transaction: any) => {
     toast({ 
        title: "Receipt Generation", 
        description: `Downloading receipt for Transaction Ref: ${transaction.refId || 'N/A'}` 
     });
  };

  const addFeeMutation = useMutation({
    mutationFn: async (data: any) => {
      const amountNum = parseInt(data.amount);
      if (isNaN(amountNum) || amountNum <= 0) throw new Error("Please enter a valid amount.");

      // Step 1: Record the transaction
      const txRes = await apiRequest("POST", `/api/admin/students/${id}/fees`, {
        ...data,
        amount: amountNum, // Send as integer
      });
      const transaction = await txRes.json();

      // Step 2: Update the fee summary balance
      const summary = details?.feeSummary;
      if (summary) {
        await apiRequest("PATCH", `/api/admin/students/${id}/fees/summary`, {
          academicYear: summary.academicYear,
          totalPaid: (summary.totalPaid || 0) + amountNum,
          balance: (summary.totalAnnualFees || 0) - ((summary.totalPaid || 0) + amountNum),
        });
      }

      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/students/${id}/details`] });
      toast({ title: "✅ Transaction Recorded", description: "Fee ledger has been updated successfully." });
      setIsFeeDialogOpen(false);
      setFeeForm({ amount: "", paymentMethod: "Cash", category: "Monthly Tuition", refId: "" });
    },
    onError: (error: any) => {
      toast({ 
        title: "❌ Transaction Failed", 
        description: error.message || "Could not record payment. Please try again.", 
        variant: "destructive" 
      });
    }
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-red-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <h2 className="font-bold text-lg">Error Loading Profile</h2>
          <p className="text-sm">{(error as Error).message}</p>
        </div>
      </AdminLayout>
    );
  }

  if (!details || !details.student) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-slate-500">Student not found.</div>
      </AdminLayout>
    );
  }

  const { student, academics, feeSummary, feeTransactions } = details;

  const missingDocsCount = [student.aadhaarStatus, student.birthCertStatus, student.tcStatus].filter(s => s === 'missing').length;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto pb-12">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => setLocation("/admin/students")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {student.name}
              {missingDocsCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  <AlertTriangle className="h-3 w-3 mr-1"/> {missingDocsCount} Missing Doc(s)
                </Badge>
              )}
            </h1>
            <p className="text-slate-500 font-medium">Class {student.grade} | Roll No: {student.rollNumber}</p>
          </div>
        </div>

        <Tabs defaultValue="identity" className="w-full">
          <TabsList className="w-full justify-start h-12 bg-slate-100/50 p-1 rounded-lg mb-6">
            <TabsTrigger value="identity" className="data-[state=active]:bg-white h-10 px-6">Identity & Bio</TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-white h-10 px-6">
              Document Vault
              {missingDocsCount > 0 && <span className="ml-2 w-2 h-2 rounded-full bg-red-500 inline-block"/>}
            </TabsTrigger>
            <TabsTrigger value="academics" className="data-[state=active]:bg-white h-10 px-6">Academic Timeline</TabsTrigger>
            <TabsTrigger value="fees" className="data-[state=active]:bg-white h-10 px-6">Fee Ledger</TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 shadow-sm border-slate-200/60 h-fit">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-32 h-32 rounded-xl bg-slate-100 flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-sm">
                    {student.photoUrl ? (
                       <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover object-top" />
                    ) : (
                       <User className="h-12 w-12 text-slate-300" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{student.name}</CardTitle>
                  <CardDescription>Academic Year {student.academicYear}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500">DOB</span>
                     <span className="font-medium text-slate-900">{format(new Date(student.dob), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500">Gender</span>
                     <span className="font-medium text-slate-900">{student.gender}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 flex items-center"><Droplets className="h-3 w-3 mr-1 text-red-500"/> Blood Grp</span>
                     <span className="font-medium text-slate-900">{student.bloodGroup || 'Not Specified'}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2 space-y-6">
                 <Card className="shadow-sm border-slate-200/60">
                    <CardHeader>
                       <CardTitle className="text-lg flex items-center gap-2"><User className="h-4 w-4 text-blue-500"/> Guardianship Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                       <div>
                          <Label className="text-xs text-slate-500 mb-1 block">Father's Name</Label>
                          <div className="font-medium">{student.fatherName}</div>
                       </div>
                       <div>
                          <Label className="text-xs text-slate-500 mb-1 block">Mother's Name</Label>
                          <div className="font-medium">{student.motherName}</div>
                       </div>
                       <div>
                          <Label className="text-xs text-slate-500 mb-1 block">Primary Contact</Label>
                          <div className="font-medium flex items-center gap-2"><Phone className="h-3 w-3 text-slate-400"/> {student.parentPhone}</div>
                       </div>
                       <div>
                          <Label className="text-xs text-slate-500 mb-1 block">Email Address</Label>
                          <div className="font-medium">{student.parentEmail || 'N/A'}</div>
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="shadow-sm border-slate-200/60 border-l-4 border-l-orange-400">
                    <CardHeader className="pb-3">
                       <CardTitle className="text-lg flex items-center gap-2"><HeartPulse className="h-4 w-4 text-orange-500"/> Emergency & Location</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="bg-orange-50/50 p-4 rounded-lg flex items-start gap-3">
                          <ShieldAlert className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                             <h4 className="font-semibold text-orange-900 text-sm">Emergency Contact</h4>
                             <p className="text-orange-800 font-medium">{student.emergencyContact || 'Pending Setup'}</p>
                          </div>
                       </div>
                       <div>
                          <Label className="text-xs text-slate-500 mb-1 block">Residential Address</Label>
                          <div className="font-medium flex items-start gap-2">
                             <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0"/>
                             <span className="leading-relaxed">{student.address}</span>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6 animate-in fade-in-50 duration-500">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <div>
                      <h2 className="text-lg font-bold">Verified Document Vault</h2>
                      <p className="text-sm text-slate-500">Upload links and manage lifecycle records.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                      { id: 'aadhaar', title: 'Student Aadhaar Card', status: student.aadhaarStatus, url: student.aadhaarUrl },
                      { id: 'birthCert', title: 'Birth Certificate', status: student.birthCertStatus, url: student.birthCertUrl },
                      { id: 'tc', title: 'Transfer Certificate (TC)', status: student.tcStatus, url: student.tcUrl }
                   ].map((doc) => (
                      <div key={doc.id} className={`rounded-xl border p-5 flex flex-col ${doc.status === 'missing' ? 'bg-red-50/30 border-red-100' : 'bg-green-50/30 border-green-100'}`}>
                         <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${doc.status === 'missing' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                               {doc.status === 'missing' ? <FileWarning className="h-5 w-5"/> : <FileCheck className="h-5 w-5"/>}
                            </div>
                            <Badge variant={doc.status === 'missing' ? 'destructive' : 'default'} className={doc.status === 'verified' ? 'bg-green-600 hover:bg-green-600' : ''}>
                               {doc.status.toUpperCase()}
                            </Badge>
                         </div>
                         <h3 className="font-semibold text-slate-900 mb-1">{doc.title}</h3>
                         <p className="text-xs text-slate-500 mb-4 flex-grow">
                            {doc.url ? 'Document link is attached and vault-secured.' : 'No document link provided yet.'}
                         </p>
                         
                         <Dialog open={docEditing === doc.id} onOpenChange={(open) => {
                            if(open){
                               setDocEditing(doc.id);
                               setDocUrlInput(doc.url || "");
                               setDocStatusInput(doc.status);
                            } else {
                               setDocEditing(null);
                            }
                         }}>
                            <DialogTrigger asChild>
                               <Button variant="outline" className="w-full bg-white text-xs">{doc.url ? 'Update Document' : 'Upload Link'}</Button>
                            </DialogTrigger>
                            <DialogContent>
                               <DialogHeader>
                                  <DialogTitle>Update {doc.title}</DialogTitle>
                               </DialogHeader>
                               <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                     <Label>Status</Label>
                                     <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={docStatusInput} 
                                        onChange={(e) => setDocStatusInput(e.target.value)}
                                     >
                                        <option value="missing">Missing</option>
                                        <option value="verified">Verified</option>
                                     </select>
                                  </div>
                                  <div className="space-y-2">
                                     <Label>Document Link / URL</Label>
                                     <Input value={docUrlInput} onChange={(e) => setDocUrlInput(e.target.value)} placeholder="https://drive.google.com/..."/>
                                  </div>
                               </div>
                               <DialogFooter>
                                  <Button onClick={() => updateDocsMutation.mutate({
                                     [`${doc.id}Status`]: docStatusInput,
                                     [`${doc.id}Url`]: docUrlInput
                                  })}>Save Changes</Button>
                               </DialogFooter>
                            </DialogContent>
                         </Dialog>

                         {doc.url && (
                           <Button variant="link" className="w-full mt-2 h-auto text-xs py-1" onClick={() => window.open(doc.url, "_blank")}>
                              View Document
                           </Button>
                         )}
                      </div>
                   ))}
                </div>
             </div>
          </TabsContent>

          <TabsContent value="academics" className="space-y-6 animate-in fade-in-50 duration-500">
             <Card className="border-slate-200/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                   <div>
                      <CardTitle className="text-lg">Progress Reports</CardTitle>
                      <CardDescription>Academic history and milestones.</CardDescription>
                   </div>
                   <Button variant="outline" className="gap-2"><Plus className="h-4 w-4"/> Add Record</Button>
                </CardHeader>
                <CardContent>
                   {academics.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                         <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                            <FileText className="h-6 w-6 text-slate-400" />
                         </div>
                         <h3 className="text-sm font-semibold text-slate-900">No Academic Records</h3>
                         <p className="text-xs text-slate-500 mt-1">This student's academic timeline is empty.</p>
                      </div>
                   ) : (
                     <div className="relative border-l-2 border-slate-100 ml-3 md:ml-6 mt-4 opacity-50">
                        <div className="mb-8 ml-6 relative">
                           <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white" />
                           <h4 className="font-semibold text-slate-900">End of Feature - UI Placeholder</h4>
                        </div>
                     </div>
                   )}
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="fees" className="space-y-6 animate-in fade-in-50 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900 text-white shadow-xl">
                   <CardHeader className="pb-2">
                      <CardDescription className="text-slate-300">Total Annual Fees</CardDescription>
                      <CardTitle className="text-3xl tracking-tight">{feeSummary ? formatINR(feeSummary.totalAnnualFees) : '₹0'}</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="text-sm text-slate-400 flex justify-between items-end">
                         <span>AY {feeSummary?.academicYear || student.academicYear}</span>
                         <Wallet className="h-5 w-5 opacity-50"/>
                      </div>
                   </CardContent>
                </Card>
                
                <Card className="border-green-100 bg-green-50/30">
                   <CardHeader className="pb-2">
                      <CardDescription className="text-green-700 font-medium">Total Paid</CardDescription>
                      <CardTitle className="text-3xl tracking-tight text-green-900">{feeSummary ? formatINR(feeSummary.totalPaid) : '₹0'}</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="text-sm text-green-600/70 flex justify-between items-end">
                         <span>Cumulative receipts</span>
                         <CheckCircle2 className="h-5 w-5 opacity-50"/>
                      </div>
                   </CardContent>
                </Card>

                <Card className="border-blue-100 bg-blue-50/30">
                   <CardHeader className="pb-2">
                      <CardDescription className="text-blue-700 font-medium">Current Balance</CardDescription>
                      <CardTitle className="text-3xl tracking-tight text-blue-900">{feeSummary ? formatINR(feeSummary.balance) : '₹0'}</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="text-sm text-blue-600/70 flex justify-between items-end">
                         <span>Pending dues</span>
                         <AlertCircle className="h-5 w-5 opacity-50"/>
                      </div>
                   </CardContent>
                </Card>
             </div>

             <Card className="border-slate-200/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                   <div>
                      <CardTitle className="text-lg flex items-center gap-2"><History className="h-4 w-4"/> Payment Transaction Log</CardTitle>
                      <CardDescription>Chronological history of all payments acting as the absolute source of truth.</CardDescription>
                   </div>
                   
                   <Dialog open={isFeeDialogOpen} onOpenChange={setIsFeeDialogOpen}>
                      <DialogTrigger asChild>
                         <Button className="bg-slate-900 gap-2"><Plus className="h-4 w-4"/> Record Payment</Button>
                      </DialogTrigger>
                      <DialogContent>
                         <DialogHeader>
                            <DialogTitle>Record New Payment</DialogTitle>
                         </DialogHeader>
                         <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <Label>Amount (₹)</Label>
                                  <Input type="number" placeholder="2000" value={feeForm.amount} onChange={e => setFeeForm({...feeForm, amount: e.target.value})}/>
                               </div>
                               <div className="space-y-2">
                                  <Label>Payment Method</Label>
                                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                          value={feeForm.paymentMethod} onChange={e => setFeeForm({...feeForm, paymentMethod: e.target.value})}>
                                     <option>Cash</option>
                                     <option>UPI</option>
                                     <option>Bank Transfer</option>
                                     <option>Check</option>
                                  </select>
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <Label>Category</Label>
                                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                          value={feeForm.category} onChange={e => setFeeForm({...feeForm, category: e.target.value})}>
                                     <option>Monthly Tuition</option>
                                     <option>Admission Fee</option>
                                     <option>Exam Fee</option>
                                     <option>Bus Fee</option>
                                     <option>Other</option>
                                  </select>
                               </div>
                               <div className="space-y-2">
                                  <Label>Ref ID / Auth Code</Label>
                                  <Input placeholder="UPI Ref / Receipt No" value={feeForm.refId} onChange={e => setFeeForm({...feeForm, refId: e.target.value})}/>
                               </div>
                            </div>
                         </div>
                         <DialogFooter>
                            <Button 
                               disabled={!feeForm.amount || addFeeMutation.isPending} 
                               onClick={() => addFeeMutation.mutate(feeForm)}
                            >
                               {addFeeMutation.isPending ? 'Processing...' : 'Confirm Receipt'}
                            </Button>
                         </DialogFooter>
                      </DialogContent>
                   </Dialog>

                </CardHeader>
                <CardContent>
                   <div className="rounded-md border border-slate-200 overflow-hidden">
                      <Table>
                         <TableHeader className="bg-slate-50">
                            <TableRow>
                               <TableHead>Date & Time</TableHead>
                               <TableHead>Category</TableHead>
                               <TableHead>Method & Ref</TableHead>
                               <TableHead>Status</TableHead>
                               <TableHead className="text-right">Amount</TableHead>
                               <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                         </TableHeader>
                         <TableBody>
                            {feeTransactions.length === 0 ? (
                               <TableRow>
                                  <TableCell colSpan={6} className="text-center py-8 text-slate-500 font-medium">No transactions recorded yet.</TableCell>
                               </TableRow>
                            ) : (
                               feeTransactions.map((tx: any) => (
                                  <TableRow key={tx.id}>
                                     <TableCell className="font-medium whitespace-nowrap">
                                        {format(new Date(tx.paymentDate), 'dd MMM yyyy')}
                                        <div className="text-xs text-slate-500 font-normal">{format(new Date(tx.paymentDate), 'hh:mm a')}</div>
                                     </TableCell>
                                     <TableCell>{tx.category}</TableCell>
                                     <TableCell>
                                        <div className="flex items-center gap-2">
                                           <Badge variant="outline" className="bg-slate-50 text-slate-700">{tx.paymentMethod}</Badge>
                                           <span className="text-xs font-mono text-slate-500">{tx.refId || '-'}</span>
                                        </div>
                                     </TableCell>
                                     <TableCell>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{tx.status}</Badge>
                                     </TableCell>
                                     <TableCell className="text-right font-bold text-slate-900">{formatINR(tx.amount)}</TableCell>
                                     <TableCell>
                                         <Button variant="ghost" size="icon" onClick={() => generateFeeReceipt(tx)} title="Download Receipt">
                                            <Download className="h-4 w-4 text-slate-400 hover:text-blue-600"/>
                                         </Button>
                                     </TableCell>
                                  </TableRow>
                               ))
                            )}
                         </TableBody>
                      </Table>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>

      </div>
    </AdminLayout>
  );
}
