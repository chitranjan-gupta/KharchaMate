"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, Receipt, DollarSign } from "lucide-react"

interface StatsCardsProps {
  totalExpenses: number
  totalBudget: number
  remainingBudget: number
  expenseCount: number
  totalIncome: number
  incomeCount: number
}

export function StatsCards({
  totalExpenses,
  totalBudget,
  remainingBudget,
  expenseCount,
  totalIncome,
  incomeCount,
}: StatsCardsProps) {
  const percentUsed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0
  const netBalance = totalIncome - totalExpenses

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-success/10">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Income</p>
              <p className="text-xl md:text-2xl font-bold text-success">${totalIncome.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{incomeCount} entries</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Budget</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">${totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10">
              <TrendingUp className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Spent</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">${totalExpenses.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{expenseCount} transactions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl ${remainingBudget >= 0 ? "bg-success/10" : "bg-destructive/10"}`}
            >
              <TrendingDown className={`w-5 h-5 ${remainingBudget >= 0 ? "text-success" : "text-destructive"}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Budget Left</p>
              <p
                className={`text-xl md:text-2xl font-bold ${remainingBudget >= 0 ? "text-success" : "text-destructive"}`}
              >
                ${Math.abs(remainingBudget).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm col-span-2 lg:col-span-1">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl ${netBalance >= 0 ? "bg-success/10" : "bg-destructive/10"}`}
            >
              <Receipt className={`w-5 h-5 ${netBalance >= 0 ? "text-success" : "text-destructive"}`} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">Net Balance</p>
              <p className={`text-xl md:text-2xl font-bold ${netBalance >= 0 ? "text-success" : "text-destructive"}`}>
                {netBalance >= 0 ? "+" : "-"}${Math.abs(netBalance).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Budget used</span>
              <span className="font-medium text-foreground">{percentUsed.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${percentUsed > 100 ? "bg-destructive" : "bg-primary"}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
