import { useState, useEffect } from "react";
import { groupsService } from "@/services/groupsService";

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
  const [isLoading, setIsLoading] = useState(true);

  // Main layout states
  const [groupInfo, setGroupInfo] = useState({
    name: "Lagos Techies Savings",
    status: "Active",
    contribution: "₦50,000 Contribution",
    rotation: "Monthly Rotation",
    currentCycle: 3,
    totalCycles: 8,
    nextDisbursement: "₦400,000 in 12 days (Oct 24)",
    onTimeRate: "98%"
  });

  const [rotationTimeline, setRotationTimeline] = useState([
    { id: "1", name: "Tunde A.", pos: "Pos 1", completed: true, isNext: false, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" },
    { id: "2", name: "Sarah W.", pos: "Pos 2", completed: true, isNext: false, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" },
    { id: "3", name: "Adeola B.", pos: "Pos 3", completed: false, isNext: true, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" },
    { id: "4", name: "Obinna K.", pos: "Pos 4", completed: false, isNext: false, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" },
    { id: "5", name: "Blessing O.", pos: "Pos 5", completed: false, isNext: false, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" },
  ]);

  const [members, setMembers] = useState<MemberData[]>([
    { id: "1", name: "Tunde Bakare", initials: "TB", score: 780, scoreTag: "Excellent", position: 1, status: "Paid", statusDetail: "Paid 2 days ago" },
    { id: "2", name: "Sarah Williams", initials: "SW", score: 640, scoreTag: "Good", position: 2, status: "Pending", statusDetail: "Pending automatic debit" },
    { id: "3", name: "Adeola Bakare", initials: "AB", score: 730, scoreTag: "Excellent", position: 3, status: "Paid", statusDetail: "Paid 5 days ago" },
    { id: "4", name: "Obinna Kalu", initials: "OK", score: 420, scoreTag: "Fair", position: 4, status: "Missed", statusDetail: "24h Past Due" }
  ]);

  const [history, setHistory] = useState<HistoryItem[]>([
    { cycle: "#2", date: "Sep 24, 2024", collected: "100%", disbursedTo: "Sarah Williams", amount: "₦400,000" },
    { cycle: "#1", date: "Aug 24, 2024", collected: "100%", disbursedTo: "Tunde Bakare", amount: "₦400,000" }
  ]);

  const [userStatus, setUserStatus] = useState({
    paymentStatus: "Paid",
    paymentMethod: "Squad Direct Debit",
    methodActive: true,
    methodDetails: "Your next contribution of ₦50,000 will be automatically deducted on Oct 24th from Zenith Bank (***4521)."
  });

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Core Detailed Payload
        const detResp = await groupsService.getGroupDetail(groupId);
        if (detResp.success && detResp.data) {
          const data = detResp.data;
          setGroupInfo({
            name: data.name,
            status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
            contribution: `₦${data.contribution_amount.toLocaleString()} Contribution`,
            rotation: `${data.frequency.charAt(0).toUpperCase() + data.frequency.slice(1)} Rotation`,
            currentCycle: data.current_cycle,
            totalCycles: data.total_cycles,
            nextDisbursement: `₦${data.next_disbursement_amount?.toLocaleString() || (data.contribution_amount * data.rotation?.length)} on ${new Date(data.next_disbursement_date).toLocaleDateString()}`,
            onTimeRate: "100%"
          });

          // Map the rotation timeline avatars
          if (data.rotation) {
            const fallbackPics = [
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
            ];
            const mappedTimeline = data.rotation.map((r: any, idx: number) => ({
              id: r.user_id,
              name: r.name.split(' ')[0] + (r.name.split(' ')[1] ? ' ' + r.name.split(' ')[1][0] + '.' : ''),
              pos: `Pos ${r.position}`,
              completed: r.has_received,
              isNext: r.is_next,
              avatar: fallbackPics[idx % fallbackPics.length]
            }));
            setRotationTimeline(mappedTimeline);
          }

          // Map Members Table
          if (data.this_cycle_contributions) {
            const mappedMembers = data.this_cycle_contributions.map((c: any, idx: number) => {
              const rotData = data.rotation?.find((r: any) => r.user_id === c.user_id) || {};
              // Scale 10-100 score standard from backend back up to visual frontend 100-1000
              const scaleScore = rotData.ajo_score ? rotData.ajo_score * 10 : 650; 
              return {
                id: c.user_id,
                name: c.name,
                initials: c.name.split(' ').map((n: any) => n[0]).join('').substring(0, 2),
                score: scaleScore,
                scoreTag: scaleScore >= 750 ? 'Excellent' : scaleScore >= 600 ? 'Good' : 'Fair',
                position: rotData.position || (idx + 1),
                status: c.status === 'paid' ? 'Paid' : c.status === 'missed' ? 'Missed' : 'Pending',
                statusDetail: c.paid_at ? `Paid ${new Date(c.paid_at).toLocaleDateString()}` : c.grace_period_ends ? `Grace ends ${new Date(c.grace_period_ends).toLocaleDateString()}` : "Awaiting status"
              };
            });
            setMembers(mappedMembers);
          }
        }

        // 2. Fetch Table Audits
        try {
          const histResp = await groupsService.getGroupContributionHistory(groupId);
          if (histResp.success && histResp.data?.contributions) {
            const mappedHist = histResp.data.contributions.map((h: any) => ({
              cycle: `#${h.cycle}`,
              date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              collected: h.all_paid ? "100%" : "Partial",
              disbursedTo: h.disbursed_to || "N/A",
              amount: `₦${h.disbursement_amount.toLocaleString()}`
            }));
            setHistory(mappedHist);
          }
        } catch {
          // history fallback maintained implicitly
        }

      } catch (e) {
        console.warn("Group details API failover to simulation", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [groupId]);

  return {
    isLoading,
    groupInfo,
    rotationTimeline,
    members,
    history,
    userStatus
  };
};
