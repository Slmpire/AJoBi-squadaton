import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchMyGroups } from '@/store/slices/groupsSlice';
import { fetchListings } from '@/store/slices/marketplaceSlice';
import { fetchSavingsOverview } from '@/store/slices/savingsSlice';
import { fetchProfile } from '@/store/slices/settingsSlice';
import { fetchAjoScore, fetchEligibility } from '@/store/slices/scoreSlice';
import { userService, KYCData } from '@/services/userService';
import { useState } from 'react';

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
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [kycLoading, setKycLoading] = useState(false);
  const [virtualAccountLoading, setVirtualAccountLoading] = useState(false);
  const [kycSuccess, setKycSuccess] = useState(false);
  const [kycError, setKycError] = useState<string | null>(null);
  const [virtualAccountData, setVirtualAccountData] = useState<any>(null);
  
  const { myGroups, isLoading: groupsLoading } = useAppSelector((state) => state.groups);
  const { listings, isLoading: marketplaceLoading } = useAppSelector((state) => state.marketplace);
  const { balance, isLoading: savingsLoading } = useAppSelector((state) => state.savings);
  const { profile, isLoading: settingsLoading } = useAppSelector((state) => state.settings);
  const { ajoScore, eligibility, isLoading: scoreLoading } = useAppSelector((state) => state.score);
  const user  = useAppSelector((state) => state.auth.user);
  console.log('user', user);
  console.log('user id', user?.user_id);
  

  const isLoading = groupsLoading || marketplaceLoading || savingsLoading || settingsLoading || scoreLoading;

  useEffect(() => {
    const userId = user?.user_id; 
    
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
      scoreTier: (typeof ajoScore?.tier === 'object' ? (ajoScore.tier as any).name : ajoScore?.tier) || "Bronze",
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

  const handleKYCSubmit = async (kycData: Omit<KYCData, 'user_id'>) => {
    console.log('kycData', kycData);
    if (!user?.user_id) return false;
    setKycLoading(true);
    setKycError(null);
    try {
      const response = await userService.updateKYC({
        ...kycData,
        user_id: user.user_id
      });
      console.log(response)
      if (response.success === 'true') {
        setKycSuccess(true);
        dispatch(fetchProfile());
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('KYC update failed', error);
      setKycError(error.message || 'KYC update failed');
      return false;
    } finally {
      setKycLoading(false);
    }
  };

  const handleCreateVirtualAccount = async () => {
    if (!user?.user_id) return;
    setVirtualAccountLoading(true);
    setKycError(null);
    try {
      const response = await userService.createVirtualAccount(user.user_id);
      if (response.status === 'success') {
        setVirtualAccountData(response.data);
      }
    } catch (error: any) {
      console.error('Virtual account creation failed', error);
      setKycError(error.message || 'Virtual account creation failed');
    } finally {
      setVirtualAccountLoading(false);
    }
  };

  return {
    isLoading,
    data,
    showKYCModal,
    setShowKYCModal,
    kycLoading,
    kycSuccess,
    kycError,
    handleKYCSubmit,
    virtualAccountLoading,
    virtualAccountData,
    handleCreateVirtualAccount,
  };
};
