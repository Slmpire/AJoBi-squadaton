import { 
  Plus, 
  List, 
  MapPin, 
  ChevronDown, 
  Info,
  ShieldCheck,
  Star,
  MonitorSmartphone,
  Shirt,
  Utensils,
  Sofa,
  Sparkles,
  Leaf,
  Scissors
} from "lucide-react";

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Marketplace</h2>
          <p className="text-gray-500 text-sm mt-1">Trade with verified members of the AjoBI ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
            <List className="w-4 h-4" /> My Listings
          </button>
          <button className="flex items-center gap-2 bg-[#006C49] hover:bg-[#005a3d] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Post a Listing
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap items-center gap-4">
        {/* Location */}
        <div className="w-full lg:w-auto flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm text-gray-900 focus:bg-white focus:border-ajobi-green focus:ring-1 focus:ring-ajobi-green outline-none transition-colors"
              placeholder="Lagos, Nigeria"
              defaultValue="Lagos, Nigeria"
            />
          </div>
        </div>

        {/* Category */}
        <div className="w-full sm:w-auto flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
          <div className="relative">
            <select className="block w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm text-gray-900 focus:bg-white focus:border-ajobi-green focus:ring-1 focus:ring-ajobi-green outline-none transition-colors appearance-none cursor-pointer">
              <option>All Categories</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="w-full sm:w-auto flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Price Range</label>
          <div className="relative">
            <select className="block w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm text-gray-900 focus:bg-white focus:border-ajobi-green focus:ring-1 focus:ring-ajobi-green outline-none transition-colors appearance-none cursor-pointer">
              <option>Any Price</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="w-full sm:w-auto flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Sort By</label>
          <div className="relative">
            <select className="block w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm text-gray-900 focus:bg-white focus:border-ajobi-green focus:ring-1 focus:ring-ajobi-green outline-none transition-colors appearance-none cursor-pointer">
              <option>Newest</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="w-full lg:w-auto flex items-end mt-2 lg:mt-0 pt-[22px]">
          <button className="w-full bg-[#006C49] hover:bg-[#005a3d] text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Tabs & Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div className="flex bg-gray-100/80 p-1 rounded-xl w-max">
          <button className="px-4 py-1.5 bg-white text-gray-900 shadow-sm rounded-lg text-sm font-medium">All</button>
          <button className="px-4 py-1.5 text-gray-600 hover:text-gray-900 rounded-lg text-sm font-medium transition-colors">Products</button>
          <button className="px-4 py-1.5 text-gray-600 hover:text-gray-900 rounded-lg text-sm font-medium transition-colors">Artisans</button>
          <button className="px-4 py-1.5 text-gray-600 hover:text-gray-900 rounded-lg text-sm font-medium transition-colors">Services</button>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <Info className="w-4 h-4" />
          Marketplace activity contributes to your AjoScore.
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button className="flex items-center gap-2 bg-[#006C49] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
          <MonitorSmartphone className="w-4 h-4" /> Electronics
        </button>
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
          <Shirt className="w-4 h-4" /> Fashion
        </button>
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
          <Utensils className="w-4 h-4" /> Food
        </button>
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
          <Sofa className="w-4 h-4" /> Furniture
        </button>
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
          <Sparkles className="w-4 h-4" /> Beauty
        </button>
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
          <Leaf className="w-4 h-4" /> Agriculture
        </button>
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
          <Scissors className="w-4 h-4" /> Tailoring
        </button>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
        {/* Item 1 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
          <div className="h-48 bg-gray-800 relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-[#006C49]/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm z-10">
              New
            </div>
            <div className="w-full h-full bg-gradient-to-tr from-gray-900 to-gray-700 group-hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="p-5 flex flex-col h-44">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 line-clamp-1">Pro Watch Series 8</h3>
              <span className="flex items-center text-red-500 text-sm font-medium shrink-0 ml-2">
                <Star className="w-3.5 h-3.5 fill-red-500 mr-1" /> 4.8
              </span>
            </div>
            <p className="text-[#006C49] font-medium mb-auto">85,000</p>
            <button className="w-full mt-4 bg-[#006C49] hover:bg-[#005a3d] text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
              <ShieldCheck className="w-4 h-4" /> Buy via Escrow
            </button>
          </div>
        </div>

        {/* Item 2 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
          <div className="h-48 bg-blue-900 relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-white/90 text-gray-900 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm z-10">
              Textile
            </div>
            <div className="w-full h-full bg-gradient-to-tr from-blue-900 to-emerald-800 group-hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="p-5 flex flex-col h-44">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 line-clamp-1">Handwoven Aso Oke</h3>
              <span className="flex items-center text-red-500 text-sm font-medium shrink-0 ml-2">
                <Star className="w-3.5 h-3.5 fill-red-500 mr-1" /> 4.9
              </span>
            </div>
            <p className="text-[#006C49] font-medium mb-auto">45,000</p>
            <button className="w-full mt-4 bg-[#006C49] hover:bg-[#005a3d] text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
              <ShieldCheck className="w-4 h-4" /> Buy via Escrow
            </button>
          </div>
        </div>

        {/* Item 3 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
          <div className="h-48 bg-gray-900 relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm z-10">
              Service
            </div>
            <div className="w-full h-full bg-gradient-to-tr from-gray-900 to-gray-800 group-hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="p-5 flex flex-col h-44">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 line-clamp-1">Expert Tech Repair</h3>
              <span className="flex items-center text-red-500 text-sm font-medium shrink-0 ml-2">
                <Star className="w-3.5 h-3.5 fill-red-500 mr-1" /> 4.7
              </span>
            </div>
            <p className="text-[#006C49] font-medium mb-auto">15,000/hr</p>
            <button className="w-full mt-4 bg-[#006C49] hover:bg-[#005a3d] text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
              <ShieldCheck className="w-4 h-4" /> Buy via Escrow
            </button>
          </div>
        </div>

        {/* Item 4 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
          <div className="h-48 bg-orange-900 relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-tr from-amber-700 to-orange-900 group-hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="p-5 flex flex-col h-44">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 line-clamp-1">Leather Executive Bag</h3>
              <span className="flex items-center text-red-500 text-sm font-medium shrink-0 ml-2">
                <Star className="w-3.5 h-3.5 fill-red-500 mr-1" /> 4.5
              </span>
            </div>
            <p className="text-[#006C49] font-medium mb-auto">52,000</p>
            <button className="w-full mt-4 bg-[#006C49] hover:bg-[#005a3d] text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
              <ShieldCheck className="w-4 h-4" /> Buy via Escrow
            </button>
          </div>
        </div>
        
        {/* Item 5 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
          <div className="h-48 bg-teal-900 relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-tr from-teal-900 to-emerald-900 group-hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="p-5 flex flex-col h-44">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 line-clamp-1">Elite Running Shoes</h3>
              <span className="flex items-center text-red-500 text-sm font-medium shrink-0 ml-2">
                <Star className="w-3.5 h-3.5 fill-red-500 mr-1" /> 4.2
              </span>
            </div>
            <p className="text-[#006C49] font-medium mb-auto">38,500</p>
            <button className="w-full mt-4 bg-[#006C49] hover:bg-[#005a3d] text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
              <ShieldCheck className="w-4 h-4" /> Buy via Escrow
            </button>
          </div>
        </div>

        {/* Item 6 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
          <div className="h-48 bg-stone-800 relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-teal-800/80 text-teal-100 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm z-10">
              Rare
            </div>
            <div className="w-full h-full bg-gradient-to-tr from-stone-800 to-stone-700 group-hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="p-5 flex flex-col h-44">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 line-clamp-1">Classic 35mm Camera</h3>
              <span className="flex items-center text-red-500 text-sm font-medium shrink-0 ml-2">
                <Star className="w-3.5 h-3.5 fill-red-500 mr-1" /> 5.0
              </span>
            </div>
            <p className="text-[#006C49] font-medium mb-auto">120,000</p>
            <button className="w-full mt-4 bg-[#006C49] hover:bg-[#005a3d] text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
              <ShieldCheck className="w-4 h-4" /> Buy via Escrow
            </button>
          </div>
        </div>

        {/* Item 7 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
          <div className="h-48 bg-slate-900 relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-slate-800 group-hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="p-5 flex flex-col h-44">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 line-clamp-1">HomeVoice Assistant</h3>
              <span className="flex items-center text-red-500 text-sm font-medium shrink-0 ml-2">
                <Star className="w-3.5 h-3.5 fill-red-500 mr-1" /> 4.6
              </span>
            </div>
            <p className="text-[#006C49] font-medium mb-auto">25,000</p>
            <button className="w-full mt-4 bg-[#006C49] hover:bg-[#005a3d] text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
              <ShieldCheck className="w-4 h-4" /> Buy via Escrow
            </button>
          </div>
        </div>

        {/* Item 8 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
          <div className="h-48 bg-neutral-900 relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-tr from-neutral-900 to-neutral-800 group-hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="p-5 flex flex-col h-44">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 line-clamp-1">Studio Pro Headphones</h3>
              <span className="flex items-center text-red-500 text-sm font-medium shrink-0 ml-2">
                <Star className="w-3.5 h-3.5 fill-red-500 mr-1" /> 4.8
              </span>
            </div>
            <p className="text-[#006C49] font-medium mb-auto">92,000</p>
            <button className="w-full mt-4 bg-[#006C49] hover:bg-[#005a3d] text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
              <ShieldCheck className="w-4 h-4" /> Buy via Escrow
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
