import { useState, useMemo } from "react";

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
  rawAmount: number; // added for computational parsing
  frequency: "Monthly" | "Weekly" | "Bi-Weekly"; // added for computational filtering
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
  
  // Advanced Search & Filter states for Public Groups
  const [searchFilter, setSearchFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("Any");
  const [frequencyFilter, setFrequencyFilter] = useState("Any");

  // Search and Matching states for AI Matching
  const [searchQuery, setSearchQuery] = useState("");
  const [matchAmount, setMatchAmount] = useState("50,000");
  const [matchFrequency, setMatchFrequency] = useState<'Monthly' | 'Weekly'>('Monthly');
  const [isMatching, setIsMatching] = useState(false);
  const [showMatches, setShowMatches] = useState(false);

  const myGroups: GroupItem[] = [
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

  const publicGroups: PublicGroup[] = [
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

  // Computed search and filtering logic
  const filteredPublicGroups = useMemo(() => {
    return publicGroups.filter(group => {
      // 1. Match string query
      if (searchFilter) {
        const lower = searchFilter.toLowerCase();
        const matchesName = group.name.toLowerCase().includes(lower);
        const matchesAdmin = group.admin.toLowerCase().includes(lower);
        if (!matchesName && !matchesAdmin) return false;
      }

      // 2. Match frequency constraint
      if (frequencyFilter !== "Any") {
        if (group.frequency !== frequencyFilter) return false;
      }

      // 3. Match numeric ranges
      if (amountFilter !== "Any") {
        if (amountFilter === "Under ₦50k" && group.rawAmount >= 50000) return false;
        if (amountFilter === "₦50k - ₦200k" && (group.rawAmount < 50000 || group.rawAmount > 200000)) return false;
        if (amountFilter === "Above ₦200k" && group.rawAmount <= 200000) return false;
      }

      return true;
    });
  }, [searchFilter, amountFilter, frequencyFilter]);

  const matchedGroups: MatchedGroup[] = [
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

  const handleFindMatch = async () => {
    setIsMatching(true);
    setShowMatches(false);
    await new Promise(r => setTimeout(r, 1200));
    setIsMatching(false);
    setShowMatches(true);
  };

  return {
    activeTab,
    setActiveTab,
    myGroups,
    publicGroups: filteredPublicGroups, // replace plain list with reactive computational results
    matchedGroups,
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
