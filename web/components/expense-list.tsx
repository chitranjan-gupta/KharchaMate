"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart, Zap, Film, Car, Heart, BookOpen } from "lucide-react"
import type { Expense, Category } from "@/lib/types"
import { getCategoryPathString } from "@/lib/category-utils"

interface ExpenseListProps {
  expenses: Expense[]
  categories: Category[]
  onDelete: (id: string) => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  Food: <ShoppingCart className="w-4 h-4" />,
  Utilities: <Zap className="w-4 h-4" />,
  Entertainment: <Film className="w-4 h-4" />,
  Transport: <Car className="w-4 h-4" />,
  Health: <Heart className="w-4 h-4" />,
  Education: <BookOpen className="w-4 h-4" />,
}

const categoryColors: Record<string, string> = {
  Food: "bg-chart-1/10 text-chart-1",
  Transport: "bg-chart-2/10 text-chart-2",
  Utilities: "bg-chart-3/10 text-chart-3",
  Entertainment: "bg-chart-4/10 text-chart-4",
  Health: "bg-chart-5/10 text-chart-5",
  Education: "bg-primary/10 text-primary",
}

export function ExpenseList({ expenses, categories, onDelete }: ExpenseListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
        <p className="text-sm text-muted-foreground">Your latest expenses</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {expenses.map((expense) => {
            const rootCategory = expense.categoryPath[0]
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl ${categoryColors[rootCategory] || "bg-muted text-muted-foreground"}`}
                  >
                    {categoryIcons[rootCategory]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{expense.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{getCategoryPathString(expense.categoryPath)}</span>
                      <span>•</span>
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">-${expense.amount.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(expense.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Delete expense</span>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
