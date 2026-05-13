"use client";

import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface GroupHeaderProps {
  name: string;
  status: string;
  contribution: string;
  rotation: string;
  currentCycle: number;
  totalCycles: number;
}

export default function GroupHeader({
  name,
  status,
  contribution,
  rotation,
  currentCycle,
  totalCycles
}: GroupHeaderProps) {
  const progress = (currentCycle / totalCycles) * 100;

  return (
    <div className="space-y-4">
      <Link href="/dashboard/groups" className="inline-flex items-center gap-2 text-[13px] font-extrabold text-gray-400 hover:text-[#066B44] transition-colors mb-2 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} /> Back to Groups
      </Link>

      <div className="bg-white rounded-[24px] border border-[#E8EFE8] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
          
          {/* Left side with logo and names */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-[20px] bg-[#F1F6F3] border border-[#DCE8E0] text-[#066B44] flex items-center justify-center shrink-0 shadow-inner">
              <Users className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h1 className="text-[22px] sm:text-[24px] font-black text-gray-900 tracking-tight leading-none">{name}</h1>
                <span className="px-3 py-0.5 bg-[#F1F6F3] border border-[#066B44]/10 text-[#066B44] text-[11px] font-extrabold uppercase tracking-widest rounded-full">
                  {status}
                </span>
              </div>
              <p className="text-[13px] font-bold text-gray-500 flex items-center gap-1.5">
                {contribution} <span className="text-gray-300">•</span> {rotation}
              </p>
            </div>
          </div>

          {/* Right side with actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button className="px-5 py-2.5 rounded-xl bg-white border border-[#E8EFE8] text-[13px] font-bold text-gray-700 hover:bg-[#F9FCF9] transition-colors">
              View Rules
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-[#066B44] hover:bg-[#055737] text-white text-[13px] font-extrabold shadow-md shadow-[#066B44]/10 transition-all">
              Make Payment
            </button>
          </div>
        </div>

        {/* Progress cycle slider */}
        <div className="mt-6 pt-6 border-t border-[#F1F6F3]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
            <div className="w-full h-3 bg-[#F1F6F3] rounded-full shadow-inner overflow-hidden relative flex-1">
              <div 
                className="absolute left-0 top-0 h-full bg-[#066B44] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[12px] font-extrabold text-gray-700 whitespace-nowrap tracking-wider uppercase opacity-80">
              Cycle {currentCycle} of {totalCycles}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
