"use client";

import { Check, ChevronDown } from "lucide-react";

interface SavingsStepProps {
  formData: any;
  updateForm: (key: string, value: any) => void;
  toggleArrayItem: (key: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function SavingsStep({ formData, updateForm, toggleArrayItem, nextStep, prevStep }: SavingsStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Savings Habits</h2>
        <p className="text-sm text-gray-500 mt-2">Tell us how you manage your money daily.</p>
      </div>

      <div className="space-y-8 mb-8">
        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-700">Do you participate in a local Ajo or Esusu group?</label>
          <div className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((option) => (
              <button
                key={option}
                onClick={() => updateForm("inAjoGroup", option)}
                className={`text-center px-4 py-3.5 rounded-xl border text-sm font-bold transition-all ${
                  formData.inAjoGroup === option 
                    ? 'border-ajobi-green bg-[#EEF8F3] text-ajobi-green' 
                    : 'border-gray-200 hover:border-ajobi-green/50 text-gray-700 bg-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-700">How do you currently save? (Select all that apply)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Cash in a box at home", 
              "Traditional bank account", 
              "Community group (Ajo)", 
              "Mobile Money (Opay/PalmPay)"
            ].map((option) => (
              <div
                key={option}
                onClick={() => toggleArrayItem("saveMethods", option)}
                className={`flex items-center px-4 py-3.5 rounded-xl border text-[13px] font-medium transition-all cursor-pointer ${
                  formData.saveMethods.includes(option)
                    ? 'border-ajobi-green bg-[#EEF8F3] text-ajobi-green' 
                    : 'border-gray-200 hover:border-ajobi-green/50 text-gray-700 bg-[#F8FAFC]'
                }`}
              >
                <div className={`w-4 h-4 rounded border flex shrink-0 items-center justify-center mr-3 ${
                  formData.saveMethods.includes(option) ? 'bg-ajobi-green border-ajobi-green' : 'border-gray-300 bg-white'
                }`}>
                  {formData.saveMethods.includes(option) && <Check className="w-3 h-3 text-white" />}
                </div>
                {option}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">How often do you set money aside?</label>
          <div className="relative">
            <select 
              value={formData.saveFrequency}
              onChange={(e) => updateForm("saveFrequency", e.target.value)}
              className="w-full appearance-none px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-ajobi-green bg-[#F8FAFC]"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Rarely">Rarely</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button 
          onClick={prevStep}
          className="text-sm font-bold text-ajobi-green hover:underline px-4 py-2 transition-colors"
        >
          Back
        </button>
        <button 
          onClick={nextStep}
          disabled={!formData.inAjoGroup || formData.saveMethods.length === 0}
          className="w-[60%] sm:w-[50%] bg-ajobi-green hover:bg-ajobi-green-dark text-white py-3.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
