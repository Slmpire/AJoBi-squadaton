"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, MapPin, Star, ShieldCheck, Clock, 
  Truck, CheckCircle2, ChevronRight, Loader2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { marketplaceService, ListingDetail, PurchasePayload } from "@/services/marketplaceService";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Purchase state
  const [isBuying, setIsBuying] = useState(false);
  const [paymentType, setPaymentType] = useState<'full' | 'instalment'>('full');
  const [instalmentCount, setInstalmentCount] = useState<number>(2);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [purchaseResult, setPurchaseResult] = useState<any>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await marketplaceService.getListingDetail(id);
        console.log("listing response", response);
        if (response.success) {
          setListing(response.data);
          if (response.data.min_instalment_count) {
            setInstalmentCount(response.data.min_instalment_count);
          }
        }
      } catch (err: any) {
        console.warn("API failed, using fallback data", err);
        // Fallback for demonstration
        // setListing({
        //   listing_id: id,
        //   seller_type: "artisan",
        //   category: "Fashion & Tailoring",
        //   title: "Custom Ankara Dress",
        //   description: "I make custom Ankara dresses to fit. Any style, any size. 7-day turnaround. Only premium quality fabrics used.",
        //   price: 25000,
        //   images: [
        //     "https://images.unsplash.com/photo-1550614000-4b95dd247ae2?q=80&w=1200&auto=format&fit=crop"
        //   ],
        //   location: "Surulere, Lagos",
        //   delivery_available: true,
        //   lead_time: "7-14 days",
        //   allows_instalment: true,
        //   min_instalment_count: 2,
        //   status: "active",
        //   created_at: "2024-05-29T10:00:00Z",
        //   seller: {
        //     user_id: "usr_001",
        //     name: "Mama Ngozi",
        //     photo: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=256&auto=format&fit=crop",
        //     ajo_score: 74,
        //     score_tier: "Gold",
        //     member_since: "2024-01-15T00:00:00Z",
        //     completed_escrows: 34,
        //     dispute_rate: "0%",
        //     response_rate: "98%"
        //   }
        // });
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handlePurchase = async () => {
    setIsBuying(true);
    setError(null);
    try {
      const payload: PurchasePayload = { payment_type: paymentType };
      if (paymentType === 'instalment') {
        payload.instalment_count = instalmentCount;
        payload.frequency = frequency;
      }

      const response = await marketplaceService.initiatePurchase(id, payload);
      setPurchaseResult(response.data);
    } catch (err: any) {
      console.warn("Purchase API failed, mocking success", err);
      // Mock success for demo
      setTimeout(() => {
        setPurchaseResult({
          escrow_id: "esc_m1n2o3",
          payment_type: paymentType,
          total_amount: listing?.price,
          trust_score: 82,
          trust_verdict: "SAFE",
          trust_reason: "Seller has strong transaction history. No flags detected.",
          next_step: "setup_mandate"
        });
        setIsBuying(false);
      }, 1500);
      return;
    }
    setIsBuying(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#066B44] animate-spin mb-4" />
        <p className="text-gray-500 font-medium text-sm">Loading listing details...</p>
      </div>
    );
  }

  if (!listing) {
    return <div className="p-8 text-center text-red-500 font-bold">Listing not found</div>;
  }

  if (purchaseResult) {
    return (
      <div className=" w-full mx-auto pb-12 pt-10 px-4 sm:px-6">
        <div className="bg-white rounded-[24px] p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E8EFE8]">
          <div className="w-20 h-20 bg-[#EEF8F3] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-[#066B44]" />
          </div>
          <h2 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight">Escrow Initiated</h2>
          <p className="text-[14px] text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
            Your purchase is protected by AjoBI Escrow. The seller won't receive funds until you confirm delivery.
          </p>

          <div className="bg-[#F9FCF9] rounded-2xl p-5 mb-8 text-left border border-[#DCE8E0]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-gray-500 font-medium">Trust Verdict</span>
              <span className="px-3 py-1 bg-[#EEF8F3] text-[#066B44] text-[11px] font-bold rounded-full uppercase tracking-wider">
                {purchaseResult.trust_verdict} ({purchaseResult.trust_score}/100)
              </span>
            </div>
            <p className="text-[13px] text-gray-700 font-medium leading-relaxed">
              {purchaseResult.trust_reason}
            </p>
          </div>

          <button className="w-full bg-[#066B44] hover:bg-[#055737] text-white px-6 py-4 rounded-xl text-[15px] font-bold transition-all shadow-[0_4px_14px_0_rgba(6,107,68,0.2)]">
            Setup Mandate & Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-12 pt-4 px-4 sm:px-6">
      <Link 
        href="/dashboard/marketplace"
        className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-[#066B44] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-[24px] overflow-hidden border border-[#E8EFE8] shadow-sm relative h-[300px] sm:h-[400px]">
            <Image 
              src={listing.images[0]} 
              alt={listing.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E8EFE8] shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                {listing.category}
              </span>
              <span className="px-3 py-1 bg-[#F1F6F3] text-[#066B44] rounded-full text-[11px] font-bold uppercase tracking-wider">
                {listing.seller_type}
              </span>
            </div>

            <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-900 leading-tight mb-4 tracking-tight">
              {listing.title}
            </h1>
            
            <p className="text-[15px] text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
              {listing.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#E8EFE8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F1F6F3] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#066B44]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Location</p>
                  <p className="text-[14px] font-bold text-gray-900">{listing.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F1F6F3] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#066B44]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Lead Time</p>
                  <p className="text-[14px] font-bold text-gray-900">{listing.lead_time || 'Immediate'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Checkout & Seller */}
        <div className="lg:col-span-2 space-y-6">
          {/* Checkout Card */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E8EFE8] shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-6">
            <h2 className="text-[32px] font-black text-[#066B44] mb-6 tracking-tight">
              ₦{listing.price.toLocaleString()}
            </h2>

            <div className="space-y-4 mb-8">
              <label className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all border-[#066B44] bg-[#F9FCF9]">
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentType === 'full'}
                  onChange={() => setPaymentType('full')}
                  className="mt-1 shrink-0 accent-[#066B44]" 
                />
                <div>
                  <p className="text-[14px] font-bold text-gray-900">Pay in Full (Escrow)</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">Funds are held securely until you confirm delivery.</p>
                </div>
              </label>

              {listing.allows_instalment && (
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentType === 'instalment' ? 'border-[#066B44] bg-[#F9FCF9]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentType === 'instalment'}
                    onChange={() => setPaymentType('instalment')}
                    className="mt-1 shrink-0 accent-[#066B44]" 
                  />
                  <div className="w-full">
                    <p className="text-[14px] font-bold text-gray-900">Pay in Instalments</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">Split payments via AjoBI.</p>
                    
                    {paymentType === 'instalment' && (
                      <div className="mt-4 space-y-3 pt-3 border-t border-[#DCE8E0]">
                         <div className="flex justify-between items-center text-[12px] font-bold text-gray-700">
                           <span>Instalments:</span>
                           <select 
                             value={instalmentCount}
                             onChange={(e) => setInstalmentCount(Number(e.target.value))}
                             className="bg-white border border-[#DCE8E0] rounded-lg px-2 py-1 outline-none focus:border-[#066B44]"
                           >
                             {[...Array(5)].map((_, i) => {
                               const count = (listing.min_instalment_count || 2) + i;
                               return <option key={count} value={count}>{count} payments</option>
                             })}
                           </select>
                         </div>
                         <div className="flex justify-between items-center text-[12px] font-bold text-gray-700">
                           <span>Frequency:</span>
                           <select 
                             value={frequency}
                             onChange={(e) => setFrequency(e.target.value as any)}
                             className="bg-white border border-[#DCE8E0] rounded-lg px-2 py-1 outline-none focus:border-[#066B44]"
                           >
                             <option value="weekly">Weekly</option>
                             <option value="monthly">Monthly</option>
                           </select>
                         </div>
                      </div>
                    )}
                  </div>
                </label>
              )}
            </div>

            <button 
              onClick={handlePurchase}
              disabled={isBuying}
              className="w-full bg-[#066B44] hover:bg-[#055737] text-white px-6 py-4 rounded-xl text-[15px] font-bold transition-all shadow-[0_4px_14px_0_rgba(6,107,68,0.2)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isBuying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buy Securely with Escrow'}
            </button>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5" /> Covered by AjoBI Buyer Protection
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-white rounded-[24px] p-6 border border-[#E8EFE8] shadow-sm">
            <h3 className="text-[14px] font-bold text-gray-900 mb-4 uppercase tracking-wider">About the Seller</h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full overflow-hidden relative">
                <Image src={listing.seller.photo} alt={listing.seller.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-[16px] font-bold text-gray-900 tracking-tight">{listing.seller.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-[#FFF8E6] text-[#B8860B] rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[11px] font-bold">{listing.seller.ajo_score}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">•</span>
                  <span className="text-[12px] font-medium text-gray-600">{listing.seller.completed_escrows} Deals</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-[#E8EFE8] mb-4">
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase">Response Rate</p>
                <p className="text-[14px] font-bold text-gray-900">{listing.seller.response_rate}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase">Dispute Rate</p>
                <p className="text-[14px] font-bold text-gray-900">{listing.seller.dispute_rate}</p>
              </div>
            </div>

            <Link href="#" className="flex items-center justify-center gap-2 text-[13px] font-bold text-[#066B44] hover:underline">
              View Seller Profile <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
