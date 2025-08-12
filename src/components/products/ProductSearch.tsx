'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS } from '@/lib/constants';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  organic?: boolean;
  location?: string;
}

export function ProductSearch({ onSearch, onFilter, onClearFilters }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (key: keyof ProductFilters, value: string | number | boolean | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilter = (key: keyof ProductFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    onClearFilters();
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products, categories, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </form>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {PRODUCT_CATEGORY_LABELS[filters.category as keyof typeof PRODUCT_CATEGORY_LABELS]}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('category')}
              />
            </Badge>
          )}
          {filters.organic !== undefined && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.organic ? 'Organic' : 'Non-organic'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('organic')}
              />
            </Badge>
          )}
          {filters.minPrice && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Min: ฿{filters.minPrice}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('minPrice')}
              />
            </Badge>
          )}
          {filters.maxPrice && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Max: ฿{filters.maxPrice}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('maxPrice')}
              />
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {filters.location}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('location')}
              />
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-700"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select 
                value={filters.category || ''} 
                onValueChange={(value) => handleFilterChange('category', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {Object.entries(PRODUCT_CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Min Price (฿)</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Price (฿)</label>
              <Input
                type="number"
                placeholder="1000"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                type="text"
                placeholder="Enter location"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
              />
            </div>
          </div>

          {/* Organic Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Organic</label>
            <div className="flex gap-2">
              <Button
                variant={filters.organic === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('organic', filters.organic === true ? undefined : true)}
              >
                Organic Only
              </Button>
              <Button
                variant={filters.organic === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('organic', filters.organic === false ? undefined : false)}
              >
                Non-organic Only
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}