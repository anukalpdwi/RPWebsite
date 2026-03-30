import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Users, 
  UserCheck, 
  UserCircle, 
  Bell, 
  ArrowUpRight, 
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XXAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  pendingAdmissions: number;
  activeNotices: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: recentAdmissions } = useQuery<any[]>({
    queryKey: ["/api/admin/admissions"],
    select: (data) => data.slice(0, 5),
  });

  const cards = [
    { 
      title: "Total Students", 
      value: stats?.totalStudents ?? 0, 
      icon: Users, 
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    { 
      title: "New Admissions", 
      value: stats?.pendingAdmissions ?? 0, 
      icon: UserCheck, 
      color: "text-amber-600",
      bg: "bg-amber-100"
    },
    { 
      title: "Staff Members", 
      value: stats?.totalStaff ?? 0, 
      icon: UserCircle, 
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    { 
      title: "Active Notices", 
      value: stats?.activeNotices ?? 0, 
      icon: Bell, 
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">Welcome back. Here's what's happening in RP Public School today.</p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <Card key={i} className="border-none shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110 duration-300", card.bg)}>
                    <card.icon className={cn("w-6 h-6", card.color)} />
                  </div>
                  {isLoading ? (
                    <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
                  ) : (
                    <span className="text-3xl font-bold tracking-tighter">{card.value}</span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{card.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Admissions Feed */}
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold font-heading">Recent Admissions</CardTitle>
              <button className="text-sm font-semibold text-primary hover:underline flex items-center">
                View All <ArrowUpRight className="w-4 h-4 ml-1" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {!recentAdmissions || recentAdmissions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No recent admission activities to show.</p>
                  </div>
                ) : (
                  recentAdmissions.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors border-l-4 border-l-transparent hover:border-l-primary">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                          {item.childName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.childName}</p>
                          <p className="text-xs text-muted-foreground">Class: {item.grade} • {new Date(item.submittedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions / System Info */}
          <div className="space-y-8">
            <Card className="border-none shadow-md bg-gradient-to-br from-primary to-primary-dark text-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold font-heading">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium flex items-center justify-between">
                  Post New Notice <ArrowUpRight className="w-4 h-4" />
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium flex items-center justify-between">
                  Upload Gallery Photos <ArrowUpRight className="w-4 h-4" />
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium flex items-center justify-between">
                  Manage Staff Profiles <ArrowUpRight className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold font-heading">Website Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Server Uptime</span>
                  <span className="font-bold text-emerald-600">99.9%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Live Ticker</span>
                  <span className="flex items-center gap-2 font-bold text-emerald-600">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Update</span>
                  <span className="font-semibold">2 mins ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
  if (status === 'rejected') return <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
  return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
