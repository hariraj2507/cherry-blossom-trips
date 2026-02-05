import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { TripPlannerForm } from "@/components/TripPlannerForm";
import { BudgetAnalysisCard } from "@/components/BudgetAnalysisCard";
import { BudgetTracker } from "@/components/BudgetTracker";
import { RecommendationsDisplay } from "@/components/RecommendationsDisplay";
import { WorkspaceDirectory } from "@/components/WorkspaceDirectory";
import { ToolsDirectory } from "@/components/tools/ToolsDirectory";
import { CherryBlossomTree } from "@/components/CherryBlossomTree";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'planner' | 'workspaces' | 'tools'>('planner');
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
      {/* Cherry Blossom Trees */}
      <CherryBlossomTree side="left" />
      <CherryBlossomTree side="right" />
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 pb-12 relative z-10">
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
                    {tripData.tripDetails.travelerName && (
                      <p className="text-xs text-primary">
                        🌸 {tripData.tripDetails.travelerName}'s Adventure
                      </p>
                    )}
                    <h2 className="text-gradient-sakura">
                      {tripData.tripDetails.fromLocation && `${tripData.tripDetails.fromLocation} → `}{tripData.tripDetails.destination}
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
                      flightDetails={tripData.data.flightDetails}
                      fromLocation={tripData.tripDetails.fromLocation}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
        activeTab === 'workspaces' ? (
          <div className="py-8">
            <WorkspaceDirectory />
          </div>
        ) : (
          <div className="py-8">
            <ToolsDirectory />
          </div>
        )
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
