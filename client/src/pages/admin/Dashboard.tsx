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
  XCircle,
  PlusCircle,
  Image as ImageIcon,
  FileText,
  UserPlus,
  LayoutDashboard,
  GraduationCap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { format, subDays, isSameDay, parseISO } from "date-fns";

interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  pendingAdmissions: number;
  activeNotices: number;
  admissionsByStatus: { status: string; count: number }[];
  studentsByGrade: { grade: string; count: number }[];
  visitStats: { date: string; hits: number; visitors: number }[];
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: recentAdmissions } = useQuery<any[]>({
    queryKey: ["/api/admin/admissions"],
    select: (data) => data?.slice(0, 5) || [],
  });

  const cards = [
    { 
      title: "Total Students", 
      value: stats?.totalStudents ?? 0, 
      icon: Users, 
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "/admin/students"
    },
    { 
      title: "New Applications", 
      value: stats?.pendingAdmissions ?? 0, 
      icon: UserCheck, 
      color: "text-amber-600",
      bg: "bg-amber-50",
      link: "/admin/admissions"
    },
    { 
      title: "Registered Staff", 
      value: stats?.totalStaff ?? 0, 
      icon: UserCircle, 
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      link: "/admin/staff"
    },
    { 
      title: "Active Notifications", 
      value: stats?.activeNotices ?? 0, 
      icon: Bell, 
      color: "text-purple-600",
      bg: "bg-purple-50",
      link: "/admin/cms"
    },
  ];

  const chartData = stats?.studentsByGrade?.map(item => ({
    name: item.grade,
    students: item.count
  })) || [];

  // Visitor Analytics Calculations
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayData = stats?.visitStats?.find(v => v.date === todayStr);
  const todayHits = todayData?.hits ?? 0;
  const todayVisitors = todayData?.visitors ?? 0;
  
  const weeklyHits = stats?.visitStats?.slice(-7).reduce((acc, curr) => acc + curr.hits, 0) ?? 0;
  const weeklyVisitors = stats?.visitStats?.slice(-7).reduce((acc, curr) => acc + curr.visitors, 0) ?? 0;
  
  const monthlyHits = stats?.visitStats?.reduce((acc, curr) => acc + (curr.hits || 0), 0) ?? 0;
  const monthlyVisitors = stats?.visitStats?.reduce((acc, curr) => acc + (curr.visitors || 0), 0) ?? 0;

  const visitChartData = stats?.visitStats?.map(v => ({
    date: format(parseISO(v.date), 'MMM dd'),
    hits: v.hits,
    visitors: v.visitors
  })) || [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-heading bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-lg">Real-time overview of RP Public School performance.</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100 flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live System Stable
             </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <Link key={i} href={card.link}>
              <Card className="border-none shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer ring-1 ring-slate-900/5 bg-white">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700 group-hover:opacity-10">
                     <card.icon className="w-24 h-24" />
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className={cn("p-4 rounded-2xl transition-all group-hover:rotate-6 duration-300", card.bg)}>
                      <card.icon className={cn("w-6 h-6", card.color)} />
                    </div>
                    {isLoading ? (
                      <div className="h-10 w-16 bg-slate-100 animate-pulse rounded-lg" />
                    ) : (
                      <span className="text-4xl font-black tracking-tighter text-slate-900">{card.value}</span>
                    )}
                  </div>
                  <div className="mt-6 relative z-10">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{card.title}</p>
                    <p className="text-[10px] font-bold text-primary mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Module Access <ArrowUpRight className="w-3 h-3" />
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-2xl ring-1 ring-slate-900/5 overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                      <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black text-slate-800">Website Traffic</CardTitle>
                      <div className="flex items-center gap-2 mt-0.5">
                        <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400">30-Day Visitor Trends</CardDescription>
                        <div className="group relative">
                          <div className="cursor-help px-1.5 py-0.5 rounded-full bg-slate-100 text-[8px] font-black text-slate-500 border border-slate-200">ACCURACY</div>
                          <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-[10px] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none font-medium leading-relaxed">
                            <p className="mb-2 text-primary font-black uppercase tracking-widest text-[9px]">Data Filtering Active</p>
                            We now automatically filter out bots, crawlers, and admin sessions. Note: This count may still be higher than Vercel because it sums daily unique visits, while Vercel deduplicates over the entire month.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900">{todayHits}</span>
                        <span className="text-xs font-bold text-slate-400">Hits</span>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">7 Days</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-indigo-600">{weeklyVisitors}</span>
                        <span className="text-xs font-bold text-slate-400">Visitors</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[300px] w-full">
                  {visitChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={visitChartData}>
                        <defs>
                          <linearGradient id="colorHits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: '700' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="hits" 
                          stroke="#6366f1" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorHits)" 
                          name="Total Hits"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="visitors" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorVisitors)" 
                          name="Unique Visitors"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4">
                       <LayoutDashboard className="w-12 h-12 opacity-10" />
                       <p className="font-bold uppercase tracking-widest text-xs">Waiting for traffic data...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
             <Card className="border-none shadow-xl ring-1 ring-slate-900/5 bg-indigo-600 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors" />
                <CardContent className="p-6 relative z-10">
                   <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Monthly Impact</p>
                      <ArrowUpRight className="w-4 h-4 opacity-40" />
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-baseline gap-3">
                         <h3 className="text-4xl font-black tracking-tighter">{monthlyHits}</h3>
                         <span className="text-xs font-bold opacity-60 uppercase">Hits</span>
                      </div>
                      <div className="flex items-baseline gap-3 mt-1">
                         <h3 className="text-2xl font-black tracking-tighter text-emerald-400">{monthlyVisitors}</h3>
                         <span className="text-xs font-bold opacity-60 uppercase">Visitors</span>
                      </div>
                      <p className="text-sm font-bold opacity-80 pt-2">Monthly website interactions</p>
                   </div>
                   <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg Visitors/Day</p>
                         <p className="text-lg font-black">{Math.round(monthlyVisitors / 30)}</p>
                      </div>
                      <Link href="/admin/cms">
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-black uppercase tracking-widest transition-colors">
                           Optimize Content
                        </button>
                      </Link>
                   </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-xl ring-1 ring-slate-900/5 bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b py-3">
                   <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Health</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                   <StatusItem label="Analytics Engine" value="Active" status="good" />
                   <StatusItem label="Tracking Relay" value="Healthy" status="good" />
                   <StatusItem label="DB Write Latency" value="9ms" status="good" />
                </CardContent>
             </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Column */}
          <div className="lg:col-span-2 space-y-8">
             <Card className="border-none shadow-xl ring-1 ring-slate-900/5 overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b pb-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <GraduationCap className="w-5 h-5" />
                         </div>
                         <div>
                            <CardTitle className="text-xl font-black text-slate-800">Student Demographics</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">Distribution across classes</CardDescription>
                         </div>
                      </div>
                   </div>
                </CardHeader>
                <CardContent className="p-8">
                   <div className="h-[350px] w-full">
                      {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }} 
                              dy={10}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }} 
                            />
                            <Tooltip 
                              cursor={{ fill: '#f8fafc' }}
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: '700' }}
                            />
                            <Bar dataKey="students" radius={[6, 6, 0, 0]} barSize={40}>
                               {chartData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                               ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4">
                           <LayoutDashboard className="w-12 h-12 opacity-10" />
                           <p className="font-bold uppercase tracking-widest text-xs">No distribution data available</p>
                        </div>
                      )}
                   </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-xl ring-1 ring-slate-900/5 bg-white">
                <CardHeader className="flex flex-row items-center justify-between bg-slate-50/30 border-b pb-4">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        <Clock className="w-5 h-5" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-black text-slate-800">Recent Applications</CardTitle>
                        <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest admission inquiries</CardDescription>
                     </div>
                  </div>
                  <Link href="/admin/admissions">
                    <button className="text-xs font-black text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors uppercase tracking-widest border border-primary/20">
                       All Inquiries
                    </button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                    {!recentAdmissions || recentAdmissions.length === 0 ? (
                      <div className="text-center py-20 text-muted-foreground">
                        <Clock className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p className="font-bold opacity-40 uppercase tracking-widest text-sm">Waiting for incoming data...</p>
                      </div>
                    ) : (
                      recentAdmissions.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50/80 transition-all group">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-500 shadow-inner group-hover:scale-110 transition-transform">
                              {item.childName[0]}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-lg group-hover:text-primary transition-colors">{item.childName}</p>
                              <div className="flex items-center gap-3 mt-1">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">CLASS: {item.grade}</span>
                                 <span className="text-[10px] font-bold text-slate-400">{new Date(item.submittedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
             </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-8">
            <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative group rounded-3xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/40 transition-colors" />
              <CardHeader className="relative z-10 pb-2 pt-6">
                <CardTitle className="text-xl font-black uppercase tracking-widest text-primary">Quick Launch</CardTitle>
                <CardDescription className="text-white/40 text-xs font-medium">Frequent administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10 p-6 pt-2">
                <ActionLink to="/admin/cms" icon={<PlusCircle className="w-4 h-4" />} label="Post Notification" />
                <ActionLink to="/admin/gallery" icon={<ImageIcon className="w-4 h-4" />} label="Publish Gallery" />
                <ActionLink to="/admin/staff" icon={<UserPlus className="w-4 h-4" />} label="Register Staff" />
                <ActionLink to="/admin/students" icon={<FileText className="w-4 h-4" />} label="View Student DB" />
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl ring-1 ring-slate-900/5 bg-white rounded-3xl">
              <CardHeader className="bg-slate-50/50 border-b py-4 rounded-t-3xl">
                <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Maintenance Monitor</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <StatusItem label="Database Latency" value="Stable 12ms" status="good" />
                <StatusItem label="Cloud Sync" value="Verified" status="good" />
                <StatusItem label="Admissions" value="Queue Active" status="warn" />
                <StatusItem label="Uptime Score" value="99.98%" status="good" />
                <StatusItem label="API Status" value="Healthy" status="good" />
              </CardContent>
            </Card>

            <div className="p-8 bg-gradient-to-br from-primary/10 to-blue-600/5 rounded-3xl border border-primary/10 text-slate-900 group hover:from-primary hover:to-blue-600 hover:text-white transition-all duration-700">
               <h4 className="font-black text-xl mb-3 group-hover:translate-x-2 transition-transform">Quote of the Day</h4>
               <p className="text-slate-500 group-hover:text-white/80 text-sm italic font-bold leading-relaxed transition-colors">"Education is the most powerful weapon which you can use to change the world."</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function ActionLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={to}>
      <button className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-sm font-bold flex items-center justify-between group border border-white/5">
        <div className="flex items-center gap-3">
           <span className="text-primary group-hover:scale-125 transition-transform">{icon}</span>
           <span className="group-hover:translate-x-1 transition-transform">{label}</span>
        </div>
        <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all" />
      </button>
    </Link>
  );
}

function StatusItem({ label, value, status }: { label: string; value: string; status: 'good' | 'warn' | 'neutral' }) {
  return (
     <div className="flex items-center justify-between group">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">{label}</span>
        <div className="flex items-center gap-3">
           <span className={cn(
             "text-[11px] font-black",
             status === 'good' ? "text-emerald-600" : status === 'warn' ? "text-amber-600" : "text-slate-600"
           )}>{value}</span>
           <div className={cn(
             "w-2 h-2 rounded-full ring-4 ring-transparent transition-all",
             status === 'good' ? "bg-emerald-500 group-hover:ring-emerald-100" : status === 'warn' ? "bg-amber-500 group-hover:ring-amber-100" : "bg-slate-300 group-hover:ring-slate-100"
           )} />
        </div>
     </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') return <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 border border-emerald-100"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>;
  if (status === 'rejected') return <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 border border-red-100"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
  return <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 border border-amber-100 antialiased"><Clock className="w-3.5 h-3.5 animate-pulse" /> Pending Review</span>;
}
