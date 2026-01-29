import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceCard } from "@/components/WorkspaceCard";
import { WorkspaceFilters, type WorkspaceFilters as Filters } from "@/components/WorkspaceFilters";
import { Loader2, MapPin } from "lucide-react";

export function WorkspaceDirectory() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    wifiQuality: null,
    noiseLevel: null,
    hasPowerOutlets: null,
    hasQuietZones: null,
    country: null,
  });

  const { data: workspaces, isLoading, error } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('average_rating', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredWorkspaces = useMemo(() => {
    if (!workspaces) return [];
    
    return workspaces.filter(workspace => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matches = 
          workspace.name.toLowerCase().includes(searchLower) ||
          workspace.city.toLowerCase().includes(searchLower) ||
          workspace.country.toLowerCase().includes(searchLower) ||
          (workspace.region && workspace.region.toLowerCase().includes(searchLower));
        if (!matches) return false;
      }
      
      // WiFi quality filter
      if (filters.wifiQuality) {
        if (filters.wifiQuality === 'excellent' && workspace.wifi_quality !== 'excellent') return false;
        if (filters.wifiQuality === 'good' && !['excellent', 'good'].includes(workspace.wifi_quality || '')) return false;
        if (filters.wifiQuality === 'moderate' && !['excellent', 'good', 'moderate'].includes(workspace.wifi_quality || '')) return false;
      }
      
      // Noise level filter
      if (filters.noiseLevel && workspace.noise_level !== filters.noiseLevel) return false;
      
      // Power outlets filter
      if (filters.hasPowerOutlets && !workspace.has_power_outlets) return false;
      
      // Quiet zones filter
      if (filters.hasQuietZones && !workspace.has_quiet_zones) return false;
      
      return true;
    });
  }, [workspaces, filters]);

  // Group workspaces by country
  const groupedWorkspaces = useMemo(() => {
    const grouped: Record<string, typeof filteredWorkspaces> = {};
    filteredWorkspaces.forEach(workspace => {
      if (!grouped[workspace.country]) {
        grouped[workspace.country] = [];
      }
      grouped[workspace.country].push(workspace);
    });
    return grouped;
  }, [filteredWorkspaces]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-xs">Failed to load workspaces</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-gradient-sakura">Nomad Workspace Directory</h2>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Find the perfect workspace with verified WiFi speeds, power outlets, and quiet zones
        </p>
      </div>
      
      <WorkspaceFilters filters={filters} onFilterChange={setFilters} />
      
      <div className="text-xs text-muted-foreground">
        Found {filteredWorkspaces.length} workspaces
      </div>

      {Object.keys(groupedWorkspaces).length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground mt-4">
            No workspaces match your filters
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedWorkspaces).map(([country, spaces]) => (
            <div key={country} className="space-y-4">
              <h3 className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {country}
                <span className="text-[10px] text-muted-foreground">
                  ({spaces.length} {spaces.length === 1 ? 'space' : 'spaces'})
                </span>
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {spaces.map((workspace) => (
                  <WorkspaceCard 
                    key={workspace.id} 
                    workspace={workspace}
                    onSelect={(w) => console.log('Selected workspace:', w)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
