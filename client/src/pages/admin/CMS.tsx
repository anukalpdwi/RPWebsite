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
  Info,
  Bell
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
import { motion, AnimatePresence } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { MediaLibraryPicker } from "@/components/admin/MediaLibraryPicker";
import { useState } from "react";

export default function CMSManager() {
  const { toast } = useToast();
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isSliderModalOpen, setIsSliderModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const [editingNews, setEditingNews] = useState<any>(null);
  const [editingSlider, setEditingSlider] = useState<any>(null);
  const [editingGallery, setEditingGallery] = useState<any>(null);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const [newsForm, setNewsForm] = useState({ content: "", priority: "normal", isActive: true, imageUrl: "", linkUrl: "" });
  const [sliderForm, setSliderForm] = useState({ title: "", description: "", imageUrl: "", isActive: true, order: 0 });
  const [galleryForm, setGalleryForm] = useState({ eventName: "", description: "", eventDate: "", coverImageUrl: "" });
  const [studentForm, setStudentForm] = useState({ content: "", isActive: true });
  
  // Existing Popup Form State
  const [popupForm, setPopupForm] = useState({ 
    title: "Admissions Open 2026-27", 
    linkUrl: "/apply-now", 
    imageUrl: "Join RP Public School - Where Excellence is a Habit.", 
    isActive: true, 
    type: "text",
    startDate: "",
    endDate: ""
  });

  const { data: news, isLoading: newsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/news"],
  });

  const { data: sliders, isLoading: slidersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/sliders"],
  });

  const { data: popups, isLoading: popupsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/popups"],
  });

  const { data: notificationsData, isLoading: studentLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/student-notifications"],
  });

  const { data: galleryEvents, isLoading: galleryLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/gallery"],
  });

  // Mutations
  const createGalleryMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/admin/gallery", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      setIsGalleryModalOpen(false);
      setGalleryForm({ eventName: "", description: "", eventDate: "", coverImageUrl: "" });
      toast({ title: "Gallery Event Added" });
    }
  });

  const updateGalleryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => await apiRequest("PATCH", `/api/admin/gallery/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      setEditingGallery(null);
      toast({ title: "Gallery Event Updated" });
    }
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: number) => await apiRequest("DELETE", `/api/admin/gallery/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] }); }
  });

  const createNewsMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/admin/news", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      setIsNewsModalOpen(false);
      setNewsForm({ content: "", priority: "normal", isActive: true, imageUrl: "", linkUrl: "" });
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

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const payload = { ...data, imageUrl: data.imageUrl ? getGoogleDriveDirectLink(data.imageUrl) : "" };
      return await apiRequest("PATCH", `/api/admin/news/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      setEditingNews(null);
      toast({ title: "News Updated" });
    }
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

  const updateSliderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const payload = { ...data, imageUrl: getGoogleDriveDirectLink(data.imageUrl) };
      return await apiRequest("PATCH", `/api/admin/sliders/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sliders"] });
      setEditingSlider(null);
      toast({ title: "Slider Updated" });
    }
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/admin/student-notifications", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/student-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/student-notifications"] });
      setIsStudentModalOpen(false);
      setStudentForm({ content: "", isActive: true });
      toast({ title: "Update Added" });
    },
    onError: (error: Error) => {
      console.error("CREATE_STUDENT_ERROR:", error);
      toast({ 
        title: "Failed to Add", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => await apiRequest("PATCH", `/api/admin/student-notifications/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/student-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/student-notifications"] });
      setEditingStudent(null);
      toast({ title: "Update Modified" });
    }
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: number) => await apiRequest("DELETE", `/api/admin/student-notifications/${id}`),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["/api/admin/student-notifications"] }); 
      queryClient.invalidateQueries({ queryKey: ["/api/student-notifications"] }); 
    }
  });

  const handleSavePopup = () => {
    const payload = { ...popupForm };
    // Image URL text for popup might already be the text subtitle or media string, no hack needed.
    // Ensure properly saved.
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
            <TabsTrigger value="gallery" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-6">
              <ImageIcon className="w-4 h-4 mr-2 text-primary" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="popups" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-6">
              <MousePointer2 className="w-4 h-4 mr-2" />
              Global Popups
            </TabsTrigger>
            <TabsTrigger value="student-updates" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-6">
              <Bell className="w-4 h-4 mr-2" />
              Student Updates
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
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary-dark text-white font-bold"
                      disabled={(news?.length || 0) >= 50}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {(news?.length || 0) >= 50 ? "Limit Reached (50)" : "Add New News"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border sm:max-w-[500px]">
                    <DialogHeader><DialogTitle className="text-xl font-bold">Add News Ticker Item</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Input value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} placeholder="Announcement text" />
                      </div>
                      <div className="space-y-2">
                         <Label>Thumbnail Image URL (Optional Google Drive Link)</Label>
                         <div className="flex gap-2">
                           <Input 
                             value={newsForm.imageUrl} 
                             onChange={e => setNewsForm({...newsForm, imageUrl: e.target.value})} 
                             placeholder="https://drive.google.com/..." 
                             className="flex-1"
                           />
                           <MediaLibraryPicker 
                             onSelect={(url) => setNewsForm({...newsForm, imageUrl: url})}
                             trigger={<Button variant="secondary" size="icon"><Plus className="w-4 h-4"/></Button>}
                           />
                         </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Action Link URL (Optional)</Label>
                        <Input value={newsForm.linkUrl} onChange={e => setNewsForm({...newsForm, linkUrl: e.target.value})} placeholder="https://..." />
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
                       <Button className="text-white font-bold" onClick={() => createNewsMutation.mutate({...newsForm, imageUrl: newsForm.imageUrl ? getGoogleDriveDirectLink(newsForm.imageUrl) : ""})}>
                         Save Ticker
                       </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {!news || news.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground italic">No active announcements.</div>
                  ) : (
                    news.map((item, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={item.id} 
                        className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all border-b last:border-0 group glass-morphism mb-1 rounded-lg mx-2"
                      >
                        <div className="flex items-start gap-4">
                          <div className={item.isActive ? "text-emerald-600 bg-emerald-50 p-2 rounded-full" : "text-slate-300 bg-slate-50 p-2 rounded-full"}>
                            <Info className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-lg leading-tight group-hover:text-primary transition-colors">{item.content}</p>
                            <div className="flex items-center gap-3 mt-2">
                               <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className={`text-[10px] font-bold uppercase py-0 px-2 leading-tight tracking-wider ${item.priority === 'high' ? 'animate-pulse' : ''}`}>
                                 {item.priority}
                               </Badge>
                               <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                                 <Clock className="w-3 h-3" />
                                 {new Date(item.createdAt).toLocaleDateString()}
                               </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-3 pr-4 border-r">
                             <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</Label>
                             <Switch 
                               checked={item.isActive} 
                               onCheckedChange={(checked) => toggleNewsMutation.mutate({ id: item.id, isActive: checked })} 
                               className="data-[state=checked]:bg-emerald-500 scale-90"
                             />
                          </div>
                          <div className="flex items-center gap-1">
                             <Button onClick={() => setEditingNews(item)} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/5"><Edit className="w-4 h-4" /></Button>
                             <Button onClick={() => {if(window.confirm('Delete item?')) deleteNewsMutation.mutate(item.id)}} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Dialog open={!!editingNews} onOpenChange={(open) => !open && setEditingNews(null)}>
              <DialogContent className="bg-white/95 backdrop-blur-xl border border-white/20 sm:max-w-[500px] shadow-2xl">
                <DialogHeader><DialogTitle className="text-2xl font-black text-primary tracking-tight">Edit Announcement</DialogTitle></DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message Content</Label>
                    <Input value={editingNews?.content} onChange={e => setEditingNews({...editingNews, content: e.target.value})} className="border-slate-200 focus:ring-primary shadow-sm h-12 text-lg font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Drive Image URL</Label>
                     <div className="flex gap-2">
                       <Input value={editingNews?.imageUrl} onChange={e => setEditingNews({...editingNews, imageUrl: e.target.value})} className="border-slate-200 h-10 flex-1" />
                       <MediaLibraryPicker 
                         onSelect={(url) => setEditingNews({...editingNews, imageUrl: url})}
                         trigger={<Button variant="outline" size="sm" className="h-10"><ImageIcon className="w-4 h-4 mr-2"/> Library</Button>}
                       />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Priority</Label>
                      <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium" value={editingNews?.priority} onChange={e => setEditingNews({...editingNews, priority: e.target.value})}>
                        <option value="normal">Normal</option>
                        <option value="high">High (Attention)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setEditingNews(null)}>Cancel</Button>
                  <Button className="text-white font-bold px-8 bg-primary hover:bg-primary-dark" onClick={() => updateNewsMutation.mutate({ id: editingNews.id, data: editingNews })}>
                    Update Announcement
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Hero Sliders Tab */}
          <TabsContent value="sliders" className="space-y-6">
            <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pointer-events-${(sliders?.length || 0) >= 50 ? "none" : "auto"} opacity-${(sliders?.length || 0) >= 50 ? "50" : "100"}`}>
               <Dialog open={isSliderModalOpen} onOpenChange={setIsSliderModalOpen}>
                  <DialogTrigger asChild>
                     <Card className="glass-card shadow-xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center p-8 min-h-[300px] group cursor-pointer hover:bg-primary/10 transition-all rounded-2xl">
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                          <Plus className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="mt-6 text-xl font-black text-slate-800 tracking-tight">
                          {(sliders?.length || 0) >= 50 ? "Storage Full" : "New Hero Slide"}
                        </h3>
                        <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mt-2 bg-primary/10 px-3 py-1 rounded-full">
                          {sliders?.length || 0} / 50 Active
                        </p>
                     </Card>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 sm:max-w-[500px]">
                    <DialogHeader><DialogTitle className="text-xl font-bold">Add Slider Hero Image</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Hero Image Asset (Google Drive URL)</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={sliderForm.imageUrl} 
                            onChange={e => setSliderForm({...sliderForm, imageUrl: e.target.value})} 
                            placeholder="https://drive.google.com/..." 
                            className="flex-1"
                          />
                          <MediaLibraryPicker 
                            onSelect={(url) => setSliderForm({...sliderForm, imageUrl: url})}
                            trigger={<Button variant="secondary" size="icon"><Plus className="w-4 h-4"/></Button>}
                          />
                        </div>
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
                       <Button className="text-white font-bold bg-primary hover:bg-primary-dark" onClick={() => createSliderMutation.mutate(sliderForm)}>Save Slider</Button>
                    </DialogFooter>
                  </DialogContent>
               </Dialog>

               {sliders?.map((slider, idx) => (
                 <motion.div
                   key={slider.id}
                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   transition={{ delay: idx * 0.1 }}
                 >
                   <Card className="glass-card border-none shadow-xl overflow-hidden group rounded-2xl">
                     <div className="relative h-56 overflow-hidden bg-slate-900">
                       <img 
                         src={slider.imageUrl} 
                         alt={slider.title} 
                         className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                       
                       {/* Status Badge */}
                       <div className="absolute top-4 left-4">
                         <Badge className={`${slider.isActive ? 'bg-emerald-500' : 'bg-slate-500'} text-white font-black text-[10px] py-1 px-3 rounded-md uppercase tracking-widest shadow-lg`}>
                           {slider.isActive ? "Live Now" : "Hidden"}
                         </Badge>
                       </div>
                       
                       <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                         <Button onClick={() => setEditingSlider(slider)} variant="secondary" size="icon" className="h-10 w-10 rounded-xl shadow-xl bg-white/90 backdrop-blur-sm text-primary hover:bg-white hover:scale-105 transition-all"><Edit className="w-4 h-4" /></Button>
                         <Button onClick={() => {if(window.confirm('Delete slider?')) deleteSliderMutation.mutate(slider.id)}} variant="destructive" size="icon" className="h-10 w-10 rounded-xl shadow-xl hover:scale-105 transition-all"><Trash2 className="w-4 h-4" /></Button>
                       </div>

                       <div className="absolute bottom-4 left-4 right-4">
                         <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Display Order {slider.order}</p>
                         <h4 className="text-lg font-black text-white tracking-tight line-clamp-1">{slider.title}</h4>
                       </div>
                     </div>
                     <CardHeader className="p-5 bg-white dark:bg-slate-950">
                         <CardDescription className="line-clamp-2 min-h-[40px] font-medium leading-relaxed">{slider.description}</CardDescription>
                     </CardHeader>
                     <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Switch 
                            checked={slider.isActive} 
                            onCheckedChange={(checked) => updateSliderMutation.mutate({ id: slider.id, data: { ...slider, isActive: checked } })}
                            className="data-[state=checked]:bg-emerald-500 scale-90" 
                          />
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Status</Label>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary/40 group-hover:text-primary transition-colors cursor-pointer">
                          <span className="text-[10px] font-black uppercase tracking-widest">Details</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                     </CardFooter>
                   </Card>
                 </motion.div>
               ))}
            </div>

            {/* Slider Edit Dialog */}
            <Dialog open={!!editingSlider} onOpenChange={(open) => !open && setEditingSlider(null)}>
              <DialogContent className="bg-white/95 backdrop-blur-xl border border-white/20 sm:max-w-[500px] p-0 overflow-hidden shadow-2xl rounded-2xl">
                 <div className="relative h-40 bg-slate-900">
                    {editingSlider?.imageUrl && (
                      <img src={getGoogleDriveDirectLink(editingSlider.imageUrl)} className="w-full h-full object-cover opacity-50" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <DialogHeader><DialogTitle className="text-3xl font-black text-white tracking-tighter drop-shadow-lg">Edit Hero Content</DialogTitle></DialogHeader>
                    </div>
                 </div>
                 <div className="p-6 space-y-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Image Asset (Drive Link)</Label>
                      <div className="flex gap-2">
                        <Input value={editingSlider?.imageUrl} onChange={e => setEditingSlider({...editingSlider, imageUrl: e.target.value})} className="border-slate-200 h-11 transition-all focus:ring-primary shadow-sm flex-1" />
                        <MediaLibraryPicker 
                          onSelect={(url) => setEditingSlider({...editingSlider, imageUrl: url})}
                          trigger={<Button variant="outline" className="h-11"><ImageIcon className="w-4 h-4 mr-2"/> Library</Button>}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Main Heading</Label>
                        <Input value={editingSlider?.title} onChange={e => setEditingSlider({...editingSlider, title: e.target.value})} className="border-slate-200 h-11" />
                      </div>
                      <div className="space-y-2 col-span-2 md:col-span-1">
                         <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Order</Label>
                         <Input type="number" value={editingSlider?.order} onChange={e => setEditingSlider({...editingSlider, order: parseInt(e.target.value)})} className="border-slate-200 h-11" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Subtext Description</Label>
                      <Input value={editingSlider?.description} onChange={e => setEditingSlider({...editingSlider, description: e.target.value})} className="border-slate-200 h-20" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                       <Button variant="ghost" onClick={() => setEditingSlider(null)} className="font-bold">Discard</Button>
                       <Button className="bg-primary hover:bg-primary-dark text-white font-bold px-10 rounded-xl shadow-lg shadow-primary/20" onClick={() => updateSliderMutation.mutate({ id: editingSlider.id, data: editingSlider })}>
                         Save Changes
                       </Button>
                    </div>
                 </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pointer-events-${(galleryEvents?.length || 0) >= 100 ? "none" : "auto"} opacity-${(galleryEvents?.length || 0) >= 100 ? "50" : "100"}`}>
               <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
                  <DialogTrigger asChild>
                     <Card className="glass-card shadow-xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center p-8 min-h-[300px] group cursor-pointer hover:bg-primary/10 transition-all rounded-2xl">
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                          <Plus className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="mt-6 text-xl font-black text-slate-800 tracking-tight">Create New Album</h3>
                        <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mt-2 bg-primary/10 px-3 py-1 rounded-full">
                          {galleryEvents?.length || 0} Events Created
                        </p>
                     </Card>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 sm:max-w-[500px]">
                    <DialogHeader><DialogTitle className="text-xl font-bold">New Gallery Event</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Event Name</Label>
                        <Input value={galleryForm.eventName} onChange={e => setGalleryForm({...galleryForm, eventName: e.target.value})} placeholder="e.g. Annual Sports Meet 2026" />
                      </div>
                      <div className="space-y-2">
                        <Label>Event Date</Label>
                        <Input value={galleryForm.eventDate} onChange={e => setGalleryForm({...galleryForm, eventDate: e.target.value})} placeholder="e.g. March 15, 2026" />
                      </div>
                      <div className="space-y-2">
                        <Label>Cover Image Asset</Label>
                        <div className="flex gap-2">
                           <Input 
                             value={galleryForm.coverImageUrl} 
                             onChange={e => setGalleryForm({...galleryForm, coverImageUrl: e.target.value})} 
                             placeholder="Google Drive URL or Upload..." 
                             className="flex-1"
                           />
                           <MediaLibraryPicker 
                             onSelect={(url) => setGalleryForm({...galleryForm, coverImageUrl: url})}
                             trigger={<Button variant="secondary" size="icon" className="shrink-0"><Plus className="w-4 h-4"/></Button>}
                           />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input value={galleryForm.description} onChange={e => setGalleryForm({...galleryForm, description: e.target.value})} />
                      </div>
                    </div>
                    <DialogFooter>
                       <Button className="text-white font-bold bg-primary hover:bg-primary-dark w-full" onClick={() => createGalleryMutation.mutate(galleryForm)}>Create Event Album</Button>
                    </DialogFooter>
                  </DialogContent>
               </Dialog>

               {galleryEvents?.map((event, idx) => (
                 <motion.div
                   key={event.id}
                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   transition={{ delay: idx * 0.1 }}
                 >
                   <Card className="glass-card border-none shadow-xl overflow-hidden group rounded-2xl relative">
                     <div className="relative h-64 overflow-hidden bg-slate-900">
                       <img 
                         src={event.coverImageUrl} 
                         alt={event.eventName} 
                         className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                       
                       <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                         <Button onClick={() => setEditingGallery(event)} variant="secondary" size="icon" className="h-10 w-10 rounded-xl shadow-xl bg-white/90 backdrop-blur-sm text-primary hover:bg-white hover:scale-105 transition-all"><Edit className="w-4 h-4" /></Button>
                         <Button onClick={() => {if(window.confirm('Delete this event?')) deleteGalleryMutation.mutate(event.id)}} variant="destructive" size="icon" className="h-10 w-10 rounded-xl shadow-xl hover:scale-105 transition-all"><Trash2 className="w-4 h-4" /></Button>
                       </div>

                       <div className="absolute bottom-4 left-4 right-4">
                         <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">{event.eventDate}</p>
                         <h4 className="text-xl font-black text-white tracking-tight line-clamp-2">{event.eventName}</h4>
                       </div>
                     </div>
                   </Card>
                 </motion.div>
               ))}
            </div>

            {/* Gallery Edit Dialog */}
            <Dialog open={!!editingGallery} onOpenChange={(open) => !open && setEditingGallery(null)}>
              <DialogContent className="bg-white/95 backdrop-blur-xl border border-white/20 sm:max-w-[500px] p-0 overflow-hidden shadow-2xl rounded-2xl">
                 <div className="relative h-40 bg-slate-900">
                    {editingGallery?.coverImageUrl && (
                      <img src={getGoogleDriveDirectLink(editingGallery.coverImageUrl)} className="w-full h-full object-cover opacity-50" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <DialogHeader><DialogTitle className="text-3xl font-black text-white tracking-tighter drop-shadow-lg">Edit Event</DialogTitle></DialogHeader>
                    </div>
                 </div>
                 <div className="p-6 space-y-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Event Name</Label>
                      <Input value={editingGallery?.eventName} onChange={e => setEditingGallery({...editingGallery, eventName: e.target.value})} className="border-slate-200 h-11" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Cover Image</Label>
                       <div className="flex gap-2">
                          <Input 
                            value={editingGallery?.coverImageUrl} 
                            onChange={e => setEditingGallery({...editingGallery, coverImageUrl: e.target.value})} 
                            className="flex-1 border-slate-200 h-11" 
                          />
                          <MediaLibraryPicker 
                             onSelect={(url) => setEditingGallery({...editingGallery, coverImageUrl: url})}
                             trigger={<Button variant="secondary" className="h-11"><ImageIcon className="w-4 h-4 mr-2"/> Library</Button>}
                          />
                       </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                       <Button variant="ghost" onClick={() => setEditingGallery(null)} className="font-bold">Discard</Button>
                       <Button className="bg-primary hover:bg-primary-dark text-white font-bold px-10 rounded-xl shadow-lg" onClick={() => updateGalleryMutation.mutate({ id: editingGallery.id, data: editingGallery })}>
                         Update Album
                       </Button>
                    </div>
                 </div>
              </DialogContent>
            </Dialog>
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
                          
                          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mt-4 space-y-4">
                            <h4 className="font-bold text-amber-900 flex items-center gap-2 text-sm"><Clock className="w-4 h-4"/> Schedule Settings</h4>
                            <p className="text-xs text-amber-800">If start/end dates are set, the popup will ONLY show during this window (Requires Active Status to be ON).</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label className="text-xs text-amber-900">Start Date</Label>
                                <Input type="datetime-local" value={popupForm.startDate} onChange={e => setPopupForm({...popupForm, startDate: e.target.value})} className="border-amber-300 bg-white" />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-amber-900">End Date</Label>
                                <Input type="datetime-local" value={popupForm.endDate} onChange={e => setPopupForm({...popupForm, endDate: e.target.value})} className="border-amber-300 bg-white" />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 pt-4 border-t">
                            <div className="flex-1 flex items-center gap-3">
                               <Switch 
                                 checked={popupForm.isActive} 
                                 onCheckedChange={checked => setPopupForm({...popupForm, isActive: checked})} 
                                 className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-300"
                               />
                               <Label className="font-bold text-slate-700">Display Popup to Visitors</Label>
                            </div>
                            <Button className="bg-primary hover:bg-primary-dark text-white font-bold" onClick={handleSavePopup}>
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

          {/* Student Updates Tab */}
          <TabsContent value="student-updates" className="space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
               <CardHeader className="flex flex-row items-center justify-between border-b bg-blue-50/50">
                 <div>
                   <CardTitle className="text-xl font-bold font-heading text-blue-900">Student Portal Updates</CardTitle>
                   <CardDescription>Manage the scrolling blue bar on the homepage for student-specific info.</CardDescription>
                 </div>
                 <Dialog open={isStudentModalOpen} onOpenChange={setIsStudentModalOpen}>
                    <DialogTrigger asChild>
                       <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold" disabled={(notificationsData?.length || 0) >= 20}>
                         <Plus className="w-4 h-4 mr-2" />
                         Add New Update
                       </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border rounded-2xl shadow-2xl">
                       <DialogHeader><DialogTitle className="text-xl font-black text-blue-900">New Student Update</DialogTitle></DialogHeader>
                       <div className="py-4 space-y-4">
                          <div className="space-y-2">
                             <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Update Content</Label>
                             <Input 
                               value={studentForm.content} 
                               onChange={e => setStudentForm({...studentForm, content: e.target.value})} 
                               placeholder="e.g. Winter Break Commences from Dec 24th" 
                               className="h-12 border-blue-100"
                             />
                          </div>
                       </div>
                       <DialogFooter>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8" onClick={() => createStudentMutation.mutate(studentForm)}>
                            Add to Portal
                          </Button>
                       </DialogFooter>
                    </DialogContent>
                 </Dialog>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y">
                    {!notificationsData || notificationsData.length === 0 ? (
                      <div className="p-12 text-center text-muted-foreground italic">No student updates configured.</div>
                    ) : (
                      notificationsData.map((item, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={item.id} 
                          className="p-5 flex items-center justify-between hover:bg-blue-50/30 transition-all border-b last:border-0"
                        >
                           <div className="flex items-center gap-4">
                             <div className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />
                             <p className="font-bold text-slate-700">{item.content}</p>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="flex items-center gap-3 pr-6 border-r">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</Label>
                                <Switch 
                                  checked={item.isActive} 
                                  onCheckedChange={(checked) => updateStudentMutation.mutate({ id: item.id, data: { isActive: checked } })}
                                  className="data-[state=checked]:bg-blue-600"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <Button onClick={() => setEditingStudent(item)} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
                                <Button onClick={() => {if(window.confirm('Remove this update?')) deleteStudentMutation.mutate(item.id)}} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                              </div>
                           </div>
                        </motion.div>
                      ))
                    )}
                  </div>
               </CardContent>
            </Card>

            {/* Edit Student Update Dialog */}
            <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
              <DialogContent className="bg-white/95 backdrop-blur-xl border border-blue-100 sm:max-w-[500px] shadow-2xl rounded-2xl">
                <DialogHeader><DialogTitle className="text-2xl font-black text-blue-900 tracking-tight">Edit Update</DialogTitle></DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Update Content</Label>
                    <Input 
                      value={editingStudent?.content} 
                      onChange={e => setEditingStudent({...editingStudent, content: e.target.value})} 
                      className="border-slate-200 h-12 text-lg font-medium focus:ring-blue-500" 
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setEditingStudent(null)}>Cancel</Button>
                  <Button className="text-white font-bold px-8 bg-blue-600 hover:bg-blue-700" onClick={() => updateStudentMutation.mutate({ id: editingStudent.id, data: { content: editingStudent.content } })}>
                    Update Message
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
