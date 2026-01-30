import { useState } from "react";
import { Plus, Loader2, Wifi, Volume2, Plug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function WorkspaceSuggestionForm() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    address: '',
    description: '',
    wifiSpeedEstimate: '',
    noiseLevelEstimate: '',
    hasPowerOutlets: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.city || !formData.country) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, city, and country",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('workspace_suggestions')
        .insert({
          name: formData.name,
          city: formData.city,
          country: formData.country,
          address: formData.address || null,
          description: formData.description || null,
          wifi_speed_estimate: formData.wifiSpeedEstimate || null,
          noise_level_estimate: formData.noiseLevelEstimate || null,
          has_power_outlets: formData.hasPowerOutlets,
        });

      if (error) throw error;

      toast({
        title: "Thank you! 🌸",
        description: "Your workspace suggestion has been submitted for review",
      });

      setFormData({
        name: '',
        city: '',
        country: '',
        address: '',
        description: '',
        wifiSpeedEstimate: '',
        noiseLevelEstimate: '',
        hasPowerOutlets: false,
      });
      setOpen(false);
    } catch (error) {
      console.error('Error submitting workspace:', error);
      toast({
        title: "Error",
        description: "Failed to submit workspace. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="sakura" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Suggest a Workspace
          </DialogTitle>
          <DialogDescription className="text-[10px]">
            Help fellow nomads by adding a workspace you know
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] text-muted-foreground">Workspace Name *</label>
            <Input
              variant="sakura"
              placeholder="Cozy Café & Co-work"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground">City *</label>
              <Input
                variant="sakura"
                placeholder="Tokyo"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground">Country *</label>
              <Input
                variant="sakura"
                placeholder="Japan"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-muted-foreground">Address (optional)</label>
            <Input
              variant="sakura"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-muted-foreground">Description (optional)</label>
            <Input
              variant="sakura"
              placeholder="Great coffee, friendly staff..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Wifi className="w-3 h-3" /> WiFi Speed
              </label>
              <select
                value={formData.wifiSpeedEstimate}
                onChange={(e) => setFormData(prev => ({ ...prev, wifiSpeedEstimate: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-primary/30 bg-card text-[10px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Unknown</option>
                <option value="excellent">Excellent (50+ Mbps)</option>
                <option value="good">Good (20-50 Mbps)</option>
                <option value="moderate">Moderate (10-20 Mbps)</option>
                <option value="slow">Slow (&lt;10 Mbps)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Volume2 className="w-3 h-3" /> Noise Level
              </label>
              <select
                value={formData.noiseLevelEstimate}
                onChange={(e) => setFormData(prev => ({ ...prev, noiseLevelEstimate: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-primary/30 bg-card text-[10px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Unknown</option>
                <option value="quiet">Quiet</option>
                <option value="moderate">Moderate</option>
                <option value="lively">Lively</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="powerOutlets"
              checked={formData.hasPowerOutlets}
              onChange={(e) => setFormData(prev => ({ ...prev, hasPowerOutlets: e.target.checked }))}
              className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary/20"
            />
            <label htmlFor="powerOutlets" className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Plug className="w-3 h-3" /> Has power outlets available
            </label>
          </div>

          <Button
            type="submit"
            variant="sakura"
            size="sm"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Submit Suggestion
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
