import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Store, 
  UserPlus, 
  CreditCard,
  ShoppingCart,
  Banknote,
  Eye,
  Star
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Your Financial Credibility */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-8 items-center border border-gray-100">
        <div className="w-full md:w-5/12">
          <div className="bg-[#006C49] rounded-2xl p-6 flex flex-col items-center justify-center text-white relative overflow-hidden">
            <div className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-4 uppercase">
              Your Ajoscore Result
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-6xl font-light tracking-tight">650</span>
              <span className="text-xl text-white/80 font-light">/ 900</span>
            </div>
            <div className="bg-indigo-100 text-indigo-900 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-indigo-900" /> Silver Tier
            </div>
          </div>
          <div className="mt-4 text-center text-sm font-medium text-[#006C49] flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4" /> +12 pts since last week
          </div>
        </div>
        <div className="w-full md:w-7/12 md:pr-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Financial Credibility</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your savings consistency is strong. Add transaction history to grow faster. A higher score unlocks lower interest rates on loans and premium Ajo group invitations.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-[#006C49] hover:bg-[#005a3d] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              Boost My Score
            </button>
            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg font-medium transition-colors">
              View Report
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:shadow-md hover:border-ajobi-green/30 transition-all group">
            <div className="w-12 h-12 bg-ajobi-light rounded-xl flex items-center justify-center text-ajobi-green group-hover:scale-110 transition-transform">
              <UserPlus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-800">Join an Ajo Group</span>
          </button>
          <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:shadow-md hover:border-ajobi-green/30 transition-all group">
            <div className="w-12 h-12 bg-ajobi-light rounded-xl flex items-center justify-center text-ajobi-green group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-800">Post a Listing</span>
          </button>
          <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:shadow-md hover:border-ajobi-green/30 transition-all group">
            <div className="w-12 h-12 bg-ajobi-light rounded-xl flex items-center justify-center text-ajobi-green group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-800">Create an Escrow</span>
          </button>
          <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:shadow-md hover:border-ajobi-green/30 transition-all group">
            <div className="w-12 h-12 bg-ajobi-light rounded-xl flex items-center justify-center text-ajobi-green group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-800">Loan Eligibility</span>
          </button>
        </div>
      </div>

      {/* Active Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Ajo Groups */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Ajo Groups</span>
            <Users className="w-5 h-5 text-ajobi-green" />
          </div>
          <h4 className="font-medium text-gray-900">Sunshine Group</h4>
          <p className="text-xs text-gray-500 mb-4">Next: Friday, Oct 25</p>
          <div className="flex justify-between items-end mt-2">
            <span className="bg-ajobi-light text-ajobi-green text-xs px-2.5 py-1 rounded-md font-medium">Paid</span>
            <span className="font-bold text-gray-900">₦50,000/mo</span>
          </div>
        </div>

        {/* Active Escrows */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Escrows</span>
            <ShieldCheck className="w-5 h-5 text-ajobi-green" />
          </div>
          <h4 className="font-medium text-gray-900">Emeka's Logo Design</h4>
          <p className="text-xs text-gray-500 mb-4">Status: In Progress</p>
          <div className="flex justify-between items-end mt-2">
            <span className="font-bold text-ajobi-green">₦25,000</span>
            <Link href="#" className="text-sm font-medium text-ajobi-green hover:underline">Details</Link>
          </div>
        </div>

        {/* Active Instalments */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Instalments</span>
              <ShoppingCart className="w-5 h-5 text-ajobi-green" />
            </div>
            <h4 className="font-medium text-gray-900">Deep Freezer</h4>
            <p className="text-xs text-gray-500 mb-4">60% Complete</p>
          </div>
          <div className="mt-2">
            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-1">
              <div className="h-full bg-ajobi-green rounded-full w-[60%]"></div>
            </div>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="font-bold text-gray-900">₦120k</span>
              <span className="text-gray-500">/ ₦200k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-6">Recent Activity</h3>
        <div className="space-y-5">
          {/* Item 1 */}
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-ajobi-light flex items-center justify-center shrink-0">
                <Banknote className="w-5 h-5 text-ajobi-green" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Contribution collected ₦10,000</p>
                <p className="text-sm text-gray-500">Sunshine Group • Monthly Cycle</p>
              </div>
            </div>
            <span className="text-sm text-gray-500 pt-1">2h ago</span>
          </div>
          <div className="w-full h-px bg-gray-100"></div>
          
          {/* Item 2 */}
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-ajobi-light flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-ajobi-green" />
              </div>
              <div>
                <p className="font-medium text-gray-900">AjoScore updated +2 points</p>
                <p className="text-sm text-gray-500">on-time contribution reward</p>
              </div>
            </div>
            <span className="text-sm text-gray-500 pt-1">2h ago</span>
          </div>
          <div className="w-full h-px bg-gray-100"></div>
          
          {/* Item 3 */}
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New listing viewed</p>
                <p className="text-sm text-gray-500">Ankara fabric set • Marketplace</p>
              </div>
            </div>
            <span className="text-sm text-gray-500 pt-1">yesterday</span>
          </div>
        </div>
      </div>
    </div>
  );
}
