import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getGoogleDriveDirectLink } from "@/lib/utils";
import { Image as ImageIcon, Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function GalleryManager() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({ eventName: "", description: "", eventDate: "", coverImageUrl: "" });
  const { toast } = useToast();

  const { data: events, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/gallery"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = { ...data, coverImageUrl: getGoogleDriveDirectLink(data.coverImageUrl) };
      return await apiRequest("POST", "/api/admin/gallery", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      setIsAddModalOpen(false);
      setFormData({ eventName: "", description: "", eventDate: "", coverImageUrl: "" });
      toast({ title: "Gallery Album Created" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const payload = { ...data, coverImageUrl: getGoogleDriveDirectLink(data.coverImageUrl) };
      return await apiRequest("PATCH", `/api/admin/gallery/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      setEditingEvent(null);
      toast({ title: "Gallery Album Updated" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await apiRequest("DELETE", `/api/admin/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      toast({ title: "Event Deleted" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading text-primary">Gallery Manager</h1>
            <p className="text-muted-foreground mt-1">Manage photo albums, annual functions, and event galleries.</p>
          </div>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-primary hover:bg-primary-dark shadow-xl text-white font-black px-6 rounded-xl transition-all hover:scale-105 active:scale-95"
                disabled={(events?.length || 0) >= 50}
              >
                <Plus className="w-5 h-5 mr-2" /> 
                {(events?.length || 0) >= 50 ? "Storage Full (50)" : "Create New Album"}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">New Gallery Album</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name *</Label>
                    <Input id="eventName" required value={formData.eventName} onChange={e => setFormData({...formData, eventName: e.target.value})} placeholder="e.g. Annual Sports Day 2026" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input id="eventDate" type="date" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cover Image Asset (Google Drive URL)</Label>
                    <div className="flex flex-col gap-2">
                      {formData.coverImageUrl && getGoogleDriveDirectLink(formData.coverImageUrl).includes('drive.google.com') === false ? (
                        <div className="relative aspect-square rounded-xl overflow-hidden border">
                          <img src={getGoogleDriveDirectLink(formData.coverImageUrl)} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2">
                            <Button size="sm" variant="destructive" onClick={() => setFormData({...formData, coverImageUrl: ""})}>Clear Selection</Button>
                          </div>
                        </div>
                      ) : null}
                      <Input 
                        value={formData.coverImageUrl} 
                        onChange={(e) => setFormData({...formData, coverImageUrl: e.target.value})} 
                        placeholder="https://drive.google.com/..." 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Input id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button className="text-white font-bold" type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Saving..." : "Create Album"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="h-80 rounded-3xl bg-slate-100 animate-pulse border border-slate-200"></div>)
          ) : events && events.length > 0 ? (
            events.map((event, idx) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white dark:bg-slate-900 border rounded-3xl overflow-hidden glass-card"
              >
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  {event.coverImageUrl ? (
                    <img 
                      src={event.coverImageUrl} 
                      alt={event.eventName} 
                      className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon className="w-16 h-16 mb-2 opacity-20" />
                      <span className="text-xs font-black uppercase tracking-widest opacity-40">No Cover Image</span>
                    </div>
                  )}
                  
                  {/* Glass Overlay Actions */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-end gap-2">
                    <Button 
                      onClick={() => setEditingEvent(event)} 
                      variant="secondary" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-primary transition-all"
                    >
                      <Plus className="w-5 h-5 rotate-45" /> {/* Use Plus rotated for "editish" or find Pencil if imported */}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl shadow-lg border border-red-400/50" 
                      onClick={() => window.confirm("Delete this album permanently?") && deleteMutation.mutate(event.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {/* Floating Date Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest shadow-lg">
                      {event.eventDate ? new Date(event.eventDate).getFullYear() : "TBA"}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-black text-xl text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
                    {event.eventName}
                  </h3>
                  <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-3">
                     <Calendar className="w-3 h-3 mr-1.5 text-primary" />
                     {event.eventDate || "Schedule Pending"}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                    {event.description || "Nurturing memories of school excellence and holistic growth."}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-24 bg-white rounded-xl border border-dashed">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No Albums Found</h3>
              <p className="text-muted-foreground mt-1 text-sm">Create your first gallery album to display photos on the website.</p>
            </div>
          )}
        </div>

        {/* Gallery Edit Dialog */}
        <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
          <DialogContent className="bg-white/95 backdrop-blur-2xl border border-white/20 sm:max-w-[500px] p-0 overflow-hidden rounded-3xl shadow-2xl">
              <div className="h-48 relative bg-slate-900">
                {editingEvent?.coverImageUrl && (
                  <img src={getGoogleDriveDirectLink(editingEvent.coverImageUrl)} className="w-full h-full object-cover opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <DialogHeader><DialogTitle className="text-3xl font-black text-white tracking-tighter">Edit Gallery Album</DialogTitle></DialogHeader>
                </div>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Event Title</Label>
                   <Input value={editingEvent?.eventName} onChange={e => setEditingEvent({...editingEvent, eventName: e.target.value})} className="border-slate-200 h-12 text-lg font-bold rounded-xl focus:ring-primary" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Event Date</Label>
                     <Input type="date" value={editingEvent?.eventDate} onChange={e => setEditingEvent({...editingEvent, eventDate: e.target.value})} className="border-slate-200 h-12 rounded-xl" />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Drive Cover Link</Label>
                     <Input value={editingEvent?.coverImageUrl} onChange={e => setEditingEvent({...editingEvent, coverImageUrl: e.target.value})} className="border-slate-200 h-12 rounded-xl" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</Label>
                   <Input value={editingEvent?.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} className="border-slate-200 h-24 rounded-xl items-start pt-2" />
                 </div>
                 <div className="pt-4 flex justify-end gap-3 border-t">
                   <Button variant="ghost" onClick={() => setEditingEvent(null)} className="font-bold text-slate-400">Discard</Button>
                   <Button 
                    className="bg-primary hover:bg-primary-dark text-white font-black px-10 rounded-xl shadow-lg shadow-primary/20"
                    onClick={() => updateMutation.mutate({ id: editingEvent.id, data: editingEvent })}
                   >
                     Update Gallery
                   </Button>
                 </div>
              </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
