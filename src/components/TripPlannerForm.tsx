import { useState } from "react";
import { CalendarDays, DollarSign, Users, Sparkles, Loader2, MapPin, User, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TripPlannerFormProps {
  onRecommendations: (data: any) => void;
}

const interestOptions = [
  { id: 'culture', label: '🏛️ Culture & History' },
  { id: 'food', label: '🍜 Food & Cuisine' },
  { id: 'adventure', label: '🏔️ Adventure' },
  { id: 'nature', label: '🌿 Nature' },
  { id: 'nightlife', label: '🌙 Nightlife' },
  { id: 'shopping', label: '🛍️ Shopping' },
  { id: 'relaxation', label: '🧘 Relaxation' },
  { id: 'photography', label: '📸 Photography' },
  { id: 'art', label: '🎨 Art & Museums' },
  { id: 'local', label: '🏘️ Local Experience' },
];

export function TripPlannerForm({ onRecommendations }: TripPlannerFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showFounderPopup, setShowFounderPopup] = useState(false);
  const [formData, setFormData] = useState({
    travelerName: '',
    fromLocation: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'USD',
    travelers: '1',
    interests: [] as string[],
  });

  const toggleInterest = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId],
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.interests.length === 0) {
      toast({
        title: "Select Interests",
        description: "Please select at least one interest",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('travel-recommendations', {
        body: {
          travelerName: formData.travelerName,
          fromLocation: formData.fromLocation,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: parseFloat(formData.budget),
          currency: formData.currency,
          travelers: parseInt(formData.travelers),
          interests: formData.interests,
        },
      });

      if (error) throw error;

      if (data.success) {
        onRecommendations(data);
        
        // Show founder popup if destination is Cuddalore (after recommendations generated)
        if (formData.destination.toLowerCase().includes('cuddalore')) {
          setShowFounderPopup(true);
        }
        
        toast({
          title: "Trip Planned! ✨",
          description: "Your personalized recommendations are ready",
        });
      } else {
        throw new Error(data.error || 'Failed to generate recommendations');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Founder Easter Egg Dialog */}
      <Dialog open={showFounderPopup} onOpenChange={setShowFounderPopup}>
        <DialogContent className="sm:max-w-md border-primary/30 bg-gradient-to-br from-card via-card to-primary/5">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-bounce-soft">
                  <Heart className="w-10 h-10 text-primary-foreground fill-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-sakura-accent rounded-full flex items-center justify-center">
                  <span className="text-xs">🌸</span>
                </div>
              </div>
            </div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to Cuddalore! 🎉
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed mt-4 space-y-3">
              <p className="text-foreground font-medium">
                This is the hometown of our founder, <span className="text-primary font-bold">A. Hari Raj</span>!
              </p>
              <p className="text-muted-foreground">
                If you happen to visit this beautiful district, feel free to reach out and meet him. He'd love to welcome you personally! 🤝
              </p>
              <div className="pt-2 flex items-center justify-center gap-2 text-sm text-primary/80">
                <Sparkles className="w-4 h-4" />
                <span>Enjoy your trip to Cuddalore!</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card variant="sakura" className="w-full max-w-2xl mx-auto animate-fade-in">
        <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary animate-bounce-soft" />
          Plan Your Adventure
        </CardTitle>
        <CardDescription>
          Let AI craft your perfect itinerary
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Traveler Name */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" /> Your Name
            </label>
            <Input
              variant="sakura"
              placeholder="Enter your name"
              value={formData.travelerName}
              onChange={(e) => setFormData(prev => ({ ...prev, travelerName: e.target.value }))}
            />
          </div>

          {/* From and To locations */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> From
              </label>
              <Input
                variant="sakura"
                placeholder="New York, London..."
                value={formData.fromLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, fromLocation: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> To
              </label>
              <Input
                variant="sakura"
                placeholder="Tokyo, Paris, Bali..."
                value={formData.destination}
                onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> Start Date
              </label>
              <Input
                variant="sakura"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> End Date
              </label>
              <Input
                variant="sakura"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Budget
              </label>
              <div className="flex gap-2">
                <Input
                  variant="sakura"
                  type="number"
                  placeholder="1500"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  className="flex-1"
                />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="px-2 rounded-md border border-primary/30 bg-card text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" /> Travelers
              </label>
              <Input
                variant="sakura"
                type="number"
                min="1"
                max="20"
                value={formData.travelers}
                onChange={(e) => setFormData(prev => ({ ...prev, travelers: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Your Interests</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <Badge
                  key={interest.id}
                  variant={formData.interests.includes(interest.id) ? "default" : "outline"}
                  className={`cursor-pointer transition-all text-[10px] ${
                    formData.interests.includes(interest.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-primary/10'
                  }`}
                  onClick={() => toggleInterest(interest.id)}
                >
                  {interest.label}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="sakura"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Crafting your trip...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Recommendations
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
    </>
  );
}
