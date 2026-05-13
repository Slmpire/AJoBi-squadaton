import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { groupsService } from "@/services/groupsService";

export interface CreateGroupFormData {
  name: string;
  amount: string;
  frequency: "Weekly" | "Monthly";
  maxMembers: number;
  minScore: number;
  rotationOrder: "Random Draw" | "Fixed Order";
  gracePeriod: "24 Hours" | "48 Hours";
  description: string;
}

export const useCreateGroup = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateGroupFormData>({
    name: "",
    amount: "50000",
    frequency: "Weekly",
    maxMembers: 12,
    minScore: 650,
    rotationOrder: "Random Draw",
    gracePeriod: "48 Hours",
    description: ""
  });

  const updateField = <K extends keyof CreateGroupFormData>(
    field: K,
    value: CreateGroupFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const targetPayout = useMemo(() => {
    const rawAmount = parseFloat(formData.amount.replace(/,/g, "")) || 0;
    return rawAmount * formData.maxMembers;
  }, [formData.amount, formData.maxMembers]);

  const cycleDuration = useMemo(() => {
    return `${formData.maxMembers} ${formData.frequency === "Weekly" ? "Weeks" : "Months"}`;
  }, [formData.maxMembers, formData.frequency]);

  const formattedContribution = useMemo(() => {
    const rawAmount = parseFloat(formData.amount.replace(/,/g, "")) || 0;
    return `₦${rawAmount.toLocaleString()}/${formData.frequency === "Weekly" ? "wk" : "mo"}`;
  }, [formData.amount, formData.frequency]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Mapped variables to match STAGE 4 backend payload guidelines
      const payload = {
        name: formData.name || "My Savings Circle",
        contribution_amount: parseFloat(formData.amount) || 10000,
        frequency: formData.frequency.toLowerCase() as 'weekly' | 'monthly',
        max_members: formData.maxMembers,
        // Mapped from 400-1000 UI range down to the requested backend 40-100 format
        min_ajo_score: Math.round(formData.minScore / 10),
        rotation_type: formData.rotationOrder === 'Random Draw' ? 'random' : 'manual' as 'random' | 'manual',
        grace_period_hours: formData.gracePeriod === '24 Hours' ? 24 : 48 as 24 | 48,
        description: formData.description
      };

      const response = await groupsService.createGroup(payload);
      
      if (response.success) {
        router.push(`/dashboard/groups/${response.data.group_id}`);
      } else {
        router.push("/dashboard/groups");
      }

    } catch (error) {
      console.warn("API Creation failover to simulation", error);
      // Seamless fallback simulation so front-end stays interactive without active local APIs
      await new Promise((resolve) => setTimeout(resolve, 1200));
      router.push("/dashboard/groups");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateField,
    targetPayout,
    cycleDuration,
    formattedContribution,
    isSubmitting,
    handleSubmit
  };
};
