import Link from "next/link";
import { 
  LayoutDashboard, 
  Wallet, 
  Store, 
  Users, 
  Settings,
  Bell,
  User
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ajobi-bg flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 hidden md:flex flex-col bg-ajobi-bg">
        <div className="h-20 flex flex-col justify-center px-6">
          <Link href="/" className="text-3xl font-bold text-ajobi-green tracking-tight">AjoBI</Link>
        </div>
        
        <div className="px-4 py-6 flex-1">
          <nav className="space-y-1.5">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-ajobi-green text-white rounded-lg font-medium text-sm shadow-sm">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/dashboard/savings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:shadow-sm rounded-lg font-medium text-sm transition-all">
              <Wallet className="w-5 h-5" />
              Savings
            </Link>
            <Link href="/dashboard/marketplace" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:shadow-sm rounded-lg font-medium text-sm transition-all">
              <Store className="w-5 h-5" />
              Marketplace
            </Link>
            <Link href="/dashboard/groups" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:shadow-sm rounded-lg font-medium text-sm transition-all">
              <Users className="w-5 h-5" />
              Ajo Groups
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:shadow-sm rounded-lg font-medium text-sm transition-all">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 border-b border-gray-200 flex items-center justify-between px-8 bg-ajobi-bg z-10">
          <div className="flex items-center">
             <div className="md:hidden text-2xl font-bold text-ajobi-green mr-4">AjoBI</div>
             <div className="hidden md:block w-px h-6 bg-gray-300 mr-6"></div>
             <h1 className="text-gray-800 text-lg font-medium">Dashboard</h1>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-[9px] font-bold text-white flex items-center justify-center rounded-full border border-ajobi-bg">
                4
              </div>
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <User className="w-4 h-4" />
            </button>
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
