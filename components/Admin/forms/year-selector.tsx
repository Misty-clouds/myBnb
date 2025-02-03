import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { create } from 'zustand';

// Define the store type
interface YearStore {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

// Create the store
export const useYearStore = create<YearStore>((set) => ({
  selectedYear: new Date().getFullYear(),
  setSelectedYear: (year) => set({ selectedYear: year }),
}));

export function YearSelector() {
  const { selectedYear, setSelectedYear } = useYearStore();
  const currentYear = new Date().getFullYear();
  
  // Generate array of years from current to current + 3
  const years = Array.from({ length: 4 }, (_, i) => currentYear + i);

  return (
    <div className="w-full max-w-xs">
      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => setSelectedYear(parseInt(value))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem
              key={year}
              value={year.toString()}
              className="cursor-pointer"
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
