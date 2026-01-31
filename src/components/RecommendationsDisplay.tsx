import { MapPin, Clock, DollarSign, Star, Utensils, Camera, Tent, Compass, Plane, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Attraction {
  name: string;
  description: string;
  estimatedCost: number;
  duration: string;
  bestTime: string;
  imageUrl?: string;
}

interface Restaurant {
  name: string;
  cuisine: string;
  priceRange: 'budget' | 'moderate' | 'upscale';
  averageMealCost: number;
  specialty: string;
}

interface Activity {
  name: string;
  description: string;
  estimatedCost: number;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  imageUrl?: string;
}

interface Accommodation {
  type: string;
  priceRange: string;
  description: string;
  amenities: string[];
}

interface LocalExperience {
  name: string;
  description: string;
  estimatedCost: number;
  culturalNote: string;
  imageUrl?: string;
}

interface NearbyPlace {
  name: string;
  distanceFromDestination: string;
  description: string;
  estimatedDayTripCost: number;
  recommendedDuration: string;
  transportFromDestination: string;
  imageUrl?: string;
}

interface Flight {
  airline: string;
  route: string;
  estimatedPrice: number;
  flightDuration: string;
  flightType: 'direct' | '1-stop' | '2-stop';
  classRecommendation: string;
  bookingTip: string;
  budgetFriendly: boolean;
}

interface AlternativeTransport {
  mode: string;
  route: string;
  estimatedPrice: number;
  duration: string;
  notes: string;
}

interface FlightDetails {
  available: boolean;
  flights?: Flight[];
  alternativeTransport?: AlternativeTransport[];
  bestTimeToBook?: string;
  priceNote?: string;
}

interface Recommendations {
  attractions: Attraction[];
  restaurants: Restaurant[];
  activities: Activity[];
  accommodations: Accommodation[];
  localExperiences: LocalExperience[];
  nearbyPlaces?: NearbyPlace[];
}

interface RecommendationsDisplayProps {
  recommendations: Recommendations;
  travelTips: string[];
  currency: string;
  flightDetails?: FlightDetails;
  fromLocation?: string;
}

const priceRangeColors = {
  budget: 'bg-success/20 text-success',
  moderate: 'bg-warning/20 text-warning',
  upscale: 'bg-primary/20 text-primary',
};

const difficultyColors = {
  easy: 'bg-success/20 text-success',
  moderate: 'bg-warning/20 text-warning',
  challenging: 'bg-destructive/20 text-destructive',
};

const ImageWithFallback = ({ src, alt, className }: { src?: string; alt: string; className: string }) => {
  if (!src) return null;
  
  return (
    <div className={className}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
};

export function RecommendationsDisplay({ recommendations, travelTips, currency, flightDetails, fromLocation }: RecommendationsDisplayProps) {
  const hasFlights = flightDetails?.available && flightDetails?.flights && flightDetails.flights.length > 0;
  const hasNearbyPlaces = recommendations.nearbyPlaces && recommendations.nearbyPlaces.length > 0;

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Flight Details Section */}
      {hasFlights && (
        <Card variant="sakura" className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Plane className="w-4 h-4 text-primary" />
              ✈️ Flight Options {fromLocation && `from ${fromLocation}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {flightDetails.flights?.map((flight, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg border border-primary/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-medium flex items-center gap-2">
                      {flight.airline}
                      {flight.budgetFriendly && (
                        <Badge className="text-[8px] bg-success/20 text-success">Budget Friendly</Badge>
                      )}
                    </h4>
                    <p className="text-[10px] text-muted-foreground">{flight.route}</p>
                  </div>
                  <Badge className="text-[10px] bg-primary/20">
                    ~{flight.estimatedPrice} {currency}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {flight.flightDuration}
                  </span>
                  <Badge variant="outline" className="text-[8px]">{flight.flightType}</Badge>
                  <Badge variant="outline" className="text-[8px]">{flight.classRecommendation}</Badge>
                </div>
                <p className="text-[10px] mt-2 text-muted-foreground italic">💡 {flight.bookingTip}</p>
              </div>
            ))}
            
            {/* Alternative Transport */}
            {flightDetails.alternativeTransport && flightDetails.alternativeTransport.length > 0 && (
              <div className="mt-3 pt-3 border-t border-primary/20">
                <h4 className="text-[10px] font-medium mb-2">🚆 Alternative Transport</h4>
                {flightDetails.alternativeTransport.map((transport, index) => (
                  <div key={index} className="flex justify-between items-center text-[10px] py-1">
                    <span>{transport.mode}: {transport.route}</span>
                    <span className="text-muted-foreground">{transport.duration} • ~{transport.estimatedPrice} {currency}</span>
                  </div>
                ))}
              </div>
            )}
            
            {flightDetails.priceNote && (
              <p className="text-[10px] text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
                📌 {flightDetails.priceNote}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="attractions" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="attractions" className="flex-1 min-w-fit text-[10px] gap-1">
            <MapPin className="w-3 h-3" />
            <span className="hidden sm:inline">Attractions</span>
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="flex-1 min-w-fit text-[10px] gap-1">
            <Utensils className="w-3 h-3" />
            <span className="hidden sm:inline">Food</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex-1 min-w-fit text-[10px] gap-1">
            <Compass className="w-3 h-3" />
            <span className="hidden sm:inline">Activities</span>
          </TabsTrigger>
          <TabsTrigger value="accommodations" className="flex-1 min-w-fit text-[10px] gap-1">
            <Tent className="w-3 h-3" />
            <span className="hidden sm:inline">Stay</span>
          </TabsTrigger>
          <TabsTrigger value="experiences" className="flex-1 min-w-fit text-[10px] gap-1">
            <Camera className="w-3 h-3" />
            <span className="hidden sm:inline">Local</span>
          </TabsTrigger>
          {hasNearbyPlaces && (
            <TabsTrigger value="nearby" className="flex-1 min-w-fit text-[10px] gap-1">
              <Navigation className="w-3 h-3" />
              <span className="hidden sm:inline">Nearby</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="attractions" className="mt-4 space-y-3">
          {recommendations.attractions?.map((attraction, index) => (
            <Card key={index} variant="glass" className="animate-slide-in-right overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
              <ImageWithFallback 
                src={attraction.imageUrl} 
                alt={attraction.name}
                className="h-32 overflow-hidden"
              />
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-medium">{attraction.name}</h4>
                  <Badge className="text-[10px] bg-primary/20">
                    {attraction.estimatedCost} {currency}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{attraction.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[10px] flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" /> {attraction.duration}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Best: {attraction.bestTime}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="restaurants" className="mt-4 space-y-3">
          {recommendations.restaurants?.map((restaurant, index) => (
            <Card key={index} variant="glass" className="animate-slide-in-right" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-medium">{restaurant.name}</h4>
                  <Badge className={`text-[10px] ${priceRangeColors[restaurant.priceRange]}`}>
                    {restaurant.priceRange}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {restaurant.cuisine} • ~{restaurant.averageMealCost} {currency}/meal
                </p>
                <p className="text-[10px] mt-1">⭐ {restaurant.specialty}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="activities" className="mt-4 space-y-3">
          {recommendations.activities?.map((activity, index) => (
            <Card key={index} variant="glass" className="animate-slide-in-right overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
              <ImageWithFallback 
                src={activity.imageUrl} 
                alt={activity.name}
                className="h-32 overflow-hidden"
              />
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-medium">{activity.name}</h4>
                  <div className="flex gap-1">
                    <Badge className={`text-[10px] ${difficultyColors[activity.difficulty]}`}>
                      {activity.difficulty}
                    </Badge>
                    <Badge className="text-[10px] bg-primary/20">
                      {activity.estimatedCost} {currency}
                    </Badge>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{activity.description}</p>
                <span className="text-[10px] flex items-center gap-1 text-muted-foreground mt-2">
                  <Clock className="w-3 h-3" /> {activity.duration}
                </span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="accommodations" className="mt-4 space-y-3">
          {recommendations.accommodations?.map((accommodation, index) => (
            <Card key={index} variant="glass" className="animate-slide-in-right" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-medium">{accommodation.type}</h4>
                  <Badge className="text-[10px] bg-accent">
                    {accommodation.priceRange}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{accommodation.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {accommodation.amenities?.slice(0, 4).map((amenity, i) => (
                    <Badge key={i} variant="outline" className="text-[10px]">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="experiences" className="mt-4 space-y-3">
          {recommendations.localExperiences?.map((experience, index) => (
            <Card key={index} variant="glass" className="animate-slide-in-right overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
              <ImageWithFallback 
                src={experience.imageUrl} 
                alt={experience.name}
                className="h-32 overflow-hidden"
              />
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-medium">{experience.name}</h4>
                  <Badge className="text-[10px] bg-primary/20">
                    {experience.estimatedCost} {currency}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{experience.description}</p>
                <p className="text-[10px] mt-2 italic bg-muted/50 p-2 rounded">
                  💡 {experience.culturalNote}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {hasNearbyPlaces && (
          <TabsContent value="nearby" className="mt-4 space-y-3">
            <p className="text-[10px] text-muted-foreground mb-3">
              🗺️ Day trips and nearby places to explore from your destination
            </p>
            {recommendations.nearbyPlaces?.map((place, index) => (
              <Card key={index} variant="glass" className="animate-slide-in-right overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
                <ImageWithFallback 
                  src={place.imageUrl} 
                  alt={place.name}
                  className="h-32 overflow-hidden"
                />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-medium">{place.name}</h4>
                    <Badge className="text-[10px] bg-primary/20">
                      ~{place.estimatedDayTripCost} {currency}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{place.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-[10px]">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {place.distanceFromDestination}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" /> {place.recommendedDuration}
                    </span>
                  </div>
                  <p className="text-[10px] mt-2 bg-muted/50 p-2 rounded">
                    🚗 {place.transportFromDestination}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        )}
      </Tabs>

      {/* Travel Tips */}
      {travelTips && travelTips.length > 0 && (
        <Card variant="sakura">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              💡 Travel Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {travelTips.map((tip, index) => (
                <li key={index} className="text-[10px] flex items-start gap-2">
                  <span className="text-primary">✦</span>
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
