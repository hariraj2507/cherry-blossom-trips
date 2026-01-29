import { useState } from "react";
import { Search, Filter, Wifi, Plug, Volume2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface WorkspaceFiltersProps {
  onFilterChange: (filters: WorkspaceFilters) => void;
  filters: WorkspaceFilters;
}

export interface WorkspaceFilters {
  search: string;
  wifiQuality: string | null;
  noiseLevel: string | null;
  hasPowerOutlets: boolean | null;
  hasQuietZones: boolean | null;
  country: string | null;
}

export function WorkspaceFilters({ onFilterChange, filters }: WorkspaceFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = [
    filters.wifiQuality,
    filters.noiseLevel,
    filters.hasPowerOutlets,
    filters.hasQuietZones,
    filters.country,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFilterChange({
      search: filters.search,
      wifiQuality: null,
      noiseLevel: null,
      hasPowerOutlets: null,
      hasQuietZones: null,
      country: null,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            variant="sakura"
            placeholder="Search workspaces, cities..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 bg-popover" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium">Filters</h4>
                {activeFilterCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[10px] h-6"
                    onClick={clearFilters}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> WiFi Quality
                </label>
                <Select
                  value={filters.wifiQuality || "all"}
                  onValueChange={(value) => 
                    onFilterChange({ ...filters, wifiQuality: value === "all" ? null : value })
                  }
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all" className="text-xs">Any</SelectItem>
                    <SelectItem value="excellent" className="text-xs">Excellent (100+ Mbps)</SelectItem>
                    <SelectItem value="good" className="text-xs">Good (50+ Mbps)</SelectItem>
                    <SelectItem value="moderate" className="text-xs">Moderate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Noise Level
                </label>
                <Select
                  value={filters.noiseLevel || "all"}
                  onValueChange={(value) => 
                    onFilterChange({ ...filters, noiseLevel: value === "all" ? null : value })
                  }
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all" className="text-xs">Any</SelectItem>
                    <SelectItem value="silent" className="text-xs">Silent</SelectItem>
                    <SelectItem value="quiet" className="text-xs">Quiet</SelectItem>
                    <SelectItem value="moderate" className="text-xs">Moderate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Plug className="w-3 h-3" /> Power Outlets
                </label>
                <Select
                  value={filters.hasPowerOutlets === null ? "all" : filters.hasPowerOutlets ? "yes" : "no"}
                  onValueChange={(value) => 
                    onFilterChange({ 
                      ...filters, 
                      hasPowerOutlets: value === "all" ? null : value === "yes" 
                    })
                  }
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all" className="text-xs">Any</SelectItem>
                    <SelectItem value="yes" className="text-xs">Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground">Quiet Zones</label>
                <Select
                  value={filters.hasQuietZones === null ? "all" : filters.hasQuietZones ? "yes" : "no"}
                  onValueChange={(value) => 
                    onFilterChange({ 
                      ...filters, 
                      hasQuietZones: value === "all" ? null : value === "yes" 
                    })
                  }
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all" className="text-xs">Any</SelectItem>
                    <SelectItem value="yes" className="text-xs">Has Quiet Zones</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.wifiQuality && (
            <Badge variant="secondary" className="text-[10px]">
              WiFi: {filters.wifiQuality}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onFilterChange({ ...filters, wifiQuality: null })}
              />
            </Badge>
          )}
          {filters.noiseLevel && (
            <Badge variant="secondary" className="text-[10px]">
              Noise: {filters.noiseLevel}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onFilterChange({ ...filters, noiseLevel: null })}
              />
            </Badge>
          )}
          {filters.hasPowerOutlets && (
            <Badge variant="secondary" className="text-[10px]">
              Power outlets
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onFilterChange({ ...filters, hasPowerOutlets: null })}
              />
            </Badge>
          )}
          {filters.hasQuietZones && (
            <Badge variant="secondary" className="text-[10px]">
              Quiet zones
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onFilterChange({ ...filters, hasQuietZones: null })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
