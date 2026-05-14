import { useState, useEffect } from 'react';
import { marketplaceService, BrowseListingsParams, ListingItem } from '@/services/marketplaceService';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchListings } from '@/store/slices/marketplaceSlice';

export const useMarketplaceBrowse = () => {
  const dispatch = useAppDispatch();
  const { listings, isLoading, error } = useAppSelector((state) => state.marketplace);
  
  const [params, setParams] = useState<BrowseListingsParams>({
    page: 1,
    limit: 12,
  });

  const loadListings = () => {
    dispatch(fetchListings(params));
  };

  useEffect(() => {
    loadListings();
  }, [params, dispatch]);

  const updateFilters = (newParams: Partial<BrowseListingsParams>) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }));
  };

  return {
    listings,
    isLoading,
    error,
    params,
    updateFilters,
    refresh: loadListings
  };
};
