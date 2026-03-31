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
import { getGoogleDriveDirectLink } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function CMSManager() {
  const { toast } = useToast();
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isSliderModalOpen, setIsSliderModalOpen] = useState(false);

  const [newsForm, setNewsForm] = useState({ content: "", priority: "normal", isActive: true });
  const [sliderForm, setSliderForm] = useState({ title: "", description: "", imageUrl: "", isActive: true, order: 0 });
  
  // Existing Popup Form State
  const [popupForm, setPopupForm] = useState({ title: "Admissions Open 2026-27", linkUrl: "/apply-now", imageUrl: "Join RP Public School - Where Excellence is a Habit.", isActive: true, type: "text" });

  const { data: news, isLoading: newsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/news"],
  });

  const { data: sliders, isLoading: slidersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/sliders"],
  });

  const { data: popups, isLoading: popupsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/popups"],
  });

  // Mutations
  const createNewsMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/admin/news", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      setIsNewsModalOpen(false);
      setNewsForm({ content: "", priority: "normal", isActive: true });
      toast({ title: "News Added" });
    }
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: number) => await apiRequest("DELETE", `/api/admin/news/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] }); }
  });

  const toggleNewsMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number, isActive: boolean }) => await apiRequest("PATCH", `/api/admin/news/${id}`, { isActive }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] }); }
  });

  const createSliderMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = { ...data, imageUrl: getGoogleDriveDirectLink(data.imageUrl) };
      return await apiRequest("POST", "/api/admin/sliders", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sliders"] });
      setIsSliderModalOpen(false);
      setSliderForm({ title: "", description: "", imageUrl: "", isActive: true, order: 0 });
      toast({ title: "Slider Added" });
    }
  });

  const deleteSliderMutation = useMutation({
    mutationFn: async (id: number) => await apiRequest("DELETE", `/api/admin/sliders/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/sliders"] }); }
  });

  const handleSavePopup = () => {
    const payload = { ...popupForm, imageUrl: getGoogleDriveDirectLink(popupForm.imageUrl) };
    if (popups && popups.length > 0) {
      apiRequest("PATCH", `/api/admin/popups/${popups[0].id}`, payload).then(() => {
        toast({ title: "Popup Updated" });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/popups"] });
      });
    } else {
      apiRequest("POST", "/api/admin/popups", payload).then(() => {
        toast({ title: "Popup Created" });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/popups"] });
      });
    }
  };

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
                <Dialog open={isNewsModalOpen} onOpenChange={setIsNewsModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary hover:bg-primary-dark">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New News
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add News Ticker Item</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Input value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} placeholder="Announcement text" />
                      </div>
                      <div className="space-y-2">
                         <Label>Priority</Label>
                         <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newsForm.priority} onChange={e => setNewsForm({...newsForm, priority: e.target.value})}>
                            <option value="normal">Normal</option>
                            <option value="high">High (Red)</option>
                         </select>
                      </div>
                    </div>
                    <DialogFooter>
                       <Button onClick={() => createNewsMutation.mutate(newsForm)}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                             <Label className="text-xs font-bold text-slate-500 uppercase cursor-pointer">Active Status</Label>
                             <Switch checked={item.isActive} onCheckedChange={(checked) => toggleNewsMutation.mutate({ id: item.id, isActive: checked })} />
                          </div>
                          <div className="flex items-center gap-1">
                             <Button onClick={() => {if(window.confirm('Delete?')) deleteNewsMutation.mutate(item.id)}} variant="ghost" size="icon" className="h-9 w-9 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
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
               <Dialog open={isSliderModalOpen} onOpenChange={setIsSliderModalOpen}>
                  <DialogTrigger asChild>
                     <Card className="shadow-md border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 min-h-[300px] hover:bg-slate-100/80 transition-colors cursor-pointer group">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Plus className="w-8 h-8 text-primary" />
                        </div>
                        <p className="mt-4 font-bold text-slate-600">Add New Slider Image</p>
                     </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add Slider</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input value={sliderForm.imageUrl} onChange={e => setSliderForm({...sliderForm, imageUrl: e.target.value})} placeholder="https://..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Title Label</Label>
                        <Input value={sliderForm.title} onChange={e => setSliderForm({...sliderForm, title: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input value={sliderForm.description} onChange={e => setSliderForm({...sliderForm, description: e.target.value})} />
                      </div>
                    </div>
                    <DialogFooter>
                       <Button onClick={() => createSliderMutation.mutate(sliderForm)}>Save Slider</Button>
                    </DialogFooter>
                  </DialogContent>
               </Dialog>

               {sliders?.map((slider) => (
                 <Card key={slider.id} className="border-none shadow-md overflow-hidden group">
                   <div className="relative h-48 overflow-hidden bg-slate-200">
                     <img src={slider.imageUrl} alt={slider.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                     <div className="absolute top-3 right-3 flex gap-2">
                       <Button onClick={() => {if(window.confirm('Delete?')) deleteSliderMutation.mutate(slider.id)}} variant="destructive" size="icon" className="h-8 w-8 rounded-full shadow-md"><Trash2 className="w-4 h-4" /></Button>
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
                            <Input id="popup-title" value={popupForm.title} onChange={e => setPopupForm({...popupForm, title: e.target.value})} className="font-bold border-slate-300" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="popup-content">Promotional Message</Label>
                            <Input id="popup-content" value={popupForm.imageUrl} onChange={e => setPopupForm({...popupForm, imageUrl: e.target.value})} className="font-medium border-slate-300" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="popup-link">Redirection Link</Label>
                            <Input id="popup-link" value={popupForm.linkUrl} onChange={e => setPopupForm({...popupForm, linkUrl: e.target.value})} className="text-primary font-bold border-slate-300 shadow-inner bg-slate-50/50" />
                          </div>
                          <div className="flex items-center gap-4 pt-4 border-t">
                            <div className="flex-1 flex items-center gap-3">
                               <Switch checked={popupForm.isActive} onCheckedChange={checked => setPopupForm({...popupForm, isActive: checked})} />
                               <Label className="font-bold text-slate-700">Display Popup to Visitors</Label>
                            </div>
                            <Button className="bg-primary hover:bg-primary-dark" onClick={handleSavePopup}>
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
                             <p className="font-bold text-slate-800 text-lg">{popupForm.title || "Admissions Open 2026-27"}</p>
                             <p className="text-xs text-muted-foreground mt-2 font-medium">{popupForm.imageUrl || "Join RP Public School - Where Excellence is a Habit."}</p>

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
