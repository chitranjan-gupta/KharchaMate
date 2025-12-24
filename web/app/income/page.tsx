"use client"

import { useState } from "react"
import { useExpenseContext } from "@/lib/expense-context"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddIncomeDialog } from "@/components/add-income-dialog"
import {
  Plus,
  Trash2,
  Briefcase,
  Laptop,
  TrendingUp,
  Home,
  Building,
  Gift,
  RotateCcw,
  MoreHorizontal,
} from "lucide-react"
import type React from "react"

const sourceIcons: Record<string, React.ReactNode> = {
  Salary: <Briefcase className="w-4 h-4" />,
  Freelance: <Laptop className="w-4 h-4" />,
  Investment: <TrendingUp className="w-4 h-4" />,
  Rental: <Home className="w-4 h-4" />,
  Business: <Building className="w-4 h-4" />,
  Gift: <Gift className="w-4 h-4" />,
  Refund: <RotateCcw className="w-4 h-4" />,
  Other: <MoreHorizontal className="w-4 h-4" />,
}

const sourceColors: Record<string, string> = {
  Salary: "bg-success/10 text-success",
  Freelance: "bg-chart-1/10 text-chart-1",
  Investment: "bg-chart-2/10 text-chart-2",
  Rental: "bg-chart-3/10 text-chart-3",
  Business: "bg-chart-4/10 text-chart-4",
  Gift: "bg-chart-5/10 text-chart-5",
  Refund: "bg-primary/10 text-primary",
  Other: "bg-muted text-muted-foreground",
}

export default function IncomePage() {
  const { income, totalIncome, addIncome, deleteIncome } = useExpenseContext()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <PageHeader
        title="Income"
        description={`Total: $${totalIncome.toLocaleString()} from ${income.length} sources`}
        actions={
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Income
          </Button>
        }
      />

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">All Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {income.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No income recorded yet. Add your first income!</p>
            ) : (
              income.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-xl ${sourceColors[entry.source] || "bg-muted text-muted-foreground"}`}
                    >
                      {sourceIcons[entry.source] || <MoreHorizontal className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{entry.source}</span>
                        <span>•</span>
                        <span>{formatDate(entry.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-success">+${entry.amount.toLocaleString()}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteIncome(entry.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete income</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddIncomeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAddIncome={addIncome} />
    </div>
  )
}
