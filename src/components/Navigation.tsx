import { Plane, MapPin, Briefcase, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavigationProps {
  activeTab: 'planner' | 'workspaces' | 'tools';
  onTabChange: (tab: 'planner' | 'workspaces' | 'tools') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { t } = useLanguage();
  
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
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1 sm:gap-2">
              <Button
                variant={activeTab === 'planner' ? 'sakura' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('planner')}
                className="text-[10px]"
              >
                <MapPin className="w-3 h-3" />
                <span className="hidden sm:inline">{t('nav.tripPlanner')}</span>
              </Button>
              <Button
                variant={activeTab === 'workspaces' ? 'sakura' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('workspaces')}
                className="text-[10px]"
              >
                <Briefcase className="w-3 h-3" />
                <span className="hidden sm:inline">{t('nav.workspaces')}</span>
              </Button>
              <Button
                variant={activeTab === 'tools' ? 'sakura' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('tools')}
                className="text-[10px]"
              >
                <Compass className="w-3 h-3" />
                <span className="hidden sm:inline">{t('nav.tools')}</span>
              </Button>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
