import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  groupsService, 
  BrowseGroupsParams, 
  CreateGroupPayload, 
  JoinGroupPayload, 
  AutoMatchPayload, 
  MandatePayload 
} from '@/services/groupsService';

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
  currentGroupDetail: any | null;
  matchedGroups: any[];
  contributionHistory: any[];
  isLoading: boolean;
  isCreating: boolean;
  isJoining: boolean;
  isMatching: boolean;
  error: string | null;
  createError: string | null;
  joinError: string | null;
  matchError: string | null;
}

const initialState: GroupsState = {
  myGroups: [],
  publicGroups: [],
  currentGroupDetail: null,
  matchedGroups: [],
  contributionHistory: [],
  isLoading: false,
  isCreating: false,
  isJoining: false,
  isMatching: false,
  error: null,
  createError: null,
  joinError: null,
  matchError: null,
};

export const fetchMyGroups = createAsyncThunk(
  'groups/fetchMyGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await groupsService.getMyGroups();
      console.log("my groups", response.data);
      if (response.success && response.data?.groups) {
        return response.data.groups.map((g: any) => ({
          id: g.group_id,
          name: g.name,
          type: `${g.frequency.charAt(0).toUpperCase() + g.frequency.slice(1)} Contribution`,
          contribution: `₦${parseFloat(g.contribution_amount).toLocaleString()}`,
          nextPayout: g.next_contribution_date ? new Date(g.next_contribution_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
          position: `${g.my_rotation_position} in line`,
          status: g.my_contribution_status === 'paid' ? 'Paid' : g.my_contribution_status === 'missed' ? 'Missed' : 'Pending',
          members: g.total_cycles,
          avatars: []
        }));
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const fetchPublicGroups = createAsyncThunk(
  'groups/fetchPublicGroups',
  async (params: BrowseGroupsParams | undefined, { rejectWithValue }) => {
    try {
      const response = await groupsService.browseGroups(params);
      console.log("public groups", response.data);
      if (response.success && response.data?.groups) {
        return response.data.groups.map((g: any) => ({
          id: g.group_id,
          name: g.name,
          admin: g.creator_name || "Admin",
          amount: `₦${(parseFloat(g.contribution_amount) / 1000)}K/${g.frequency === 'weekly' ? 'wk' : g.frequency === 'monthly' ? 'mo' : 'bw'}`,
          rawAmount: parseFloat(g.contribution_amount),
          frequency: g.frequency === 'weekly' ? 'Weekly' : g.frequency === 'monthly' ? 'Monthly' : 'Bi-Weekly',
          slots: `${g.spots_remaining} of ${g.max_members} available`,
          minScore: g.min_ajo_score,
          locked: g.locked === 'locked',
          tierRequired: g.tier
        }));
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (payload: CreateGroupPayload, { rejectWithValue }) => {
    try {
      const response = await groupsService.createGroup(payload);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error?.message || 'Failed to create group');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const fetchGroupDetail = createAsyncThunk(
  'groups/fetchGroupDetail',
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await groupsService.getGroupDetail(groupId);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch group details');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const joinGroup = createAsyncThunk(
  'groups/joinGroup',
  async ({ groupId, payload }: { groupId: string; payload: JoinGroupPayload }, { rejectWithValue }) => {
    try {
      const response = await groupsService.joinGroup(groupId, payload);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to join group');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const autoMatchGroup = createAsyncThunk(
  'groups/autoMatchGroup',
  async (payload: AutoMatchPayload, { rejectWithValue }) => {
    try {
      const response = await groupsService.autoMatchGroup(payload);
      if (response.success) {
        return response.data.matches;
      }
      return rejectWithValue('Failed to match group');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const setupDirectDebitMandate = createAsyncThunk(
  'groups/setupDirectDebitMandate',
  async ({ groupId, payload }: { groupId: string; payload: MandatePayload }, { rejectWithValue }) => {
    try {
      const response = await groupsService.setupDirectDebitMandate(groupId, payload);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to setup mandate');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const fetchGroupContributionHistory = createAsyncThunk(
  'groups/fetchGroupContributionHistory',
  async ({ groupId, cycle }: { groupId: string; cycle?: string }, { rejectWithValue }) => {
    try {
      const response = await groupsService.getGroupContributionHistory(groupId, cycle);
      if (response.success) {
        return response.data.contributions;
      }
      return rejectWithValue('Failed to fetch contribution history');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearMatchError: (state) => {
      state.matchError = null;
    },
    clearJoinError: (state) => {
      state.joinError = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    }
  },
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
      })

      .addCase(createGroup.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createGroup.fulfilled, (state) => {
        state.isCreating = false;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })

      .addCase(fetchGroupDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGroupDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGroupDetail = action.payload;
      })
      .addCase(fetchGroupDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(joinGroup.pending, (state) => {
        state.isJoining = true;
        state.joinError = null;
      })
      .addCase(joinGroup.fulfilled, (state) => {
        state.isJoining = false;
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.isJoining = false;
        state.joinError = action.payload as string;
      })

      .addCase(autoMatchGroup.pending, (state) => {
        state.isMatching = true;
        state.matchError = null;
      })
      .addCase(autoMatchGroup.fulfilled, (state, action) => {
        state.isMatching = false;
        state.matchedGroups = action.payload;
      })
      .addCase(autoMatchGroup.rejected, (state, action) => {
        state.isMatching = false;
        state.matchError = action.payload as string;
      })

      .addCase(fetchGroupContributionHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGroupContributionHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contributionHistory = action.payload;
      })
      .addCase(fetchGroupContributionHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMatchError, clearJoinError, clearCreateError } = groupsSlice.actions;

export default groupsSlice.reducer;
