"use client";

import { Search, MapPin, Star, Filter, Plus, ArrowRight, X, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useMarketplaceBrowse } from "./model/useMarketplaceBrowse";

export default function MarketplaceBrowsePage() {
  const { listings, isLoading, params, updateFilters } = useMarketplaceBrowse();
  const [searchValue, setSearchValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchValue || undefined });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'gold': return 'bg-[#FFF8E6] text-[#B8860B]';
      case 'platinum': return 'bg-[#F0F4F8] text-[#708090]';
      case 'silver': return 'bg-[#F1F5F9] text-[#64748B]';
      default: return 'bg-[#EEF8F3] text-ajobi-green';
    }
  };

  return (
    <div className="w-full mx-auto pb-12 pt-4 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-[#066B44] mb-2 tracking-tight">
            Marketplace
          </h1>
          <p className="text-[14px] text-gray-600 font-medium">
            Discover trusted sellers, products, and services in your community.
          </p>
        </div>
        <Link 
          href="/dashboard/marketplace/create"
          className="inline-flex items-center justify-center gap-2 bg-[#066B44] hover:bg-[#055737] text-white px-6 py-3 rounded-xl text-[14px] font-bold transition-all shadow-[0_4px_14px_0_rgba(6,107,68,0.2)] hover:shadow-[0_6px_20px_rgba(6,107,68,0.15)] hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          Create Listing
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for products, artisans, or services..."
            onChange={handleSearch}
            className="block w-full pl-11 pr-4 py-3.5 bg-white border border-[#E8EFE8] rounded-2xl text-[14px] font-medium focus:ring-2 focus:ring-[#066B44]/20 focus:border-[#066B44] outline-none transition-all shadow-sm"
          />
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-[14px] font-bold border transition-all whitespace-nowrap shadow-sm ${
              showFilters 
                ? 'bg-[#F1F6F3] border-[#066B44] text-[#066B44]' 
                : 'bg-white border-[#E8EFE8] text-gray-700 hover:bg-[#F9FCF9]'
            }`}
          >
            <Filter className="w-4 h-4" /> {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
          
          {['all', 'product', 'artisan', 'service'].map((type) => (
            <button
              key={type}
              onClick={() => updateFilters({ seller_type: type === 'all' ? undefined : type })}
              className={`px-6 py-3.5 rounded-2xl text-[14px] font-bold transition-colors whitespace-nowrap shadow-sm border ${
                (params.seller_type === type) || (type === 'all' && !params.seller_type)
                  ? 'bg-[#066B44] text-white border-[#066B44]'
                  : 'bg-white text-gray-700 border-[#E8EFE8] hover:bg-[#F9FCF9]'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}s
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {showFilters && (
        <div className="bg-[#FAFCFB] border border-[#E8EFE8] rounded-[24px] p-6 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8EFE8] mb-6">
            <h3 className="text-[15px] font-bold text-gray-900">Advanced Filters</h3>
            <button 
              onClick={() => {
                setSearchValue("");
                updateFilters({
                  seller_type: undefined,
                  min_price: undefined,
                  max_price: undefined,
                  allows_instalment: undefined,
                  category: undefined,
                  search: undefined
                });
              }}
              className="text-[12px] font-bold text-red-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wide">Price Range (₦)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={params.min_price || ""}
                  onChange={(e) => updateFilters({ min_price: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full bg-white border border-[#E8EFE8] rounded-xl px-4 py-2.5 text-[13px] font-medium focus:ring-1 focus:ring-[#066B44] focus:border-[#066B44] outline-none"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={params.max_price || ""}
                  onChange={(e) => updateFilters({ max_price: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full bg-white border border-[#E8EFE8] rounded-xl px-4 py-2.5 text-[13px] font-medium focus:ring-1 focus:ring-[#066B44] focus:border-[#066B44] outline-none"
                />
              </div>
            </div>

            {/* Instalment Filter */}
            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wide">Payment Method</label>
              <div className="flex items-center gap-3 h-[46px]">
                <label className="inline-flex items-center cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={params.allows_instalment === true}
                      onChange={(e) => updateFilters({ allows_instalment: e.target.checked ? true : undefined })}
                    />
                    <div className={`w-5 h-5 border rounded transition-all flex items-center justify-center ${params.allows_instalment ? 'bg-[#066B44] border-[#066B44]' : 'bg-white border-gray-300 group-hover:border-gray-400'}`}>
                      {params.allows_instalment && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <span className="ml-3 text-[13px] font-semibold text-gray-700">Allows Instalment Payments</span>
                </label>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wide">Category</label>
              <select
                value={params.category || ""}
                onChange={(e) => updateFilters({ category: e.target.value || undefined })}
                className="w-full bg-white border border-[#E8EFE8] rounded-xl px-4 py-2.5 text-[13px] font-medium focus:ring-1 focus:ring-[#066B44] focus:border-[#066B44] outline-none appearance-none"
              >
                <option value="">All Categories</option>
                {params.seller_type === 'product' && [
                  "Electronics & Gadgets", "Fashion & Clothing", "Food & Groceries",
                  "Home & Furniture", "Beauty & Personal Care", "Agricultural Produce"
                ].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                
                {params.seller_type === 'artisan' && [
                  "Fashion & Tailoring", "Footwear", "Furniture & Woodwork", "Leather Goods"
                ].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                
                {params.seller_type === 'service' && [
                  "Photography", "Electrical", "Plumbing", "Hair Styling"
                ].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                
                {!params.seller_type && [
                  "Fashion & Tailoring", "Electronics & Gadgets", "Photography", "Food & Groceries"
                ].map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-[24px] h-[380px] animate-pulse border border-[#E8EFE8] shadow-sm"></div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-[24px] p-12 text-center border border-[#E8EFE8] shadow-sm">
          <div className="w-16 h-16 bg-[#F1F6F3] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-[#066B44]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-500 max-w-md mx-auto">We couldn't find any listings matching your current search or filters. Try adjusting them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Link 
              href={`/dashboard/marketplace/${listing.listing_id}`} 
              key={listing.listing_id}
              className="group bg-white rounded-[24px] overflow-hidden border border-[#E8EFE8] shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-[200px] w-full overflow-hidden bg-gray-100">
                <Image 
                  src={listing.thumbnail} 
                  alt={listing.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-bold text-gray-800 shadow-sm uppercase tracking-wider">
                    {listing.seller_type}
                  </span>
                </div>
                {listing.allows_instalment && (
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1.5 bg-[#066B44] rounded-full text-[11px] font-bold text-white shadow-md">
                      Instalment Available
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-[16px] font-bold text-gray-900 leading-snug line-clamp-2">
                    {listing.title}
                  </h3>
                </div>
                
                <p className="text-[18px] font-black text-[#066B44] mb-4 mt-auto">
                  ₦{listing.price.toLocaleString()}
                </p>

                <div className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{listing.location}</span>
                </div>

                {/* Seller Info */}
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        {listing.seller.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="text-[13px] font-bold text-gray-900 truncate">{listing.seller.name}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-medium text-gray-500">{listing.seller.completed_escrows} Escrows</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${getTierColor(listing.seller.score_tier)} shrink-0`}>
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[11px] font-bold">{listing.seller.ajo_score}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
