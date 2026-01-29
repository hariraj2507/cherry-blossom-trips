import { useState } from "react";
import { CalendarDays, DollarSign, Users, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [formData, setFormData] = useState({
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
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Where to?</label>
            <Input
              variant="sakura"
              placeholder="Tokyo, Paris, Bali..."
              value={formData.destination}
              onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
            />
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
  );
}
