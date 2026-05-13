import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

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

  // Derived dynamic variables for the sticky summary preview
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
      // Latency simulation for group deployment to blockchain smart contract escrow
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/dashboard/groups");
    } catch (error) {
      console.error(error);
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
