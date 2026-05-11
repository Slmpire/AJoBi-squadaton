import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Store, 
  Settings, 
  LogOut,
  Bell,
  Search
} from "lucide-react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/" className="text-2xl font-bold text-ajobi-green tracking-tight">AjoBI</Link>
        </div>
        
        <div className="p-4 flex-1">
          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 bg-ajobi-light text-ajobi-green rounded-lg font-medium text-sm">
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </Link>
            <Link href="/dashboard/savings" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-medium text-sm transition-colors">
              <Users className="w-5 h-5" />
              Ajo Groups
            </Link>
            <Link href="/dashboard/credit" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-medium text-sm transition-colors">
              <Wallet className="w-5 h-5" />
              Credit & Loans
            </Link>
            <Link href="/dashboard/marketplace" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-medium text-sm transition-colors">
              <Store className="w-5 h-5" />
              Marketplace
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <nav className="space-y-1">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-medium text-sm transition-colors">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center flex-1">
            {/* Search */}
            <div className="max-w-md w-full relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-ajobi-green focus:border-ajobi-green sm:text-sm transition-colors"
                placeholder="Search transactions, groups..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Boluwatife O.</p>
                <p className="text-xs text-gray-500">Market Trader</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-ajobi-green text-white flex items-center justify-center font-bold text-sm">
                BO
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
