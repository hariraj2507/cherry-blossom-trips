import { Plane, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeTab: 'planner' | 'workspaces';
  onTabChange: (tab: 'planner' | 'workspaces') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sakura-300 to-sakura-500 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-gradient-sakura hidden sm:block">
              SakuraTrip
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'planner' ? 'sakura' : 'ghost'}
              size="sm"
              onClick={() => onTabChange('planner')}
              className="text-[10px]"
            >
              <MapPin className="w-3 h-3" />
              <span className="hidden sm:inline">Trip Planner</span>
            </Button>
            <Button
              variant={activeTab === 'workspaces' ? 'sakura' : 'ghost'}
              size="sm"
              onClick={() => onTabChange('workspaces')}
              className="text-[10px]"
            >
              <Briefcase className="w-3 h-3" />
              <span className="hidden sm:inline">Workspaces</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
