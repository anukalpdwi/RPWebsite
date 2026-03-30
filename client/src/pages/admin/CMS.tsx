import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { queryClient } from "@/lib/queryClient";
import { 
  Newspaper, 
  Image as ImageIcon, 
  MousePointer2, 
  Plus, 
  Trash2, 
  Edit,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Info
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function CMSManager() {
  const { toast } = useToast();

  const { data: news, isLoading: newsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/news"],
  });

  const { data: sliders, isLoading: slidersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/sliders"],
  });

  const { data: popups, isLoading: popupsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/popups"],
  });

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">Website Content Management</h1>
          <p className="text-muted-foreground mt-2 font-medium">Control dynamic content elements visible across the public website.</p>
        </div>

        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="bg-slate-100 p-1 border h-auto flex flex-wrap gap-1">
            <TabsTrigger value="news" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-6">
              <Newspaper className="w-4 h-4 mr-2" />
              News Ticker
            </TabsTrigger>
            <TabsTrigger value="sliders" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-6">
              <ImageIcon className="w-4 h-4 mr-2" />
              Hero Sliders
            </TabsTrigger>
            <TabsTrigger value="popups" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-6">
              <MousePointer2 className="w-4 h-4 mr-2" />
              Global Popups
            </TabsTrigger>
          </TabsList>

          {/* News Ticker Tab */}
          <TabsContent value="news" className="space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
                <div>
                  <CardTitle className="text-xl font-bold font-heading">Announcements & Ticker</CardTitle>
                  <CardDescription>Manage the scrolling text on the website header.</CardDescription>
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary-dark">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New News
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {!news || news.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground italic">No active announcements.</div>
                  ) : (
                    news.map((item) => (
                      <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className={item.isActive ? "text-emerald-600" : "text-slate-300"}>
                            <Info className="w-6 h-6 mt-1" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-lg leading-tight">{item.content}</p>
                            <div className="flex items-center gap-3 mt-2">
                               <Badge variant={item.type === 'primary' ? 'default' : 'secondary'} className="text-[10px] font-bold uppercase py-0 px-2 leading-tight tracking-wider">
                                 {item.type}
                               </Badge>
                               <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                                 <Clock className="w-3 h-3" />
                                 Created {new Date(item.createdAt).toLocaleDateString()}
                               </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3 pr-6 border-r">
                             <Label htmlFor={`active-${item.id}`} className="text-xs font-bold text-slate-500 uppercase tracking-tighter cursor-pointer">Active Status</Label>
                             <Switch id={`active-${item.id}`} checked={item.isActive} />
                          </div>
                          <div className="flex items-center gap-1">
                             <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
                             <Button variant="ghost" size="icon" className="h-9 w-9 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hero Sliders Tab */}
          <TabsContent value="sliders" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               <Card className="shadow-md border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 min-h-[300px] hover:bg-slate-100/80 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <p className="mt-4 font-bold text-slate-600">Add New Slider Image</p>
                  <p className="text-[11px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">Recommended: 1920x800 PX</p>
               </Card>

               {sliders?.map((slider) => (
                 <Card key={slider.id} className="border-none shadow-md overflow-hidden group">
                   <div className="relative h-48 overflow-hidden bg-slate-200">
                     <img src={slider.imageUrl} alt={slider.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                     <div className="absolute top-3 right-3 flex gap-2">
                       <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-md backdrop-blur-md bg-white/80"><Edit className="w-4 h-4" /></Button>
                       <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full shadow-md"><Trash2 className="w-4 h-4" /></Button>
                     </div>
                   </div>
                   <CardHeader className="p-5">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold font-heading line-clamp-1">{slider.title}</CardTitle>
                        <Badge className="font-bold text-[9px] uppercase tracking-tighter">Order {slider.order}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2 mt-2">{slider.subtitle}</CardDescription>
                   </CardHeader>
                   <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Visibility</Label>
                        <Switch checked />
                      </div>
                      <span className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer">
                        Preview Slider <ExternalLink className="w-3 h-3" />
                      </span>
                   </CardFooter>
                 </Card>
               ))}
            </div>
          </TabsContent>

          {/* Global Popups Tab */}
          <TabsContent value="popups" className="space-y-6">
             <div className="max-w-4xl mx-auto space-y-6">
                <Card className="border-none shadow-lg border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold font-heading">Admission Promotion Popup</CardTitle>
                    <CardDescription>Configure the main admission alert that appears for first-time visitors.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="popup-title">Popup Header Title</Label>
                            <Input id="popup-title" defaultValue="Admissions Open 2026-27" className="font-bold border-slate-300" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="popup-content">Promotional Message</Label>
                            <Input id="popup-content" defaultValue="Join RP Public School - Where Excellence is a Habit." className="font-medium border-slate-300" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="popup-link">Redirection Link</Label>
                            <Input id="popup-link" defaultValue="/apply-now" className="text-primary font-bold border-slate-300 shadow-inner bg-slate-50/50" />
                          </div>
                          <div className="flex items-center gap-4 pt-4 border-t">
                            <div className="flex-1 flex items-center gap-3">
                               <Switch id="popup-active" checked />
                               <Label htmlFor="popup-active" className="font-bold text-slate-700">Display Popup to Visitors</Label>
                            </div>
                            <Button className="bg-primary hover:bg-primary-dark">
                              <Save className="w-4 h-4 mr-2" />
                              Save & Publish
                            </Button>
                          </div>
                       </div>
                       <div className="bg-slate-100 rounded-xl p-6 flex items-center justify-center relative overflow-hidden border border-dashed border-slate-300 min-h-[300px] group">
                          <div className="absolute inset-0 bg-primary/5 dark:bg-slate-900 group-hover:bg-primary/10 transition-colors" />
                          <div className="relative z-10 w-full max-w-[280px] bg-white rounded-lg shadow-2xl p-5 border-t-4 border-t-primary scale-95 origin-center transform transition-transform group-hover:scale-100 duration-500">
                             <div className="w-10 h-10 rounded bg-primary/10 mb-3 flex items-center justify-center">
                                <Plus className="w-5 h-5 text-primary" />
                             </div>
                             <p className="font-bold text-slate-800 text-lg">Admissions Open 2026-27</p>
                             <p className="text-xs text-muted-foreground mt-2 font-medium">Join RP Public School - Where Excellence is a Habit.</p>
                             <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                                <div className="h-8 w-full bg-primary rounded flex items-center justify-center text-[10px] text-white font-bold uppercase tracking-wider">APPLY NOW</div>
                                <div className="h-8 w-full bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">LATER</div>
                             </div>
                          </div>
                          <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Live Preview Placeholder</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
