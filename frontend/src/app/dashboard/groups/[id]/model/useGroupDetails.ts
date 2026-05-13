import { useState } from "react";

export interface MemberData {
  id: string;
  name: string;
  initials: string;
  score: number;
  scoreTag: string;
  position: number;
  status: "Paid" | "Pending" | "Missed";
  statusDetail?: string;
  avatar?: string;
}

export interface HistoryItem {
  cycle: string;
  date: string;
  collected: string;
  disbursedTo: string;
  amount: string;
}

export const useGroupDetails = (groupId: string) => {
  const [isLoading, setIsLoading] = useState(false);

  // Group configuration data
  const groupInfo = {
    name: "Lagos Techies Savings",
    status: "Active",
    contribution: "₦50,000 Contribution",
    rotation: "Monthly Rotation",
    currentCycle: 3,
    totalCycles: 8,
    nextDisbursement: "₦400,000 in 12 days (Oct 24)",
    onTimeRate: "98%"
  };

  // Rotation sequence data
  const rotationTimeline = [
    { id: "1", name: "Tunde A.", pos: "Pos 1", completed: true, isNext: false, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" },
    { id: "2", name: "Sarah W.", pos: "Pos 2", completed: true, isNext: false, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" },
    { id: "3", name: "Adeola B.", pos: "Pos 3", completed: false, isNext: true, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" },
    { id: "4", name: "Obinna K.", pos: "Pos 4", completed: false, isNext: false, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" },
    { id: "5", name: "Blessing O.", pos: "Pos 5", completed: false, isNext: false, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" },
  ];

  // Detailed list data
  const members: MemberData[] = [
    { id: "1", name: "Tunde Bakare", initials: "TB", score: 780, scoreTag: "Excellent", position: 1, status: "Paid", statusDetail: "Paid 2 days ago" },
    { id: "2", name: "Sarah Williams", initials: "SW", score: 640, scoreTag: "Good", position: 2, status: "Pending", statusDetail: "Pending automatic debit" },
    { id: "3", name: "Adeola Bakare", initials: "AB", score: 730, scoreTag: "Excellent", position: 3, status: "Paid", statusDetail: "Paid 5 days ago" },
    { id: "4", name: "Obinna Kalu", initials: "OK", score: 420, scoreTag: "Fair", position: 4, status: "Missed", statusDetail: "24h Past Due" }
  ];

  // Table audits data
  const history: HistoryItem[] = [
    { cycle: "#2", date: "Sep 24, 2024", collected: "100%", disbursedTo: "Sarah Williams", amount: "₦400,000" },
    { cycle: "#1", date: "Aug 24, 2024", collected: "100%", disbursedTo: "Tunde Bakare", amount: "₦400,000" }
  ];

  // User-specific status data
  const userStatus = {
    paymentStatus: "Paid",
    paymentMethod: "Squad Direct Debit",
    methodActive: true,
    methodDetails: "Your next contribution of ₦50,000 will be automatically deducted on Oct 24th from Zenith Bank (***4521)."
  };

  return {
    isLoading,
    groupInfo,
    rotationTimeline,
    members,
    history,
    userStatus
  };
};
