import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchMyGroups } from '@/store/slices/groupsSlice';
import { fetchListings } from '@/store/slices/marketplaceSlice';
import { fetchSavingsOverview } from '@/store/slices/savingsSlice';
import { fetchProfile } from '@/store/slices/settingsSlice';
import { fetchAjoScore, fetchEligibility } from '@/store/slices/scoreSlice';

export interface DashboardData {
  ajoScore: number;
  scoreTier: string;
  scoreDiff: number;
  activeGroups: {
    name: string;
    nextDate: string;
    status: string;
    amount: string;
  }[];
  activeEscrows: {
    title: string;
    status: string;
    amount: string;
  }[];
  activeInstalments: {
    item: string;
    progress: number;
    paid: string;
    total: string;
  }[];
  recentActivities: {
    id: string;
    type: 'payment' | 'score' | 'view' | 'other';
    title: string;
    subtitle: string;
    timeAgo: string;
  }[];
  improvementTips: string[];
  eligibility: {
    loanEligible: boolean;
    loanMessage: string;
  };
}

export const useDashboardOverview = () => {
  const dispatch = useAppDispatch();
  
  const { myGroups, isLoading: groupsLoading } = useAppSelector((state) => state.groups);
  const { listings, isLoading: marketplaceLoading } = useAppSelector((state) => state.marketplace);
  const { balance, isLoading: savingsLoading } = useAppSelector((state) => state.savings);
  const { profile, isLoading: settingsLoading } = useAppSelector((state) => state.settings);
  const { ajoScore, eligibility, isLoading: scoreLoading } = useAppSelector((state) => state.score);

  const isLoading = groupsLoading || marketplaceLoading || savingsLoading || settingsLoading || scoreLoading;

  useEffect(() => {
    const userId = "user6a02f65ad51313.56219069"; 
    
    dispatch(fetchMyGroups());
    dispatch(fetchListings({ limit: 5 }));
    dispatch(fetchSavingsOverview());
    dispatch(fetchProfile());
    dispatch(fetchAjoScore(userId));
    dispatch(fetchEligibility(userId));
  }, [dispatch]);

  const data = useMemo(() => {
    if (!ajoScore && isLoading) return null;

    return {
      ajoScore: ajoScore?.score || 0,
      scoreTier: ajoScore?.tier || "Bronze",
      scoreDiff: 0,
      activeGroups: myGroups.map(g => ({
        name: g.name,
        nextDate: g.nextPayout,
        status: g.status,
        amount: g.contribution
      })),
      activeEscrows: [
        {
          title: "Emeka's Logo Design",
          status: "In Progress",
          amount: "₦25,000"
        }
      ],
      activeInstalments: listings.filter(l => l.allows_instalment).map(l => ({
        item: l.title,
        progress: 0,
        paid: "₦0",
        total: `₦${l.price.toLocaleString()}`
      })),
      recentActivities: [
        {
          id: "1",
          type: 'payment',
          title: "Contribution collected ₦10,000",
          subtitle: "Sunshine Group • Monthly Cycle",
          timeAgo: "2h ago"
        }
      ],
      improvementTips: ajoScore?.improvement_tips || [],
      eligibility: {
        loanEligible: eligibility?.loan_eligible || false,
        loanMessage: eligibility?.loan_eligibility_message || ""
      }
    } as DashboardData;
  }, [myGroups, listings, balance, profile, ajoScore, eligibility, isLoading]);

  return {
    isLoading,
    data,
  };
};
