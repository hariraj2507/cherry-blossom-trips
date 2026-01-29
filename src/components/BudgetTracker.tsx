import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Plus, Trash2, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
}

interface SuggestedBreakdown {
  accommodation: number;
  food: number;
  activities: number;
  transport: number;
  miscellaneous: number;
}

interface BudgetTrackerProps {
  totalBudget: number;
  currency: string;
  suggestedBreakdown?: SuggestedBreakdown;
}

const categoryConfig: Record<string, { color: string; label: string; emoji: string }> = {
  accommodation: { color: '#f472b6', label: 'Accommodation', emoji: '🏨' },
  food: { color: '#fb923c', label: 'Food', emoji: '🍽️' },
  activities: { color: '#a78bfa', label: 'Activities', emoji: '🎢' },
  transport: { color: '#60a5fa', label: 'Transport', emoji: '🚗' },
  miscellaneous: { color: '#4ade80', label: 'Misc', emoji: '📦' },
};

export function BudgetTracker({ totalBudget, currency, suggestedBreakdown }: BudgetTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: 'food',
    description: '',
    amount: '',
  });

  const addExpense = () => {
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) return;
    
    setExpenses([
      ...expenses,
      {
        id: Date.now().toString(),
        category: newExpense.category,
        description: newExpense.description || categoryConfig[newExpense.category].label,
        amount: parseFloat(newExpense.amount),
      },
    ]);
    setNewExpense({ category: 'food', description: '', amount: '' });
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentSpent = (totalSpent / totalBudget) * 100;

  // Group expenses by category for pie chart
  const expensesByCategory = Object.keys(categoryConfig).map(category => ({
    name: categoryConfig[category].label,
    value: expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0),
    color: categoryConfig[category].color,
  })).filter(item => item.value > 0);

  // Comparison data for bar chart
  const comparisonData = suggestedBreakdown ? Object.keys(categoryConfig).map(category => ({
    name: categoryConfig[category].emoji,
    suggested: suggestedBreakdown[category as keyof SuggestedBreakdown] || 0,
    actual: expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0),
  })) : [];

  return (
    <div className="space-y-4">
      {/* Budget Overview */}
      <Card variant="sakura">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total Budget</span>
              <span className="text-sm font-medium">{totalBudget.toLocaleString()} {currency}</span>
            </div>
            
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  percentSpent > 100 ? 'bg-destructive' : 
                  percentSpent > 80 ? 'bg-warning' : 'bg-primary'
                }`}
                style={{ width: `${Math.min(percentSpent, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-muted-foreground">Spent: </span>
                <span className={`text-xs font-medium ${percentSpent > 100 ? 'text-destructive' : ''}`}>
                  {totalSpent.toLocaleString()} {currency}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Remaining: </span>
                <span className={`text-xs font-medium ${remaining < 0 ? 'text-destructive' : 'text-success'}`}>
                  {remaining.toLocaleString()} {currency}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Log Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Select
              value={newExpense.category}
              onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key} className="text-xs">
                    {config.emoji} {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              variant="sakura"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
              className="flex-1 min-w-[120px]"
            />
            
            <Input
              variant="sakura"
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
              className="w-24"
            />
            
            <Button onClick={addExpense} size="icon" variant="sakura">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      {expenses.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-sakura">
              {expenses.map((expense) => (
                <div 
                  key={expense.id}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Badge 
                      style={{ backgroundColor: categoryConfig[expense.category].color }}
                      className="text-[10px] text-white"
                    >
                      {categoryConfig[expense.category].emoji}
                    </Badge>
                    <span className="text-xs">{expense.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">
                      {expense.amount.toLocaleString()} {currency}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeExpense(expense.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {expensesByCategory.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `${value.toLocaleString()} ${currency}`}
                      contentStyle={{ 
                        fontFamily: '"Press Start 2P"', 
                        fontSize: '10px',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '10px', fontFamily: '"Press Start 2P"' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {suggestedBreakdown && comparisonData.some(d => d.actual > 0) && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Suggested vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={30} />
                    <Tooltip 
                      formatter={(value: number) => `${value.toLocaleString()} ${currency}`}
                      contentStyle={{ 
                        fontFamily: '"Press Start 2P"', 
                        fontSize: '10px',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="suggested" fill="#fbbf24" name="Suggested" />
                    <Bar dataKey="actual" fill="#f472b6" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
