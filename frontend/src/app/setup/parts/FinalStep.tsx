"use client";

import { Upload } from "lucide-react";

interface FinalStepProps {
  formData: any;
  updateForm: (key: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function FinalStep({ formData, updateForm, nextStep, prevStep }: FinalStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Final Touches</h2>
        <p className="text-sm text-gray-500 mt-2">Personalize your experience to get started.</p>
      </div>

      <div className="space-y-8 mb-8">
        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-700">Preferred language</label>
          <div className="grid grid-cols-2 gap-3">
            {["English", "Pidgin", "Yoruba", "Hausa", "Igbo"].map((option) => (
              <button
                key={option}
                onClick={() => updateForm("language", option)}
                className={`text-center px-4 py-3.5 rounded-xl border text-[13px] font-medium transition-all ${
                  formData.language === option 
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
          <label className="text-xs font-medium text-gray-700">Profile photo upload (optional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-400 group-hover:text-ajobi-green" />
            </div>
            <p className="text-sm font-medium text-gray-700">Tap to upload your photo</p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">JPG, PNG UP TO 5MB</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <button 
          onClick={prevStep}
          className="text-sm font-bold text-ajobi-green hover:underline px-4 py-2"
        >
          Back
        </button>
        <button 
          onClick={nextStep}
          disabled={!formData.language}
          className="w-full sm:w-[60%] bg-ajobi-green hover:bg-ajobi-green-dark text-white px-4 py-3.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm and Generate My AjoScore
        </button>
      </div>
    </div>
  );
}
