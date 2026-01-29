import { Sparkles, MapPin, Wallet, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* Floating sakura petals decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-petal opacity-60"
            style={{
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${8 + i * 2}s`,
            }}
          >
            🌸
          </div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px]">
            <Sparkles className="w-3 h-3" />
            AI-Powered Travel Planning
          </div>
          
          <h1 className="text-gradient-sakura">
            Plan Your Dream Adventure
          </h1>
          
          <p className="text-muted-foreground max-w-xl mx-auto">
            Let AI craft your perfect itinerary with personalized recommendations, 
            smart budget analysis, and a directory of nomad-friendly workspaces worldwide.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button variant="sakura" size="lg" onClick={onGetStarted}>
              <MapPin className="w-4 h-4" />
              Start Planning
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-4 pt-8 max-w-lg mx-auto">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <p className="text-[10px] text-muted-foreground">AI Recommendations</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-10 h-10 mx-auto rounded-lg bg-success/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-success" />
              </div>
              <p className="text-[10px] text-muted-foreground">Budget Tracking</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-10 h-10 mx-auto rounded-lg bg-info/10 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-info" />
              </div>
              <p className="text-[10px] text-muted-foreground">Workspace Directory</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
