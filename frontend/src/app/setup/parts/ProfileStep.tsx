"use client";

interface ProfileStepProps {
  formData: any;
  updateForm: (key: string, value: any) => void;
  nextStep: () => void;
}

export default function ProfileStep({ formData, updateForm, nextStep }: ProfileStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Who Are You?</h2>
        <p className="text-sm text-gray-500 mt-2">Help us tailor the experience to your needs.</p>
      </div>
      
      <div className="space-y-3 mb-8">
        <p className="text-xs font-medium text-gray-700 mb-2">What best describes you?</p>
        {["Trader / Market Seller", "Artisan / Craftsperson", "Service Provider", "Job Seeker", "Farmer", "Other"].map((option) => (
          <button
            key={option}
            onClick={() => updateForm("profileType", option)}
            className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all ${
              formData.profileType === option 
                ? 'border-ajobi-green bg-[#EEF8F3] text-ajobi-green' 
                : 'border-gray-200 hover:border-ajobi-green/50 text-gray-700 bg-white'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={nextStep}
          disabled={!formData.profileType}
          className="w-full sm:w-[60%] bg-ajobi-green hover:bg-ajobi-green-dark text-white px-12 py-3.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
