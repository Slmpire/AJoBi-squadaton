import { useState, useMemo, useEffect } from "react";
import { groupsService } from "@/services/groupsService";

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

  // Live API States
  const [myGroups, setMyGroups] = useState<GroupItem[]>([]);
  const [publicGroups, setPublicGroups] = useState<PublicGroup[]>([]);
  const [matchedGroups, setMatchedGroups] = useState<MatchedGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackMyGroups: GroupItem[] = [
    {
      id: "1",
      name: "Lagos Techies",
      type: "Monthly Contribution",
      contribution: "₦50,000",
      nextPayout: "Oct 24, 2024",
      position: "3rd in line",
      status: "Paid",
      members: 8,
      avatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
      ]
    },
    {
      id: "2",
      name: "Family Fund",
      type: "Weekly Contribution",
      contribution: "₦25,000",
      nextPayout: "Tomorrow",
      position: "1st in line",
      status: "Pending",
      members: 4,
      avatars: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
      ]
    },
    {
      id: "3",
      name: "Startup Circle",
      type: "Bi-Weekly Contribution",
      contribution: "₦100,000",
      nextPayout: "Nov 10, 2024",
      position: "12th in line",
      status: "Missed",
      members: 12,
      avatars: [
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
      ]
    }
  ];

  const fallbackPublicGroups: PublicGroup[] = [
    {
      id: "101",
      name: "Tunde's Elite Circle",
      admin: "Tunde O.",
      amount: "₦250K/mo",
      rawAmount: 250000,
      frequency: "Monthly",
      slots: "2 of 10 available",
      minScore: 750
    },
    {
      id: "102",
      name: "Lagos Blue Chips",
      admin: "Sarah J.",
      amount: "₦1M/mo",
      rawAmount: 1000000,
      frequency: "Monthly",
      slots: "Full",
      minScore: 900,
      locked: true,
      tierRequired: "Tier 3"
    },
    {
      id: "103",
      name: "Abuja Traders Alliance",
      admin: "Ahmed M.",
      amount: "₦45K/wk",
      rawAmount: 45000,
      frequency: "Weekly",
      slots: "5 of 12 available",
      minScore: 600
    },
    {
      id: "104",
      name: "Tech Starter Pack",
      admin: "Chioma D.",
      amount: "₦20K/wk",
      rawAmount: 20000,
      frequency: "Weekly",
      slots: "8 of 15 available",
      minScore: 450
    },
    {
      id: "105",
      name: "Cooperative Real Estate",
      admin: "Banky W.",
      amount: "₦150K/bw",
      rawAmount: 150000,
      frequency: "Bi-Weekly",
      slots: "1 of 8 available",
      minScore: 700
    }
  ];

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

  // Initialize API calls
  useEffect(() => {
    const fetchAllGroups = async () => {
      setIsLoading(true);
      try {
        // 1. Load My Groups
        try {
          const myResp = await groupsService.getMyGroups();
          if (myResp.success && myResp.data?.groups) {
            const mapped = myResp.data.groups.map((g: any) => ({
              id: g.group_id,
              name: g.name,
              type: `${g.frequency.charAt(0).toUpperCase() + g.frequency.slice(1)} Contribution`,
              contribution: `₦${g.contribution_amount.toLocaleString()}`,
              nextPayout: new Date(g.next_contribution_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              position: `${g.my_rotation_position} in line`,
              status: g.my_contribution_status === 'paid' ? 'Paid' : g.my_contribution_status === 'missed' ? 'Missed' : 'Pending',
              members: g.total_cycles, // approximation or total member spots
              avatars: []
            }));
            setMyGroups(mapped);
          } else {
            setMyGroups(fallbackMyGroups);
          }
        } catch {
          setMyGroups(fallbackMyGroups);
        }

        // 2. Load Public Groups
        try {
          const publicResp = await groupsService.browseGroups();
          if (publicResp.success && publicResp.data?.groups) {
            const mapped = publicResp.data.groups.map((g: any) => ({
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
            setPublicGroups(mapped);
          } else {
            setPublicGroups(fallbackPublicGroups);
          }
        } catch {
          setPublicGroups(fallbackPublicGroups);
        }

      } catch (e) {
        console.warn("Group fetch failover triggered", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllGroups();
  }, []);

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
