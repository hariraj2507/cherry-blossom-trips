import { useState } from "react";
import { Camera, BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MenuTranslator } from "./MenuTranslator";
import { Badge } from "@/components/ui/badge";

type ActiveTool = 'directory' | 'menu-translator' | 'slang-guide';

export function ToolsDirectory() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('directory');

  if (activeTool === 'menu-translator') {
    return <MenuTranslator onBack={() => setActiveTool('directory')} />;
  }

  // Placeholder for slang guide
  if (activeTool === 'slang-guide') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setActiveTool('directory')} className="text-xs">
          ← Back to Tools
        </Button>
        <Card variant="sakura">
          <CardHeader className="text-center">
            <CardTitle className="text-gradient-sakura">Slang & Etiquette Guide</CardTitle>
            <CardDescription>Coming soon! Learn local phrases and customs.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-gradient-sakura">Cultural Tools</h2>
        <p className="text-xs text-muted-foreground">
          Navigate local culture with AI-powered assistance
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Menu Translator Card */}
        <Card 
          variant="sakura" 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
          onClick={() => setActiveTool('menu-translator')}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sakura-300 to-sakura-500 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <Badge variant="secondary" className="text-[10px]">AI Powered</Badge>
            </div>
            <CardTitle className="text-sm">Menu Translator</CardTitle>
            <CardDescription className="text-xs">
              Snap a photo of any menu and get instant translations with dish explanations and dietary info
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="outline" className="text-[9px]">Tamil</Badge>
              <Badge variant="outline" className="text-[9px]">Hindi</Badge>
              <Badge variant="outline" className="text-[9px]">Japanese</Badge>
              <Badge variant="outline" className="text-[9px]">Korean</Badge>
              <Badge variant="outline" className="text-[9px]">+50 more</Badge>
            </div>
            <Button size="sm" className="w-full text-xs">
              Open Translator <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Slang Guide Card */}
        <Card 
          variant="glass" 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] opacity-75"
          onClick={() => setActiveTool('slang-guide')}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/50 to-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <Badge variant="outline" className="text-[10px]">Coming Soon</Badge>
            </div>
            <CardTitle className="text-sm">Slang & Etiquette Guide</CardTitle>
            <CardDescription className="text-xs">
              Learn essential phrases and local customs for Tamil Nadu and beyond
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="outline" className="text-[9px]">Restaurant</Badge>
              <Badge variant="outline" className="text-[9px]">Transport</Badge>
              <Badge variant="outline" className="text-[9px]">Greetings</Badge>
              <Badge variant="outline" className="text-[9px]">Shopping</Badge>
            </div>
            <Button size="sm" variant="outline" className="w-full text-xs">
              Coming Soon <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}