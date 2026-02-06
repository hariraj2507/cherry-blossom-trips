import { useState, useRef } from "react";
import { Camera, Upload, ArrowLeft, Loader2, List, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface MenuTranslatorProps {
  onBack: () => void;
}

interface DietaryPreferences {
  vegetarian: boolean;
  vegan: boolean;
  nonVegetarian: boolean;
  glutenFree: boolean;
  noOnionGarlic: boolean;
  nutAllergy: boolean;
  dairyFree: boolean;
}

interface TranslatedDish {
  originalName: string;
  translatedName: string;
  description: string;
  ingredients?: string[];
  dietaryTags: string[];
  spiceLevel?: 'mild' | 'medium' | 'spicy' | 'very_spicy';
  price?: string;
  isCompatible: boolean;
  warnings?: string[];
}

interface TranslationResult {
  dishes: TranslatedDish[];
  menuLanguage: string;
  restaurantType?: string;
  culturalNotes?: string;
}

export function MenuTranslator({ onBack }: MenuTranslatorProps) {
  const { t } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'overlay'>('list');
  const [preferences, setPreferences] = useState<DietaryPreferences>({
    vegetarian: false,
    vegan: false,
    nonVegetarian: false,
    glutenFree: false,
    noOnionGarlic: false,
    nutAllergy: false,
    dairyFree: false,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t('menu.fileTooLarge'),
          description: t('menu.fileTooLargeDesc'),
          variant: "destructive",
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e);
  };

  const togglePreference = (key: keyof DietaryPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const translateMenu = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    try {
      const activePreferences = Object.entries(preferences)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      const { data, error } = await supabase.functions.invoke('menu-translator', {
        body: { 
          image: image,
          dietaryPreferences: activePreferences,
        },
      });

      if (error) throw error;
      
      setResult(data);
      toast({
        title: t('menu.menuTranslated'),
        description: t('menu.foundDishes', { count: data.dishes?.length || 0, language: data.menuLanguage || 'the menu' }),
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: t('menu.translationFailed'),
        description: error instanceof Error ? error.message : t('menu.tryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTranslator = () => {
    setImage(null);
    setImageFile(null);
    setResult(null);
  };

  const getSpiceLevelEmoji = (level?: string) => {
    switch (level) {
      case 'mild': return '🌶️';
      case 'medium': return '🌶️🌶️';
      case 'spicy': return '🌶️🌶️🌶️';
      case 'very_spicy': return '🔥';
      default: return '';
    }
  };

  const getDietaryBadgeColor = (tag: string) => {
    const colors: Record<string, string> = {
      vegetarian: 'bg-green-500/20 text-green-700 border-green-500/30',
      vegan: 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30',
      'gluten-free': 'bg-blue-500/20 text-blue-700 border-blue-500/30',
      'contains-nuts': 'bg-red-500/20 text-red-700 border-red-500/30',
      'dairy-free': 'bg-purple-500/20 text-purple-700 border-purple-500/30',
      'non-vegetarian': 'bg-rose-500/20 text-rose-700 border-rose-500/30',
    };
    return colors[tag.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  const dietaryOptions = [
    { key: 'vegetarian', label: t('menu.vegetarian'), emoji: '🥬' },
    { key: 'vegan', label: t('menu.vegan'), emoji: '🌱' },
    { key: 'nonVegetarian', label: t('menu.nonVeg'), emoji: '🍖' },
    { key: 'glutenFree', label: t('menu.glutenFree'), emoji: '🌾' },
    { key: 'noOnionGarlic', label: t('menu.noOnionGarlic'), emoji: '🧄' },
    { key: 'nutAllergy', label: t('menu.nutAllergy'), emoji: '🥜' },
    { key: 'dairyFree', label: t('menu.dairyFree'), emoji: '🥛' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onBack} className="text-xs">
        <ArrowLeft className="w-3 h-3 mr-1" />
        {t('menu.backToTools')}
      </Button>

      <div className="text-center space-y-2">
        <h2 className="text-gradient-sakura">{t('menu.title')}</h2>
        <p className="text-xs text-muted-foreground">
          {t('menu.subtitle')}
        </p>
      </div>

      {/* Dietary Preferences */}
      <Card variant="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{t('menu.dietaryPrefs')}</CardTitle>
          <CardDescription className="text-xs">
            {t('menu.dietaryPrefsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {dietaryOptions.map(({ key, label, emoji }) => (
              <div key={key} className="flex items-center space-x-2">
                <Switch
                  id={key}
                  checked={preferences[key as keyof DietaryPreferences]}
                  onCheckedChange={() => togglePreference(key as keyof DietaryPreferences)}
                />
                <Label htmlFor={key} className="text-xs cursor-pointer">
                  {emoji} {label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Upload Area */}
      {!image ? (
        <Card variant="sakura" className="border-dashed">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-sakura-300 to-sakura-500 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">{t('menu.uploadPhoto')}</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {t('menu.uploadDesc')}
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <Button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="text-xs"
                >
                  <Camera className="w-4 h-4 mr-1" />
                  {t('menu.takePhoto')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  {t('menu.uploadImage')}
                </Button>
              </div>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Image Preview & Controls */}
          <Card variant="sakura">
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={image}
                  alt="Menu"
                  className="w-full max-h-80 object-contain rounded-lg"
                />
                {!result && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                    <Button
                      type="button"
                      onClick={translateMenu}
                      disabled={isProcessing}
                      size="lg"
                      className="text-sm"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('menu.translating')}
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          {t('menu.translateMenu')}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-3">
                <Button type="button" variant="outline" size="sm" onClick={resetTranslator} className="text-xs">
                  <Upload className="w-3 h-3 mr-1" />
                  {t('menu.newPhoto')}
                </Button>
                {result && (
                  <Button type="button" variant="outline" size="sm" onClick={translateMenu} disabled={isProcessing} className="text-xs">
                    <Loader2 className={`w-3 h-3 mr-1 ${isProcessing ? 'animate-spin' : ''}`} />
                    {t('menu.reTranslate')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">
                    {result.dishes?.length || 0} {t('menu.dishesFound')}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {result.menuLanguage && `${t('menu.original')}: ${result.menuLanguage}`}
                    {result.restaurantType && ` • ${result.restaurantType}`}
                  </p>
                </div>
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'overlay')}>
                  <TabsList className="h-8">
                    <TabsTrigger value="list" className="text-xs px-2">
                      <List className="w-3 h-3 mr-1" />
                      {t('menu.list')}
                    </TabsTrigger>
                    <TabsTrigger value="overlay" className="text-xs px-2">
                      <ImageIcon className="w-3 h-3 mr-1" />
                      {t('menu.overlay')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Cultural Notes */}
              {result.culturalNotes && (
                <Card variant="glass" className="border-primary/30">
                  <CardContent className="py-3 px-4">
                    <p className="text-xs text-muted-foreground">
                      💡 {result.culturalNotes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="grid gap-3">
                  {result.dishes?.map((dish, index) => (
                    <Card
                      key={index}
                      variant={dish.isCompatible ? 'sakura' : 'glass'}
                      className={!dish.isCompatible ? 'opacity-60' : ''}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium">{dish.translatedName}</h4>
                              {dish.spiceLevel && (
                                <span className="text-xs">{getSpiceLevelEmoji(dish.spiceLevel)}</span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground mb-2">
                              {t('menu.original')}: {dish.originalName}
                            </p>
                            <p className="text-xs text-foreground/80 mb-2">
                              {dish.description}
                            </p>
                            {dish.ingredients && dish.ingredients.length > 0 && (
                              <p className="text-[10px] text-muted-foreground mb-2">
                                <span className="font-medium">{t('menu.ingredients')}:</span> {dish.ingredients.join(', ')}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {dish.dietaryTags?.map((tag, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className={`text-[9px] ${getDietaryBadgeColor(tag)}`}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            {dish.warnings && dish.warnings.length > 0 && (
                              <div className="mt-2 flex items-start gap-1 text-amber-600">
                                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <p className="text-[10px]">{dish.warnings.join(', ')}</p>
                              </div>
                            )}
                          </div>
                          {dish.price && (
                            <div className="text-right">
                              <span className="text-sm font-medium text-primary">{dish.price}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Overlay View */}
              {viewMode === 'overlay' && (
                <Card variant="sakura">
                  <CardContent className="p-4">
                    <div className="relative">
                      <img
                        src={image}
                        alt="Menu with translations"
                        className="w-full rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-lg p-4 overflow-auto">
                        <div className="space-y-2">
                          {result.dishes?.map((dish, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded ${
                                dish.isCompatible 
                                  ? 'bg-primary/90 text-primary-foreground' 
                                  : 'bg-card/90 text-card-foreground'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-xs font-medium">{dish.translatedName}</span>
                                  <span className="text-[10px] opacity-75 ml-2">({dish.originalName})</span>
                                </div>
                                {dish.price && (
                                  <span className="text-xs font-bold">{dish.price}</span>
                                )}
                              </div>
                              <p className="text-[10px] opacity-90 mt-0.5">{dish.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
