import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, UserData } from '@/services/authService';

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<UserData | null>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setAuthError } = authSlice.actions;
export default authSlice.reducer;
