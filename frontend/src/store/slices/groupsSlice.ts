import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { groupsService, BrowseGroupsParams } from '@/services/groupsService';

export interface GroupItem {
  id: string;
  name: string;
  type: string;
  contribution: string;
  nextPayout: string;
  position: string;
  status: 'Paid' | 'Pending' | 'Missed';
  members: number;
  avatars: string[];
}

export interface PublicGroup {
  id: string;
  name: string;
  admin: string;
  amount: string;
  rawAmount: number;
  frequency: "Monthly" | "Weekly" | "Bi-Weekly";
  slots: string;
  minScore: number;
  locked?: boolean;
  tierRequired?: string;
}

interface GroupsState {
  myGroups: GroupItem[];
  publicGroups: PublicGroup[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  myGroups: [],
  publicGroups: [],
  isLoading: false,
  error: null,
};

export const fetchMyGroups = createAsyncThunk(
  'groups/fetchMyGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await groupsService.getMyGroups();
      if (response.success && response.data?.groups) {
        return response.data.groups.map((g: any) => ({
          id: g.group_id,
          name: g.name,
          type: `${g.frequency.charAt(0).toUpperCase() + g.frequency.slice(1)} Contribution`,
          contribution: `₦${g.contribution_amount.toLocaleString()}`,
          nextPayout: new Date(g.next_contribution_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          position: `${g.my_rotation_position} in line`,
          status: g.my_contribution_status === 'paid' ? 'Paid' : g.my_contribution_status === 'missed' ? 'Missed' : 'Pending',
          members: g.total_cycles,
          avatars: []
        }));
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPublicGroups = createAsyncThunk(
  'groups/fetchPublicGroups',
  async (params: BrowseGroupsParams | undefined, { rejectWithValue }) => {
    try {
      const response = await groupsService.browseGroups(params);
      if (response.success && response.data?.groups) {
        return response.data.groups.map((g: any) => ({
          id: g.group_id,
          name: g.name,
          admin: g.creator_name || "Admin",
          amount: `₦${(g.contribution_amount / 1000)}K/${g.frequency === 'weekly' ? 'wk' : 'mo'}`,
          rawAmount: g.contribution_amount,
          frequency: g.frequency === 'weekly' ? 'Weekly' : 'Monthly',
          slots: `${g.spots_remaining} of ${g.max_members} available`,
          minScore: g.min_ajo_score,
          locked: g.locked,
          tierRequired: g.tier
        }));
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyGroups.fulfilled, (state, action: PayloadAction<GroupItem[]>) => {
        state.isLoading = false;
        state.myGroups = action.payload;
      })
      .addCase(fetchMyGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPublicGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPublicGroups.fulfilled, (state, action: PayloadAction<PublicGroup[]>) => {
        state.isLoading = false;
        state.publicGroups = action.payload;
      })
      .addCase(fetchPublicGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default groupsSlice.reducer;
