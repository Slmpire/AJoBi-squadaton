import { useState, useMemo, useEffect } from "react";
import { groupsService } from "@/services/groupsService";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMyGroups, fetchPublicGroups } from "@/store/slices/groupsSlice";

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

export interface MatchedGroup {
  id: string;
  name: string;
  matchRate: number;
  description: string;
  amount: string;
  members: string;
}

export const useGroups = () => {
  const dispatch = useAppDispatch();
  const { myGroups, publicGroups, isLoading, error } = useAppSelector((state) => state.groups);
  console.log(myGroups, "my group");
  console.log(publicGroups, "public groups");
  
  const [activeTab, setActiveTab] = useState<'my' | 'browse' | 'match'>('my');
  
  // Search & States
  const [searchFilter, setSearchFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("Any");
  const [frequencyFilter, setFrequencyFilter] = useState("Any");

  // Matching Engine states
  const [searchQuery, setSearchQuery] = useState("");
  const [matchAmount, setMatchAmount] = useState("50,000");
  const [matchFrequency, setMatchFrequency] = useState<'Monthly' | 'Weekly'>('Monthly');
  const [isMatching, setIsMatching] = useState(false);
  const [showMatches, setShowMatches] = useState(false);

  // Local state for matches since it's a specific interaction
  const [matchedGroups, setMatchedGroups] = useState<MatchedGroup[]>([]);

  const fallbackMatchedGroups: MatchedGroup[] = [
    {
      id: "201",
      name: "Growth Circle #04",
      matchRate: 95,
      description: "Verified professionals with perfect score history.",
      amount: "₦50,000/mo",
      members: "8 Members"
    },
    {
      id: "202",
      name: "Fast Track Weekly",
      matchRate: 85,
      description: "High-velocity group for aggressive savings goals.",
      amount: "₦12,500/wk",
      members: "12 Members"
    },
    {
      id: "203",
      name: "Global Artisans",
      matchRate: 80,
      description: "Safe, beginner-friendly tier with low overhead.",
      amount: "₦20,000/mo",
      members: "20 Members"
    }
  ];

  // Initialize API calls through Redux
  useEffect(() => {
    dispatch(fetchMyGroups());
    dispatch(fetchPublicGroups());
  }, [dispatch]);

  // Trigger AI Match Engine
  const handleFindMatch = async () => {
    setIsMatching(true);
    setShowMatches(false);
    try {
      const numericAmt = parseFloat(matchAmount.replace(/,/g, "")) || 10000;
      const resp = await groupsService.autoMatchGroup({
        contribution_amount: numericAmt,
        frequency: matchFrequency.toLowerCase() as 'weekly' | 'monthly'
      });

      if (resp.success && resp.data?.matches) {
        const mapped = resp.data.matches.map((m: any) => ({
          id: m.match_id,
          name: `Match ${m.match_id.split('_')[1] || 'Circle'}`,
          matchRate: m.compatibility_score,
          description: `Estimated to launch on ${new Date(m.estimated_start_date).toLocaleDateString()}.`,
          amount: `₦${m.contribution_amount.toLocaleString()}/${m.frequency === 'weekly' ? 'wk' : 'mo'}`,
          members: `${m.proposed_members?.length || 0} Members`
        }));
        setMatchedGroups(mapped);
      } else {
        setMatchedGroups(fallbackMatchedGroups);
      }
    } catch {
      setMatchedGroups(fallbackMatchedGroups);
    } finally {
      setIsMatching(false);
      setShowMatches(true);
    }
  };

  // Computational Client Filters on dynamic state payload
  const filteredPublicGroups = useMemo(() => {
    return publicGroups.filter(group => {
      if (searchFilter) {
        const lower = searchFilter.toLowerCase();
        const matchesName = group.name.toLowerCase().includes(lower);
        const matchesAdmin = group.admin.toLowerCase().includes(lower);
        if (!matchesName && !matchesAdmin) return false;
      }
      if (frequencyFilter !== "Any") {
        if (group.frequency !== frequencyFilter) return false;
      }
      if (amountFilter !== "Any") {
        if (amountFilter === "Under ₦50k" && group.rawAmount >= 50000) return false;
        if (amountFilter === "₦50k - ₦200k" && (group.rawAmount < 50000 || group.rawAmount > 200000)) return false;
        if (amountFilter === "Above ₦200k" && group.rawAmount <= 200000) return false;
      }
      return true;
    });
  }, [publicGroups, searchFilter, amountFilter, frequencyFilter]);

  console.log(filteredPublicGroups, "filteredPublicGroups");

  return {
    isLoading,
    activeTab,
    setActiveTab,
    myGroups,
    publicGroups: filteredPublicGroups,
    matchedGroups: showMatches ? matchedGroups : fallbackMatchedGroups,
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    amountFilter,
    setAmountFilter,
    frequencyFilter,
    setFrequencyFilter,
    matchAmount,
    setMatchAmount,
    matchFrequency,
    setMatchFrequency,
    isMatching,
    showMatches,
    handleFindMatch
  };
};
