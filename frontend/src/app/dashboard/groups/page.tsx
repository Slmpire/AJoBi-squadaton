"use client";

import { Plus, Search, Bell } from "lucide-react";
import Link from "next/link";
import { useGroups } from "./model/useGroups";
import MyGroups from "./parts/MyGroups";
import BrowseGroups from "./parts/BrowseGroups";
import AutoMatch from "./parts/AutoMatch";

export default function GroupsOverviewPage() {
  const {
    myGroups,
    publicGroups,
    matchedGroups,
    searchFilter,
    setSearchFilter,
    amountFilter,
    setAmountFilter,
    frequencyFilter,
    setFrequencyFilter,
    matchAmount,
    setMatchAmount,
    matchFrequency,
    setMatchFrequency,
    isMatching,
    showMatches,
    handleFindMatch
  } = useGroups();

  return (
    <div className="space-y-10 w-full mx-auto pb-12">
      
      {/* Sub Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EFE8]">
        <div className="flex items-center gap-8">
          {['My Groups', 'Browse Groups', 'Auto-Match'].map((tab, i) => (
            <button 
              key={tab}
              className={`text-[14px] font-bold pb-4 -mb-4.5 border-b-2 transition-all whitespace-nowrap ${
                i === 0 
                  ? 'text-[#066B44] border-[#066B44]' 
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <Link 
          href="/dashboard/groups/create"
          className="inline-flex items-center justify-center gap-2 bg-[#066B44] hover:bg-[#055737] text-white px-6 py-3 rounded-xl text-[13px] font-extrabold transition-all shadow-[0_4px_14px_rgba(6,107,68,0.25)] hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          Create Group
        </Link>
      </div>

      {/* Active My Groups Section */}
      <MyGroups groups={myGroups} />

      {/* Browse Public Groups Widget */}
      <BrowseGroups 
        groups={publicGroups} 
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        amountFilter={amountFilter}
        setAmountFilter={setAmountFilter}
        frequencyFilter={frequencyFilter}
        setFrequencyFilter={setFrequencyFilter}
      />

      {/* AI Auto Matching Module */}
      <AutoMatch 
        matchAmount={matchAmount}
        setMatchAmount={setMatchAmount}
        matchFrequency={matchFrequency}
        setMatchFrequency={setMatchFrequency}
        isMatching={isMatching}
        showMatches={showMatches}
        onFindMatch={handleFindMatch}
        matchedGroups={matchedGroups}
      />
    </div>
  );
}
