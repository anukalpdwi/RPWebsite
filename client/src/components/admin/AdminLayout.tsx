import React from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { User, Bell, Search, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Admin Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 bg-slate-50 border rounded-md px-3 py-1.5 w-72">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search administration..." 
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-muted-foreground hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="p-2 text-muted-foreground hover:bg-slate-50 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            <div className="h-8 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">{user?.email?.split("@")[0]}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-tighter mt-1">Super Admin</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-primary/10">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary-light text-white font-bold">
                  {user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 pb-16 h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
