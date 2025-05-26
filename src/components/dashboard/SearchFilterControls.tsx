
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { departments, type Department } from "@/types";
import { useApp } from "@/contexts/AppContext";
import { SlidersHorizontal, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SearchFilterControls() {
  const {
    searchTerm, setSearchTerm,
    departmentFilter, setDepartmentFilter,
    ratingFilter, setRatingFilter
  } = useApp();

  const handleDepartmentChange = (dept: Department) => {
    setDepartmentFilter(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const handleRatingChange = (rating: number) => {
    setRatingFilter(prev =>
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const ratingOptions = [1, 2, 3, 4, 5];

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter([]);
    setRatingFilter([]);
  };

  const activeFilterCount = departmentFilter.length + ratingFilter.length + (searchTerm ? 1 : 0);


  return (
    <div className="mb-6 p-4 bg-card rounded-lg shadow  z-10 backdrop-blur-sm bg-opacity-90">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          type="search"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow text-base"
          aria-label="Search users"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <ScrollArea className="max-h-[calc(100vh-200px)]">
              <div className="p-4">
                <h4 className="mb-2 text-sm font-medium leading-none">Filter by Department</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {departments.map(dept => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dept-${dept}`}
                        checked={departmentFilter.includes(dept)}
                        onCheckedChange={() => handleDepartmentChange(dept)}
                      />
                      <Label htmlFor={`dept-${dept}`} className="text-sm font-normal cursor-pointer">{dept}</Label>
                    </div>
                  ))}
                </div>

                <h4 className="mb-2 text-sm font-medium leading-none">Filter by Rating</h4>
                <div className="grid grid-cols-2 gap-2">
                  {ratingOptions.map(rating => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={ratingFilter.includes(rating)}
                        onCheckedChange={() => handleRatingChange(rating)}
                      />
                      <Label htmlFor={`rating-${rating}`} className="text-sm font-normal cursor-pointer">{rating} Star{rating > 1 ? 's' : ''}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        {activeFilterCount > 0 && (
           <Button variant="ghost" onClick={clearFilters} className="w-full md:w-auto text-destructive hover:text-destructive-foreground hover:bg-destructive/90">
             <XCircle className="mr-2 h-4 w-4" /> Clear All
           </Button>
         )}
      </div>
    </div>
  );
}
