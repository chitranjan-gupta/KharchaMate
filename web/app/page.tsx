"use client"

import { useExpenseContext } from "@/lib/expense-context"
import { PageHeader } from "@/components/page-header"
import { StatsCards } from "@/components/stats-cards"
import { ExpenseChart } from "@/components/expense-chart"
import { CategoryBreakdown } from "@/components/category-breakdown"

export default function DashboardPage() {
  const { expenses, categories, income, totalExpenses, totalBudget, totalIncome, remainingBudget } = useExpenseContext()

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <PageHeader title="Dashboard" description="Overview of your finances this month" />

      <StatsCards
        totalExpenses={totalExpenses}
        totalBudget={totalBudget}
        remainingBudget={remainingBudget}
        expenseCount={expenses.length}
        totalIncome={totalIncome}
        incomeCount={income.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <ExpenseChart expenses={expenses} />
        </div>
        <div>
          <CategoryBreakdown expenses={expenses} categories={categories} />
        </div>
      </div>
    </div>
  )
}
