import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { marketplaceService, BrowseListingsParams, ListingItem } from '@/services/marketplaceService';

interface MarketplaceState {
  listings: ListingItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MarketplaceState = {
  listings: [],
  isLoading: false,
  error: null,
};

export const fetchListings = createAsyncThunk(
  'marketplace/fetchListings',
  async (params: BrowseListingsParams, { rejectWithValue }) => {
    try {
      const response = await marketplaceService.browseListings(params);
      if (response.success && response.data.listings) {
        return response.data.listings;
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchListings.fulfilled, (state, action: PayloadAction<ListingItem[]>) => {
        state.isLoading = false;
        state.listings = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default marketplaceSlice.reducer;
