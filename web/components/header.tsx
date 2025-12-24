"use client"

import { Button } from "@/components/ui/button"
import { Plus, Wallet, Settings, TrendingUp } from "lucide-react"

interface HeaderProps {
  onAddExpense: () => void
  onManageBudget: () => void
  onAddIncome: () => void
}

export function Header({ onAddExpense, onManageBudget, onAddIncome }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">ExpenseTrack</h1>
            <p className="text-xs text-muted-foreground">Personal Finance</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onManageBudget} className="gap-2 bg-transparent">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Budget</span>
          </Button>
          <Button
            variant="outline"
            onClick={onAddIncome}
            className="gap-2 bg-transparent text-success border-success/30 hover:bg-success/10"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Add Income</span>
          </Button>
          <Button onClick={onAddExpense} className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Expense</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
