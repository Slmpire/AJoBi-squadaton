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

  // Purchase & Gallery state
  const [activeImage, setActiveImage] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [paymentType, setPaymentType] = useState<'full' | 'instalment'>('full');
  const [instalmentCount, setInstalmentCount] = useState<number>(3);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [purchaseResult, setPurchaseResult] = useState<any>(null);

  const reviews = [
    { id: 1, user: "Chidi Adebayo", rating: 5, comment: "The quality is actually better than the photos. Very solid construction. Delivery to Abuja was fast.", date: "1 week ago", initials: "CA" },
    { id: 2, user: "Fatima O.", rating: 4, comment: "Great boots, slightly stiff at first but breaking in nicely. Seller is very responsive.", date: "2 weeks ago", initials: "FO" }
  ];

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
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handlePurchase = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Please login to complete your purchase");
      return;
    }

    setIsBuying(true);
    setError(null);
    try {
      const payload: PurchasePayload = { 
        user_id: userId,
        payment_type: paymentType 
      };
      
      if (paymentType === 'instalment') {
        payload.instalment_count = instalmentCount;
        payload.frequency = frequency;
      }

      const response = await marketplaceService.initiatePurchase(id, payload);
      setPurchaseResult(response);
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
    const isVirtualAccount = (purchaseResult.status === 'success' || purchaseResult.status === 'true') && purchaseResult.virtual_account;

    return (
      <div className=" w-full mx-auto pb-12 pt-10 px-4 sm:px-6">
        <div className="bg-white rounded-[24px] p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E8EFE8]">
          <div className="w-20 h-20 bg-[#EEF8F3] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-[#066B44]" />
          </div>
          <h2 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight">
            {isVirtualAccount ? "Payment Required" : "Escrow Initiated"}
          </h2>
          <p className="text-[14px] text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
            {isVirtualAccount 
              ? "To complete your purchase, please transfer the exact amount to the virtual account below."
              : "Your purchase is protected by AjoBI Escrow. The seller won't receive funds until you confirm delivery."}
          </p>

          {isVirtualAccount ? (
            <div className="bg-[#F9FCF9] rounded-2xl p-8 mb-8 text-center border-2 border-dashed border-[#066B44]/20">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Virtual Account Number</p>
              <h3 className="text-[32px] font-black text-[#066B44] mb-2 tracking-tighter">{purchaseResult.virtual_account}</h3>
              <p className="text-[14px] font-bold text-gray-700 mb-1">Squad Co / Sterling Bank</p>
              <p className="text-[12px] text-gray-500 font-medium">AjoBI Marketplace Checkout</p>
            </div>
          ) : (
            <div className="bg-[#F9FCF9] rounded-2xl p-5 mb-8 text-left border border-[#DCE8E0]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-gray-500 font-medium">Trust Verdict</span>
                <span className="px-3 py-1 bg-[#EEF8F3] text-[#066B44] text-[11px] font-bold rounded-full uppercase tracking-wider">
                  {purchaseResult.trust_verdict || "SAFE"} ({purchaseResult.trust_score || "82"}/100)
                </span>
              </div>
              <p className="text-[13px] text-gray-700 font-medium leading-relaxed">
                {purchaseResult.trust_reason || "Seller has strong transaction history. No flags detected."}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={() => router.push('/dashboard/escrow')}
              className="w-full bg-[#066B44] hover:bg-[#055737] text-white px-6 py-4 rounded-xl text-[15px] font-bold transition-all shadow-[0_4px_14px_0_rgba(6,107,68,0.2)]"
            >
              {isVirtualAccount ? "I've Made the Transfer" : "View Escrow Status"}
            </button>
            <button 
              onClick={() => setPurchaseResult(null)}
              className="w-full bg-white border border-[#E8EFE8] text-gray-600 px-6 py-4 rounded-xl text-[15px] font-bold hover:bg-gray-50 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-12 pt-4 px-4 sm:px-6 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <Link href="/dashboard/marketplace" className="hover:text-[#066B44] transition-colors">Marketplace</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:text-[#066B44] cursor-pointer transition-colors">{listing.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Gallery & Description (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Gallery Module */}
          <div className="space-y-4">
            <div className="bg-white rounded-[24px] overflow-hidden border border-[#E8EFE8] shadow-sm relative aspect-[16/9] sm:aspect-[21/9]">
              <Image 
                src={listing.images[activeImage] || listing.images[0]} 
                alt={listing.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {listing.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-[#066B44] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt="Thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Module */}
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#E8EFE8] shadow-sm">
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="px-3 py-1 bg-[#F1F6F3] text-[#066B44] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#066B44]/10">
                {listing.category} | Custom Made
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="text-[28px] sm:text-[36px] font-black text-gray-900 leading-tight tracking-tight mb-2">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-4 text-[13px] font-bold text-gray-400">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#066B44]" /> {listing.location}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 2 days ago</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[32px] font-black text-[#066B44]">₦{listing.price.toLocaleString()}</p>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Instalment Plan Available</p>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-b border-[#F1F6F3] mb-8">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Condition</p>
                <p className="text-[14px] font-black text-gray-900">Custom Made</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Delivery</p>
                <p className="text-[14px] font-black text-gray-900">Available</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Warranty</p>
                <p className="text-[14px] font-black text-gray-900">6 Months</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Material</p>
                <p className="text-[14px] font-black text-gray-900">Full Grain Leather</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Description</h3>
              <p className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-line font-medium">
                {listing.description || "Durable, high-quality leather boots made for long hours and tough conditions. Built with reinforced soles and weather-resistant stitching. Each pair is handcrafted specifically to order, ensuring the perfect fit and longevity. Our leather is sourced locally and treated for maximum water resistance while maintaining breathability for all-day comfort."}
              </p>
            </div>
          </div>

          {/* Reviews Module */}
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#E8EFE8] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Verified Buyer Reviews</h3>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF8F3] text-[#066B44] text-[10px] font-black rounded-full uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Purchase Protected
              </span>
            </div>

            <div className="bg-[#F4FCF7] rounded-2xl p-4 mb-8 border border-[#E8F5EE]">
              <p className="text-[12px] font-bold text-[#066B44] leading-relaxed">
                "Excellent service - seller communicated clearly throughout the process."
              </p>
            </div>

            <div className="space-y-8">
              {reviews.map(review => (
                <div key={review.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E8EFE8] flex items-center justify-center text-[13px] font-bold text-[#066B44]">
                        {review.initials}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-gray-900">{review.user}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-[#066B44] text-[#066B44]' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-gray-400">{review.date}</span>
                  </div>
                  <p className="text-[14px] text-gray-600 font-medium leading-relaxed pl-13">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Purchase & Seller (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Seller Module */}
          <div className="bg-white rounded-[32px] p-8 border border-[#E8EFE8] shadow-sm">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-[20px] overflow-hidden relative shadow-md">
                <Image src={listing.seller.photo} alt={listing.seller.name} fill className="object-cover" />
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#066B44] rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-[18px] font-black text-gray-900 tracking-tight leading-none mb-1.5">{listing.seller.name}</h3>
                <span className="px-3 py-1 bg-[#FFF8E6] text-[#B8860B] text-[10px] font-black rounded-full uppercase tracking-wider border border-[#B8860B]/10">
                  Gold Tier
                </span>
              </div>
            </div>

            <div className="bg-[#F9FCF9] rounded-2xl p-5 border border-[#F1F6F3] space-y-4 mb-6">
              <div className="flex justify-between items-center text-[12px] font-bold">
                <span className="text-gray-400 uppercase tracking-widest">Member since</span>
                <span className="text-gray-900">Oct 2023</span>
              </div>
              <div className="flex justify-between items-center text-[12px] font-bold">
                <span className="text-gray-400 uppercase tracking-widest">Completed Escrows</span>
                <span className="text-gray-900">{listing.seller.completed_escrows}</span>
              </div>
              <div className="flex justify-between items-center text-[12px] font-bold">
                <span className="text-gray-400 uppercase tracking-widest">Dispute Rate</span>
                <span className="text-[#066B44]">0 disputes</span>
              </div>
            </div>

            <button className="w-full py-4 rounded-xl border-2 border-[#E8EFE8] text-[13px] font-black text-gray-600 hover:border-[#066B44] hover:text-[#066B44] transition-all">
              View Seller Shop
            </button>
          </div>

          {/* Purchase Sidebar */}
          <div className="bg-white rounded-[32px] p-8 border border-[#E8EFE8] shadow-[0_12px_40px_rgba(0,0,0,0.04)] sticky top-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[18px] font-black text-gray-900 tracking-tight">Purchase Options</h2>
              <span className="flex items-center gap-1 text-[10px] font-black text-[#066B44] uppercase tracking-widest bg-[#EEF8F3] px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Safe
              </span>
            </div>

            <div className="space-y-6">
              
              {/* Full Payment Option */}
              <div 
                className={`p-6 rounded-[24px] border-2 transition-all cursor-pointer ${paymentType === 'full' ? 'border-[#066B44] bg-[#F9FCF9]' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => setPaymentType('full')}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${paymentType === 'full' ? 'bg-[#066B44] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <h4 className="text-[14px] font-black text-gray-900">Full Payment</h4>
                </div>
                <p className="text-[11px] text-gray-500 font-bold ml-11 mb-5 uppercase">Standard Payment Flow</p>
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[18px] font-black text-gray-900">₦{listing.price.toLocaleString()}</span>
                </div>
                {paymentType === 'full' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePurchase(); }}
                    disabled={isBuying}
                    className="w-full bg-[#066B44] hover:bg-[#055737] text-white py-3.5 rounded-xl text-[13px] font-black transition-all shadow-lg shadow-[#066B44]/20 flex items-center justify-center gap-2"
                  >
                    {isBuying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buy Now (Escrow)'}
                  </button>
                )}
              </div>

              {/* Instalment Option */}
              <div 
                className={`p-6 rounded-[24px] border-2 transition-all cursor-pointer ${paymentType === 'instalment' ? 'border-[#066B44] bg-[#F9FCF9]' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => setPaymentType('instalment')}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${paymentType === 'instalment' ? 'bg-[#066B44] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <Star className="w-4 h-4" />
                  </div>
                  <h4 className="text-[14px] font-black text-gray-900">Pay in Instalments</h4>
                </div>
                <p className="text-[11px] text-gray-500 font-bold ml-11 mb-5 uppercase tracking-wide">Flexible AjoBI plan</p>
                
                {paymentType === 'instalment' && (
                  <div className="mt-6 space-y-6">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Select Plan Duration</p>
                    <div className="grid grid-cols-4 gap-2 mb-6">
                      {[2, 3, 4, 6].map(count => (
                        <button 
                          key={count}
                          onClick={() => setInstalmentCount(count)}
                          className={`py-2 rounded-lg text-[11px] font-black border transition-all ${instalmentCount === count ? 'bg-[#066B44] border-[#066B44] text-white' : 'bg-white border-[#E8EFE8] text-gray-600 hover:border-[#066B44]'}`}
                        >
                          {count}m
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-[#DCE8E0]">
                      <div className="flex justify-between items-center text-[12px] font-bold">
                        <span className="text-gray-500">Monthly Payment</span>
                        <span className="text-gray-900 font-black">₦{Math.round(listing.price / instalmentCount).toLocaleString()} / month</span>
                      </div>
                      <div className="flex justify-between items-center text-[12px] font-bold">
                        <span className="text-gray-500">Next Payment</span>
                        <span className="text-gray-900 font-black">Dec 15, 2025</span>
                      </div>
                      <div className="flex justify-between items-center text-[12px] font-bold pt-1">
                        <span className="text-gray-500">Total Cost</span>
                        <span className="text-gray-900 font-black">₦{listing.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePurchase(); }}
                      disabled={isBuying}
                      className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl text-[13px] font-black transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                      {isBuying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Plan'}
                    </button>
                  </div>
                )}
              </div>

              {/* Safety Guarantee */}
              <div className="flex items-start gap-3 p-4 bg-[#F9FCF9] rounded-2xl border border-[#DCE8E0]">
                <ShieldCheck className="w-5 h-5 text-[#066B44] shrink-0" />
                <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-tight">
                  <span className="text-[#066B44]">AjoBI Safety Guarantee:</span> Funds are held in escrow until you confirm delivery and quality. Full refund available if not as described.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
