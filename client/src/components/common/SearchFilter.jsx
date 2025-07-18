import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const SearchFilter = ({ 
  searchValue, 
  onSearchChange, 
  placeholder = "Search...", 
  filters = [],
  onFilterChange,
  actions 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      {filters.map((filter, index) => (
        <select
          key={index}
          value={filter.value}
          onChange={(e) => onFilterChange(filter.key, e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{filter.placeholder}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}

      {/* Actions */}
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
};

export default SearchFilter;