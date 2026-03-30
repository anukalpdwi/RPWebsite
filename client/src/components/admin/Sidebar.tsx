import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  UserCircle, 
  Newspaper, 
  Image as ImageIcon,
  MousePointer2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  School
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: UserCheck, label: "Admissions", href: "/admin/admissions" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: UserCircle, label: "Staff", href: "/admin/staff" },
  { icon: Newspaper, label: "News Ticker", href: "/admin/news" },
  { icon: ImageIcon, label: "Gallery", href: "/admin/gallery" },
  { icon: MousePointer2, label: "Popups & Sliders", href: "/admin/cms" },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useAuth();

  return (
    <div 
      className={cn(
        "h-screen bg-primary text-white flex flex-col transition-all duration-300 relative z-20 shadow-xl",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center flex-shrink-0">
          <School className="w-5 h-5" />
        </div>
        {!collapsed && <span className="font-bold text-lg truncate">RP Admin</span>}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a 
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-white/15 text-white shadow-inner" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-accent" : "group-hover:text-white")} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-accent text-primary flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}
