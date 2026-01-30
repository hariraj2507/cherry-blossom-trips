import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { TripPlannerForm } from "@/components/TripPlannerForm";
import { BudgetAnalysisCard } from "@/components/BudgetAnalysisCard";
import { BudgetTracker } from "@/components/BudgetTracker";
import { RecommendationsDisplay } from "@/components/RecommendationsDisplay";
import { WorkspaceDirectory } from "@/components/WorkspaceDirectory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'planner' | 'workspaces'>('planner');
  const [tripData, setTripData] = useState<any>(null);
  const plannerRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    plannerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRecommendations = (data: any) => {
    setTripData(data);
  };

  const handleNewTrip = () => {
    setTripData(null);
  };

  return (
    <div className="min-h-screen bg-petal-gradient relative overflow-hidden">
      {/* Cherry Blossom Tree - Left Side */}
      <div className="fixed left-0 bottom-0 pointer-events-none z-0 opacity-40">
        <svg width="300" height="500" viewBox="0 0 300 500" className="w-48 md:w-72">
          {/* Tree trunk */}
          <path 
            d="M150 500 Q140 400 130 350 Q120 300 140 250 Q130 200 150 150" 
            stroke="hsl(var(--foreground))" 
            strokeWidth="12" 
            fill="none"
            opacity="0.6"
          />
          {/* Main branches */}
          <path d="M150 250 Q200 220 250 200" stroke="hsl(var(--foreground))" strokeWidth="6" fill="none" opacity="0.5"/>
          <path d="M140 300 Q80 270 30 250" stroke="hsl(var(--foreground))" strokeWidth="5" fill="none" opacity="0.5"/>
          <path d="M145 200 Q180 170 220 150" stroke="hsl(var(--foreground))" strokeWidth="4" fill="none" opacity="0.5"/>
          <path d="M150 180 Q110 140 70 120" stroke="hsl(var(--foreground))" strokeWidth="4" fill="none" opacity="0.5"/>
          <path d="M150 150 Q170 100 200 80" stroke="hsl(var(--foreground))" strokeWidth="3" fill="none" opacity="0.5"/>
          
          {/* Blossom clusters */}
          {/* Right branch blossoms */}
          <circle cx="250" cy="200" r="15" fill="hsl(var(--primary))" opacity="0.7"/>
          <circle cx="240" cy="185" r="12" fill="hsl(350, 80%, 80%)" opacity="0.8"/>
          <circle cx="260" cy="190" r="10" fill="hsl(350, 70%, 85%)" opacity="0.6"/>
          <circle cx="235" cy="210" r="8" fill="hsl(var(--primary))" opacity="0.5"/>
          
          {/* Left branch blossoms */}
          <circle cx="30" cy="250" r="14" fill="hsl(var(--primary))" opacity="0.7"/>
          <circle cx="50" cy="240" r="11" fill="hsl(350, 80%, 80%)" opacity="0.8"/>
          <circle cx="40" cy="265" r="9" fill="hsl(350, 70%, 85%)" opacity="0.6"/>
          <circle cx="20" cy="235" r="7" fill="hsl(var(--primary))" opacity="0.5"/>
          
          {/* Upper right blossoms */}
          <circle cx="220" cy="150" r="13" fill="hsl(var(--primary))" opacity="0.7"/>
          <circle cx="205" cy="140" r="10" fill="hsl(350, 80%, 80%)" opacity="0.8"/>
          <circle cx="230" cy="140" r="8" fill="hsl(350, 70%, 85%)" opacity="0.6"/>
          
          {/* Upper left blossoms */}
          <circle cx="70" cy="120" r="12" fill="hsl(var(--primary))" opacity="0.7"/>
          <circle cx="85" cy="110" r="9" fill="hsl(350, 80%, 80%)" opacity="0.8"/>
          <circle cx="55" cy="130" r="7" fill="hsl(350, 70%, 85%)" opacity="0.6"/>
          
          {/* Top blossoms */}
          <circle cx="200" cy="80" r="11" fill="hsl(var(--primary))" opacity="0.7"/>
          <circle cx="190" cy="70" r="8" fill="hsl(350, 80%, 80%)" opacity="0.8"/>
          <circle cx="210" cy="90" r="6" fill="hsl(350, 70%, 85%)" opacity="0.6"/>
          
          {/* Scattered petals */}
          <circle cx="180" cy="180" r="5" fill="hsl(var(--primary))" opacity="0.4"/>
          <circle cx="100" cy="200" r="4" fill="hsl(350, 80%, 80%)" opacity="0.5"/>
          <circle cx="160" cy="220" r="6" fill="hsl(350, 70%, 85%)" opacity="0.4"/>
          <circle cx="120" cy="280" r="5" fill="hsl(var(--primary))" opacity="0.3"/>
        </svg>
      </div>
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 pb-12">
        {activeTab === 'planner' ? (
          <>
            {!tripData && <HeroSection onGetStarted={handleGetStarted} />}
            
            <div ref={plannerRef} className="py-8">
              {!tripData ? (
                <TripPlannerForm onRecommendations={handleRecommendations} />
              ) : (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <Button 
                    variant="ghost" 
                    onClick={handleNewTrip}
                    className="text-xs"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    Plan New Trip
                  </Button>
                  
                  <div className="text-center space-y-2">
                    <h2 className="text-gradient-sakura">
                      {tripData.tripDetails.destination}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {tripData.tripDetails.tripDays} days • {tripData.tripDetails.travelers} traveler(s) • {tripData.tripDetails.budget} {tripData.tripDetails.currency}
                    </p>
                  </div>

                  {/* Budget Analysis */}
                  <BudgetAnalysisCard
                    analysis={tripData.data.budgetAnalysis}
                    currency={tripData.tripDetails.currency}
                    totalBudget={tripData.tripDetails.budget}
                  />

                  {/* Budget Tracker - only show if feasible */}
                  {tripData.data.budgetAnalysis.feasibility === 'feasible' && (
                    <div className="space-y-3">
                      <h3 className="text-sm text-center">Track Your Expenses</h3>
                      <BudgetTracker
                        totalBudget={tripData.tripDetails.budget}
                        currency={tripData.tripDetails.currency}
                        suggestedBreakdown={tripData.data.suggestedBudgetBreakdown}
                      />
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h3 className="text-sm text-center">Your Recommendations</h3>
                    <RecommendationsDisplay
                      recommendations={tripData.data.recommendations}
                      travelTips={tripData.data.travelTips}
                      currency={tripData.tripDetails.currency}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-8">
            <WorkspaceDirectory />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-[10px] text-muted-foreground">
            🌸 SakuraTrip • AI-Powered Travel Planning
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
