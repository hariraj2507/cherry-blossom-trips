import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage, languageNames, SupportedLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as SupportedLanguage)}>
      <SelectTrigger className="w-auto h-8 gap-1 text-[10px] border-border/50 bg-background/50">
        <Globe className="w-3 h-3" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.entries(languageNames) as [SupportedLanguage, string][]).map(([code, name]) => (
          <SelectItem key={code} value={code} className="text-xs">
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
