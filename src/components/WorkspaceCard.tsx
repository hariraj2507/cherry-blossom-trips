import { Wifi, Plug, Volume2, Star, MapPin, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  city: string;
  country: string;
  region: string | null;
  wifi_speed_mbps: number | null;
  wifi_quality: string | null;
  has_power_outlets: boolean | null;
  power_outlet_count: string | null;
  noise_level: string | null;
  has_quiet_zones: boolean | null;
  hours_open: string | null;
  hours_close: string | null;
  open_24_hours: boolean | null;
  amenities: string[] | null;
  average_rating: number | null;
  review_count: number | null;
  website_url: string | null;
}

interface WorkspaceCardProps {
  workspace: Workspace;
  onSelect?: (workspace: Workspace) => void;
}

const getWifiQualityColor = (quality: string | null) => {
  switch (quality) {
    case 'excellent': return 'bg-success/20 text-success';
    case 'good': return 'bg-leaf-200 text-leaf-700';
    case 'moderate': return 'bg-warning/20 text-warning';
    case 'poor': return 'bg-destructive/20 text-destructive';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getNoiseColor = (level: string | null) => {
  switch (level) {
    case 'silent': return 'bg-leaf-200 text-leaf-700';
    case 'quiet': return 'bg-success/20 text-success';
    case 'moderate': return 'bg-warning/20 text-warning';
    case 'noisy': return 'bg-destructive/20 text-destructive';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function WorkspaceCard({ workspace, onSelect }: WorkspaceCardProps) {
  const formatHours = () => {
    if (workspace.open_24_hours) return '24/7';
    if (workspace.hours_open && workspace.hours_close) {
      return `${workspace.hours_open} - ${workspace.hours_close}`;
    }
    return 'Hours vary';
  };

  const amenityLabels: Record<string, string> = {
    coffee: '☕ Coffee',
    food: '🍽️ Food',
    meeting_rooms: '🏢 Meetings',
    phone_booths: '📞 Calls',
    gym: '💪 Gym',
    events: '🎉 Events',
    outdoor_seating: '🌿 Outdoor',
    meditation_room: '🧘 Meditation',
    rooftop: '🏙️ Rooftop',
    pool: '🏊 Pool',
    garden: '🌳 Garden',
    beach_access: '🏖️ Beach',
    yoga: '🧘 Yoga',
    accommodation: '🛏️ Stay',
    shower: '🚿 Shower',
    printer: '🖨️ Print',
    locker: '🔒 Locker',
    parking: '🅿️ Parking',
    bar: '🍸 Bar',
    hardware_lab: '🔧 Lab',
    podcast_studio: '🎙️ Podcast',
    kitchen: '🍳 Kitchen',
  };

  return (
    <Card variant="sakura" className="hover:shadow-float transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm truncate">{workspace.name}</CardTitle>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-[10px] truncate">
                {workspace.city}, {workspace.country}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-3 h-3 text-warning fill-warning" />
            <span className="text-xs font-medium">
              {workspace.average_rating?.toFixed(1) || 'New'}
            </span>
            <span className="text-[10px] text-muted-foreground">
              ({workspace.review_count || 0})
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {workspace.description && (
          <p className="text-[10px] text-muted-foreground line-clamp-2">
            {workspace.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {workspace.wifi_quality && (
            <Badge variant="secondary" className={`text-[10px] ${getWifiQualityColor(workspace.wifi_quality)}`}>
              <Wifi className="w-3 h-3 mr-1" />
              {workspace.wifi_speed_mbps ? `${workspace.wifi_speed_mbps}Mbps` : workspace.wifi_quality}
            </Badge>
          )}
          
          {workspace.has_power_outlets && (
            <Badge variant="secondary" className="text-[10px] bg-secondary">
              <Plug className="w-3 h-3 mr-1" />
              {workspace.power_outlet_count || 'Available'}
            </Badge>
          )}
          
          {workspace.noise_level && (
            <Badge variant="secondary" className={`text-[10px] ${getNoiseColor(workspace.noise_level)}`}>
              <Volume2 className="w-3 h-3 mr-1" />
              {workspace.noise_level}
            </Badge>
          )}
          
          {workspace.has_quiet_zones && (
            <Badge variant="secondary" className="text-[10px] bg-leaf-100 text-leaf-700">
              🤫 Quiet Zone
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-[10px]">{formatHours()}</span>
        </div>

        {workspace.amenities && workspace.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {workspace.amenities.slice(0, 4).map((amenity) => (
              <span key={amenity} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                {amenityLabels[amenity] || amenity}
              </span>
            ))}
            {workspace.amenities.length > 4 && (
              <span className="text-[10px] text-muted-foreground">
                +{workspace.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="sakura" 
            size="sm" 
            className="flex-1 text-[10px]"
            onClick={() => onSelect?.(workspace)}
          >
            View Details
          </Button>
          {workspace.website_url && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-[10px]"
              onClick={() => window.open(workspace.website_url!, '_blank')}
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
