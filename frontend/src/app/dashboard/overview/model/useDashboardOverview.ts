import { useState, useEffect } from 'react';

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
}

export const useDashboardOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Simulation of API fetching
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Mock API latency
        await new Promise(resolve => setTimeout(resolve, 800));

        // Try to fetch user details from localStorage if available
        const localToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        setData({
          ajoScore: 680,
          scoreTier: "Silver",
          scoreDiff: 12,
          activeGroups: [
            {
              name: "Sunshine Group",
              nextDate: "Friday, Oct 25",
              status: "Paid",
              amount: "₦50,000/mo"
            }
          ],
          activeEscrows: [
            {
              title: "Emeka's Logo Design",
              status: "In Progress",
              amount: "₦25,000"
            }
          ],
          activeInstalments: [
            {
              item: "Deep Freezer",
              progress: 60,
              paid: "₦120k",
              total: "₦200k"
            }
          ],
          recentActivities: [
            {
              id: "1",
              type: 'payment',
              title: "Contribution collected ₦10,000",
              subtitle: "Sunshine Group • Monthly Cycle",
              timeAgo: "2h ago"
            },
            {
              id: "2",
              type: 'score',
              title: "AjoScore updated +2 points",
              subtitle: "on-time contribution reward",
              timeAgo: "2h ago"
            },
            {
              id: "3",
              type: 'view',
              title: "New listing viewed",
              subtitle: "Ankara fabric set • Marketplace",
              timeAgo: "yesterday"
            }
          ]
        });
      } catch (error) {
        console.error("Dashboard fetch failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    isLoading,
    data,
  };
};
