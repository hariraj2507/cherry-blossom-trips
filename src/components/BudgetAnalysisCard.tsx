import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BudgetAnalysis {
  feasibility: 'feasible' | 'too_low' | 'too_high';
  dailyBudgetPerPerson: number;
  estimatedTotalCost: number;
  message: string;
  adjustmentSuggestions: string[];
}

interface BudgetAnalysisCardProps {
  analysis: BudgetAnalysis;
  currency: string;
  totalBudget: number;
}

export function BudgetAnalysisCard({ analysis, currency, totalBudget }: BudgetAnalysisCardProps) {
  const getFeasibilityConfig = () => {
    switch (analysis.feasibility) {
      case 'feasible':
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/30',
          label: 'Budget Approved',
        };
      case 'too_low':
        return {
          icon: TrendingDown,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/30',
          label: 'Budget Too Low',
        };
      case 'too_high':
        return {
          icon: TrendingUp,
          color: 'text-info',
          bgColor: 'bg-info/10',
          borderColor: 'border-info/30',
          label: 'High Budget',
        };
    }
  };

  const config = getFeasibilityConfig();
  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2 animate-scale-in`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className={`w-5 h-5 ${config.color}`} />
          Budget Analysis
          <Badge variant="secondary" className={`${config.color} text-[10px]`}>
            {config.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground">Your Budget</p>
            <p className="text-sm font-medium flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {totalBudget.toLocaleString()} {currency}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground">Estimated Cost</p>
            <p className={`text-sm font-medium ${
              analysis.estimatedTotalCost > totalBudget ? 'text-destructive' : config.color
            }`}>
              {analysis.estimatedTotalCost.toLocaleString()} {currency}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground">Daily Budget/Person</p>
            <p className="text-sm font-medium">
              {analysis.dailyBudgetPerPerson.toLocaleString()} {currency}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground">Difference</p>
            <p className={`text-sm font-medium ${
              totalBudget - analysis.estimatedTotalCost >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {totalBudget - analysis.estimatedTotalCost >= 0 ? '+' : ''}
              {(totalBudget - analysis.estimatedTotalCost).toLocaleString()} {currency}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs leading-relaxed">{analysis.message}</p>
        </div>

        {analysis.feasibility !== 'feasible' && analysis.adjustmentSuggestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <AlertTriangle className="w-3 h-3" />
              Suggestions
            </div>
            <ul className="space-y-1">
              {analysis.adjustmentSuggestions.map((suggestion, index) => (
                <li key={index} className="text-[10px] flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
