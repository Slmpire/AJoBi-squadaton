import { ArrowUpRight, TrendingUp, Users, ArrowDownRight, Clock, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Boluwatife 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your finances today.</p>
        </div>
        <button className="bg-ajobi-green hover:bg-ajobi-green-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          + Add Funds
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <span className="text-ajobi-green font-bold text-lg">₦</span>
            </div>
            <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-md">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5%
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Total Balance</p>
          <h3 className="text-3xl font-bold text-gray-900">₦245,000<span className="text-gray-400 text-xl">.00</span></h3>
        </div>

        {/* AjoScore */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-sm border border-indigo-500 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <TrendingUp className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-indigo-100 text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-md">
                Excellent
              </span>
            </div>
            <p className="text-sm text-indigo-100 font-medium mb-1">Your AjoScore</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold">842</h3>
              <span className="text-indigo-200 mb-1">/ 900</span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-indigo-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-[90%]"></div>
            </div>
          </div>
        </div>

        {/* Active Groups */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Active Ajo Groups</p>
          <h3 className="text-3xl font-bold text-gray-900">3</h3>
          <p className="text-sm text-gray-500 mt-2">Next payout in <span className="font-semibold text-gray-900">4 days</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Recent Activity</h3>
            <button className="text-sm font-medium text-ajobi-green hover:underline">View all</button>
          </div>
          <div className="p-0">
            <ul className="divide-y divide-gray-100">
              {[
                { name: "Balogun Market Ajo", type: "Contribution", amount: "-₦5,000", date: "Today, 9:00 AM", icon: ArrowDownRight, color: "text-red-500", bg: "bg-red-50" },
                { name: "Loan Repayment", type: "Credit Service", amount: "-₦12,500", date: "Yesterday", icon: ArrowDownRight, color: "text-red-500", bg: "bg-red-50" },
                { name: "Ikeja Traders Fund", type: "Payout Received", amount: "+₦150,000", date: "Oct 12, 2026", icon: ArrowUpRight, color: "text-green-500", bg: "bg-green-50" },
                { name: "Wallet Top-up", type: "Bank Transfer", amount: "+₦20,000", date: "Oct 10, 2026", icon: ArrowUpRight, color: "text-green-500", bg: "bg-green-50" },
              ].map((tx, i) => (
                <li key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.bg}`}>
                      <tx.icon className={`w-5 h-5 ${tx.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{tx.name}</p>
                      <p className="text-xs text-gray-500">{tx.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${tx.color === 'text-green-500' ? 'text-green-600' : 'text-gray-900'}`}>{tx.amount}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3" /> {tx.date}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions & Payouts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Upcoming Payouts</h3>
            <div className="space-y-4">
              <div className="bg-ajobi-light p-4 rounded-xl border border-ajobi-green/20">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-ajobi-green uppercase tracking-wider">In 4 days</span>
                  <span className="text-sm font-bold text-gray-900">₦250,000</span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm">Balogun Market Ajo</h4>
                <div className="w-full bg-white rounded-full h-1.5 mt-3">
                  <div className="bg-ajobi-green h-1.5 rounded-full w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
