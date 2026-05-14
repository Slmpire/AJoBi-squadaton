import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import groupsReducer from './slices/groupsSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import savingsReducer from './slices/savingsSlice';
import settingsReducer from './slices/settingsSlice';
import scoreReducer from './slices/scoreSlice';

export const store = configureStore({
  reducer: {
    groups: groupsReducer,
    marketplace: marketplaceReducer,
    savings: savingsReducer,
    settings: settingsReducer,
    score: scoreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
