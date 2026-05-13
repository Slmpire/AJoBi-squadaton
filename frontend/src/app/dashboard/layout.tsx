"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  Store, 
  Users, 
  Settings,
  Bell,
  User,
  LogOut,
  ArrowRightLeft
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/savings", label: "Savings", icon: Wallet },
    { href: "/dashboard/marketplace", label: "Marketplace", icon: Store },
    { href: "/dashboard/groups", label: "Ajo Groups", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  // Logic to compute page title in header
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    const match = navItems.find(item => pathname.startsWith(item.href) && item.href !== "/dashboard");
    return match ? match.label : "Dashboard";
  };
  return (
    <div className="min-h-screen bg-ajobi-bg flex">
      {/* Sidebar */}
      <aside className="w-[260px] border-r border-[#E8EFE8] hidden md:flex flex-col bg-[#FAFCFB] relative z-20">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-[#E8EFE8]/50">
          <Link href="/dashboard" className="text-2xl font-black text-[#066B44] tracking-tight flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="w-8 h-8 bg-[#066B44] text-white rounded-xl flex items-center justify-center font-black text-lg shadow-sm">A</span>
            AjoBI
          </Link>
        </div>
        
        {/* Navigation Links */}
        <div className="px-4 py-8 flex-1 flex flex-col justify-between">
          <nav className="space-y-2">
            {navItems.map((item) => {
              // Dashboard handles exact, sub pages handle includes
              const isActive = item.href === "/dashboard" 
                ? pathname === "/dashboard" 
                : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[14px] font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#066B44] text-white shadow-[0_4px_16px_rgba(6,107,68,0.2)] hover:shadow-[0_6px_20px_rgba(6,107,68,0.25)] -translate-y-0.5' 
                      : 'text-gray-500 hover:text-[#066B44] hover:bg-[#F1F6F3] hover:translate-x-1'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#066B44]'}`} strokeWidth={2.5} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout Bottom Trigger */}
          <div className="border-t border-[#E8EFE8] pt-6">
            <button className="w-full flex items-center gap-3.5 px-5 py-3.5 text-gray-400 hover:text-red-600 hover:bg-red-50/50 rounded-2xl text-[14px] font-bold transition-all duration-200 group">
              <LogOut className="w-[18px] h-[18px] group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 border-b border-[#E8EFE8] flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center">
             <div className="md:hidden text-2xl font-black text-[#066B44] tracking-tight flex items-center gap-1 mr-4">
               <span className="w-7 h-7 bg-[#066B44] text-white rounded-lg flex items-center justify-center font-black text-sm">A</span>
               AjoBI
             </div>
             <h1 className="text-[18px] font-bold text-gray-900 tracking-tight">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center bg-[#F1F6F3] border border-[#E8EFE8] text-[#066B44] hover:scale-105 transition-all shadow-sm">
              <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-600 rounded-full border border-white animate-pulse" />
              <Bell className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
            <Link href="/dashboard/settings" className="w-10 h-10 rounded-full border-2 border-[#066B44] p-[2px] hover:scale-105 transition-transform overflow-hidden shadow-sm">
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-600 relative">
                <User className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className=" mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
