"use client";

import { Search } from 'lucide-react';

const SearchInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#1e1e1e] text-gray-100 border border-[#3a3a3a] rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] focus:ring-opacity-30 placeholder-gray-500"
      />
    </div>
  );
};

export default SearchInput;
