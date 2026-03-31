import { useState } from "react";
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
      toast({ title: "Gallery Event Created" });
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
              <Button className="bg-primary hover:bg-primary-dark shadow-sm">
                <Plus className="w-4 h-4 mr-2" /> Create Album
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>New Gallery Album</DialogTitle>
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
                    <Label htmlFor="coverImageUrl">Cover Image URL (Drive Link)</Label>
                    <Input id="coverImageUrl" placeholder="https://drive.google.com/..." value={formData.coverImageUrl} onChange={e => setFormData({...formData, coverImageUrl: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Input id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Create Album"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="h-64 rounded-xl bg-slate-100 animate-pulse border"></div>)
          ) : events && events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="aspect-video bg-slate-100 overflow-hidden relative">
                  {event.coverImageUrl ? (
                    <img src={event.coverImageUrl} alt={event.eventName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                      <span className="text-sm font-medium">No cover image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="destructive" size="icon" className="h-8 w-8 shadow-sm" onClick={() => window.confirm("Delete this album?") && deleteMutation.mutate(event.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{event.eventName}</h3>
                  <div className="flex items-center text-sm text-slate-500 mt-1 mb-2">
                     <Calendar className="w-3.5 h-3.5 mr-1.5" />
                     {event.eventDate || "Date not specified"}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-24 bg-white rounded-xl border border-dashed">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No Albums Found</h3>
              <p className="text-muted-foreground mt-1 text-sm">Create your first gallery album to display photos on the website.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
