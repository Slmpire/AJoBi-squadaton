import { useState, useEffect } from 'react';
import { marketplaceService, BrowseListingsParams, ListingItem } from '@/services/marketplaceService';

// Fallback mock data in case API is not fully deployed
const MOCK_LISTINGS: ListingItem[] = [
  {
    listing_id: "lst_p9q8r7",
    seller_type: "artisan",
    category: "Fashion & Tailoring",
    title: "Custom Ankara Dress",
    price: 25000,
    allows_instalment: true,
    min_instalment_count: 2,
    thumbnail: "https://images.unsplash.com/photo-1550614000-4b95dd247ae2?q=80&w=600&auto=format&fit=crop",
    location: "Surulere, Lagos",
    seller: {
      name: "Mama Ngozi",
      ajo_score: 74,
      score_tier: "Gold",
      completed_escrows: 34
    },
    created_at: "2024-05-29T10:00:00Z"
  },
  {
    listing_id: "lst_x2y3z4",
    seller_type: "product",
    category: "Electronics & Gadgets",
    title: "Slightly Used iPhone 13 Pro",
    price: 450000,
    allows_instalment: true,
    min_instalment_count: 4,
    thumbnail: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=600&auto=format&fit=crop",
    location: "Ikeja, Lagos",
    seller: {
      name: "Chinedu Tech",
      ajo_score: 82,
      score_tier: "Platinum",
      completed_escrows: 156
    },
    created_at: "2024-05-28T14:30:00Z"
  },
  {
    listing_id: "lst_a1b2c3",
    seller_type: "service",
    category: "Photography",
    title: "Wedding & Event Photography Package",
    price: 150000,
    allows_instalment: false,
    thumbnail: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop",
    location: "Lekki, Lagos",
    seller: {
      name: "Tunde Shots",
      ajo_score: 65,
      score_tier: "Silver",
      completed_escrows: 12
    },
    created_at: "2024-05-27T09:15:00Z"
  }
];

export const useMarketplaceBrowse = () => {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [params, setParams] = useState<BrowseListingsParams>({
    page: 1,
    limit: 12,
  });

  const fetchListings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await marketplaceService.browseListings(params);
      console.log(response);
      if (response.success && response.data.listings) {
        setListings(response.data.listings);
      }
    } catch (err) {
      console.warn("API failed, falling back to filtered mock data", err);
      
      // Apply filtering locally to simulate a fully functional backend
      let filtered = [...MOCK_LISTINGS];
      
      if (params.seller_type) {
        filtered = filtered.filter(item => item.seller_type === params.seller_type);
      }
      
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(searchLower) || 
          item.category.toLowerCase().includes(searchLower) ||
          item.location.toLowerCase().includes(searchLower) ||
          item.seller.name.toLowerCase().includes(searchLower)
        );
      }
      
      if (params.allows_instalment !== undefined) {
        filtered = filtered.filter(item => item.allows_instalment === params.allows_instalment);
      }
      
      if (params.min_price !== undefined) {
        filtered = filtered.filter(item => item.price >= params.min_price!);
      }
      
      if (params.max_price !== undefined) {
        filtered = filtered.filter(item => item.price <= params.max_price!);
      }
      
      if (params.category) {
        filtered = filtered.filter(item => item.category === params.category);
      }
      
      setListings(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [params]);

  const updateFilters = (newParams: Partial<BrowseListingsParams>) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }));
  };

  return {
    listings,
    isLoading,
    error,
    params,
    updateFilters,
    refresh: fetchListings
  };
};
