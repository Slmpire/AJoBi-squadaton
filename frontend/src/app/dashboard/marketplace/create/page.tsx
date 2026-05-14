"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Check, Loader2, X, Plus, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { marketplaceService, CreateListingPayload } from "@/services/marketplaceService";

const CATEGORIES = {
  product: [
    "Electronics & Gadgets", "Fashion & Clothing", "Food & Groceries",
    "Home & Furniture", "Beauty & Personal Care", "Agricultural Produce",
    "Books & Stationery", "Baby & Kids", "Auto Parts", "Industrial & Equipment"
  ],
  artisan: [
    "Fashion & Tailoring", "Footwear", "Furniture & Woodwork",
    "Art & Paintings", "Jewellery & Beadwork", "Leather Goods",
    "Ceramics & Pottery", "Candles & Soaps", "Baskets & Weaving"
  ],
  service: [
    "Mechanics & Auto Repair", "Electrical", "Plumbing",
    "Graphic Design", "Photography", "Makeup & Beauty",
    "Event Planning", "Catering", "Cleaning", "Tutoring",
    "Hair Styling", "Interior Decoration"
  ]
};

export default function CreateListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateListingPayload>({
    seller_type: "product",
    category: "",
    title: "",
    description: "",
    price: 0,
    images: [],
    location: "",
    condition: null,
    delivery_available: false,
    lead_time: "",
    allows_instalment: false,
    min_instalment_count: 2
  });

  const updateForm = (key: keyof CreateListingPayload, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: value };
      // Reset category if seller_type changes
      if (key === 'seller_type') {
        updated.category = "";
        updated.condition = value === 'product' ? 'New' : null;
      }
      return updated;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter out files that are too large (5MB)
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length) {
      alert("Some files were too large and were skipped (max 5MB).");
    }

    const newImages = [...selectedImages, ...validFiles];
    setSelectedImages(newImages);

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Convert images to base64 if any are selected
      const base64Images = await Promise.all(
        selectedImages.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
        })
      );

      const payloadToSubmit = {
        ...formData,
        user_id: sessionStorage.getItem("userId") as string,
        images: base64Images.length ? base64Images : formData.images
      };

      const response = await marketplaceService.createListing(payloadToSubmit);
      console.log(response)
      if (response.success) {
        router.push("/dashboard/marketplace");
      } else {
        setError(response.error?.message || "Failed to create listing");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while creating your listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto pb-12 pt-4 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/dashboard/marketplace"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#E8EFE8] text-gray-600 hover:text-[#066B44] hover:border-[#066B44] transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-[28px] font-bold text-[#066B44] tracking-tight">
            Create Listing
          </h1>
          <p className="text-[14px] text-gray-500 font-medium mt-0.5">
            Offer your products or services to the AjoBI community.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-[24px] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#E8EFE8]">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[13px] font-bold border border-red-100">
            {error}
          </div>
        )}

        {/* What are you selling? */}
        <div className="space-y-6">
          <h2 className="text-[16px] font-bold text-gray-900 border-b border-[#E8EFE8] pb-3">Basic Information</h2>
          
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-gray-700 tracking-wide uppercase">I am selling a</label>
            <div className="grid grid-cols-3 gap-3">
              {(['product', 'artisan', 'service'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateForm('seller_type', type)}
                  className={`py-3.5 rounded-xl text-[14px] font-bold border shadow-sm transition-all flex items-center justify-center gap-2 ${
                    formData.seller_type === type
                      ? 'bg-[#066B44] border-[#066B44] text-white'
                      : 'bg-[#F1F6F3] border-transparent text-gray-600 hover:border-[#DCE8E0]'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {formData.seller_type === type && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold text-gray-700 tracking-wide">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => updateForm('category', e.target.value)}
                className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all appearance-none"
              >
                <option value="" disabled>Select a category</option>
                {CATEGORIES[formData.seller_type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold text-gray-700 tracking-wide">Price (₦)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price || ''}
                onChange={(e) => updateForm('price', Number(e.target.value))}
                placeholder="e.g. 25000"
                className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[12px] font-bold text-gray-700 tracking-wide">Listing Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => updateForm('title', e.target.value)}
              placeholder="e.g. Custom Ankara Dress"
              className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[12px] font-bold text-gray-700 tracking-wide">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => updateForm('description', e.target.value)}
              placeholder="Describe what you are offering in detail..."
              className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8EFE8] pb-3">
            <h2 className="text-[16px] font-bold text-gray-900">Photos</h2>
            <span className="text-[12px] font-medium text-gray-500">{selectedImages.length} of 5 images</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-[#E8EFE8] group shadow-sm">
                <img 
                  src={preview} 
                  alt={`Preview ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 shadow-md hover:bg-red-500 hover:text-white transition-all scale-0 group-hover:scale-100"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-[#066B44]/80 backdrop-blur-[2px] text-white text-[10px] font-bold py-1 text-center uppercase tracking-wider">
                    Main Photo
                  </div>
                )}
              </div>
            ))}

            {selectedImages.length < 5 && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-[#DCE8E0] rounded-2xl flex flex-col items-center justify-center text-center hover:bg-[#F9FCF9] transition-all cursor-pointer group hover:border-[#066B44]/30"
              >
                <div className="w-10 h-10 bg-[#F1F6F3] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#E8F1EB] transition-colors">
                  <Plus className="w-5 h-5 text-[#066B44]" />
                </div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Add Photo</span>
              </div>
            )}
          </div>

          {selectedImages.length === 0 && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#DCE8E0] rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-[#F9FCF9] transition-colors cursor-pointer group"
            >
              <div className="w-14 h-14 bg-[#F1F6F3] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#E8F1EB] transition-colors">
                <Upload className="w-6 h-6 text-[#066B44]" />
              </div>
              <p className="text-[14px] font-bold text-gray-900 mb-1">Click to upload images</p>
              <p className="text-[12px] text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
          )}

          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Logistics & Payment */}
        <div className="space-y-6">
          <h2 className="text-[16px] font-bold text-gray-900 border-b border-[#E8EFE8] pb-3">Logistics & Payment</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold text-gray-700 tracking-wide">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => updateForm('location', e.target.value)}
                placeholder="e.g. Surulere, Lagos"
                className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all"
              />
            </div>

            {formData.seller_type === 'product' && (
              <div className="space-y-1.5">
                <label className="block text-[12px] font-bold text-gray-700 tracking-wide">Condition</label>
                <select
                  required
                  value={formData.condition || ''}
                  onChange={(e) => updateForm('condition', e.target.value)}
                  className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all appearance-none"
                >
                  <option value="" disabled>Select condition</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>
              </div>
            )}

            {(formData.seller_type === 'artisan' || formData.seller_type === 'service') && (
              <div className="space-y-1.5">
                <label className="block text-[12px] font-bold text-gray-700 tracking-wide">Lead Time / Availability</label>
                <input
                  type="text"
                  required
                  value={formData.lead_time}
                  onChange={(e) => updateForm('lead_time', e.target.value)}
                  placeholder="e.g. 7-14 days"
                  className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all"
                />
              </div>
            )}
          </div>

          <div className="p-5 bg-[#F9FCF9] rounded-2xl border border-[#DCE8E0] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-bold text-gray-900">Allow Instalment Payments?</p>
                <p className="text-[12px] text-gray-500">Buyers can pay in parts via AjoBI Escrow</p>
              </div>
              <button 
                type="button"
                onClick={() => updateForm('allows_instalment', !formData.allows_instalment)}
                className={`w-[44px] h-[24px] rounded-full relative cursor-pointer shadow-inner focus:outline-none transition-all ${formData.allows_instalment ? 'bg-[#066B44]' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-all ${formData.allows_instalment ? 'left-[22px]' : 'left-[2px]'}`} />
              </button>
            </div>

            {formData.allows_instalment && (
              <div className="space-y-1.5 pt-3 border-t border-[#E8EFE8]">
                <label className="block text-[12px] font-bold text-gray-700 tracking-wide">Min. Number of Instalments Allowed</label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={formData.min_instalment_count}
                  onChange={(e) => updateForm('min_instalment_count', Number(e.target.value))}
                  className="w-full sm:w-1/2 bg-white border border-[#DCE8E0] rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 focus:border-[#066B44] outline-none transition-all"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-[#E8EFE8] flex items-center justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#066B44] hover:bg-[#055737] text-white px-8 py-3.5 rounded-xl text-[14px] font-bold transition-all shadow-[0_4px_14px_0_rgba(6,107,68,0.2)] hover:shadow-[0_6px_20px_rgba(6,107,68,0.15)] hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating Listing...</>
            ) : (
              "Publish Listing"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
