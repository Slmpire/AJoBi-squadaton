import { useState } from "react";

export interface SetupFormData {
  profileType: string;
  workDuration: string;
  state: string;
  lga: string;
  incomeRange: string;
  inAjoGroup: string;
  saveMethods: string[];
  saveFrequency: string;
  borrowedMoney: string;
  paidBackFully: string;
  paidOnTime: string;
  language: string;
}

export const useSetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SetupFormData>({
    profileType: "",
    workDuration: "",
    state: "",
    lga: "",
    incomeRange: "",
    inAjoGroup: "",
    saveMethods: [],
    saveFrequency: "Daily",
    borrowedMoney: "",
    paidBackFully: "",
    paidOnTime: "",
    language: "",
  });

  const updateForm = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key as keyof SetupFormData]: value }));
  };

  const toggleArrayItem = (key: string, value: string) => {
    setFormData((prev) => {
      const arr = prev[key as keyof SetupFormData] as string[];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter((i) => i !== value) };
      } else {
        return { ...prev, [key]: [...arr, value] };
      }
    });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const submitStep = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // --- API INTEGRATION READY ---
      // const response = await setupService.saveStepProgress(currentStep, formData);
      // console.log(`Step ${currentStep} saved:`, response);
      
      // --- SIMULATION (Remove when backend is ready) ---
      console.log(`Saving Step ${currentStep} Payload:`, formData);
      await new Promise((resolve) => setTimeout(resolve, 800));
      // ----------------------------------------------
      
      nextStep();
    } catch (err: any) {
      console.error(`Failed to save step ${currentStep}:`, err);
      setError(err?.message || "An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    formData,
    isSubmitting,
    error,
    updateForm,
    toggleArrayItem,
    nextStep,
    prevStep,
    submitStep,
  };
};
