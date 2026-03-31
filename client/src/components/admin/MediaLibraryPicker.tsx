import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import imageCompression from "browser-image-compression";
import { 
  Image as ImageIcon, UploadCloud, CheckCircle2, X, Plus, 
  Trash2, Loader2, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface MediaAsset {
  id: number;
  fileName: string;
  url: string;
  fileType: string;
  sizeBytes: number;
  dimensions: string | null;
  uploadedAt: string;
}

interface MediaLibraryPickerProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MediaLibraryPicker({ onSelect, trigger, isOpen, onOpenChange }: MediaLibraryPickerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("library");

  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const { data: assets, isLoading } = useQuery<MediaAsset[]>({
    queryKey: ["/api/admin/media"],
  });

  const saveMediaMutation = useMutation({
    mutationFn: async (assetData: Partial<MediaAsset>) => {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetData),
      });
      if (!res.ok) throw new Error("Failed to save asset metadata");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      setActiveTab("library");
      toast({ title: "Image Uploaded Successfully!" });
    },
    onError: () => toast({ title: "Error saving metadata", variant: "destructive" })
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete asset");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] })
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Compress Image natively in browser
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        fileType: "image/webp" as string,
        initialQuality: 0.85,
        alwaysKeepResolution: true
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // 2. Upload to Supabase Bucket
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      
      const { data, error } = await supabase.storage
        .from("school-media")
        .upload(`uploads/${uniqueName}`, compressedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: "image/webp"
        });

      if (error) {
        console.error("Supabase Upload Error:", error);
        throw new Error(error.message);
      }

      const { data: urlData } = supabase.storage
        .from("school-media")
        .getPublicUrl(`uploads/${uniqueName}`);

      // 3. Save reference to DB
      saveMediaMutation.mutate({
        fileName: file.name,
        url: urlData.publicUrl,
        fileType: "image/webp",
        sizeBytes: compressedFile.size,
        dimensions: null // Could extract from Image object if needed
      });

    } catch (error: any) {
      toast({ 
        title: "Upload Failed", 
        description: error.message || "Ensure 'school-media' bucket exists in your Supabase project.",
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelect = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      {/* Note: bg-white and text-slate-900 guarantee visibility over overlays! */}
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle className="text-2xl font-bold">Media Library</DialogTitle>
          <DialogDescription>
            Select an existing image or compress and upload a new one.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="library">My Library</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="library" className="flex-1 overflow-y-auto p-6 m-0 border-0 bg-slate-50 dark:bg-slate-900/50">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (!assets || assets.length === 0) ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">Library is Empty</h3>
                <p className="mt-2 mb-6">Upload some images to start building your gallery.</p>
                <Button onClick={() => setActiveTab("upload")}>Go to Upload</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="relative group rounded-xl overflow-hidden border bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md hover:ring-2 hover:ring-primary">
                    <div className="aspect-square bg-slate-100 dark:bg-slate-900 relative">
                      <img 
                        src={asset.url} 
                        alt={asset.fileName} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                        <Button size="sm" onClick={() => handleSelect(asset.url)} className="font-bold cursor-pointer relative z-20">
                          Select
                        </Button>
                        <Button size="icon" variant="destructive" className="h-9 w-9 cursor-pointer relative z-20" onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Delete this asset from library?")) {
                            deleteMutation.mutate(asset.id);
                          }
                        }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-2 truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                      {asset.fileName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="flex-1 flex items-center justify-center p-6 m-0 border-0 bg-slate-50 dark:bg-slate-900/50">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center relative overflow-hidden group hover:border-primary transition-colors">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              />
              
              <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none relative z-0">
                {isUploading ? (
                  <>
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                       <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Auto-Optimizing...</h3>
                    <p className="text-sm text-muted-foreground">Compressing to WebP and uploading to Supabase.</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors group-hover:scale-110">
                       <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Drop DSLR Photo Here</h3>
                    <p className="text-sm text-muted-foreground">Or click to browse. Automatically converts to WebP & strips metadata.</p>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
