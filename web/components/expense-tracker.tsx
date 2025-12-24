"use client"

import { useState } from "react"
import { Header } from "./header"
import { StatsCards } from "./stats-cards"
import { ExpenseChart } from "./expense-chart"
import { CategoryBreakdown } from "./category-breakdown"
import { ExpenseList } from "./expense-list"
import { AddExpenseDialog } from "./add-expense-dialog"
// import { ManageBudgetDialog } from "./manage-budget-dialog"
import { AddIncomeDialog } from "./add-income-dialog"
import type { Expense, Category, Income } from "@/lib/types"
import { getTotalBudget } from "@/lib/category-utils"

const initialExpenses: Expense[] = [
  {
    id: "1",
    description: "Grocery Shopping",
    amount: 156.32,
    categoryPath: ["Food", "Groceries", "Organic"],
    date: "2025-11-28",
  },
  {
    id: "2",
    description: "Electric Bill",
    amount: 89.5,
    categoryPath: ["Utilities", "Electricity"],
    date: "2025-11-27",
  },
  {
    id: "3",
    description: "Netflix Subscription",
    amount: 15.99,
    categoryPath: ["Entertainment", "Streaming", "Video"],
    date: "2025-11-26",
  },
  {
    id: "4",
    description: "Gas Station",
    amount: 45.0,
    categoryPath: ["Transport", "Fuel", "Regular"],
    date: "2025-11-25",
  },
  {
    id: "5",
    description: "Restaurant Dinner",
    amount: 78.45,
    categoryPath: ["Food", "Dining Out", "Restaurant"],
    date: "2025-11-24",
  },
  {
    id: "6",
    description: "Gym Membership",
    amount: 50.0,
    categoryPath: ["Health", "Fitness", "Gym"],
    date: "2025-11-23",
  },
  {
    id: "7",
    description: "Online Course",
    amount: 199.0,
    categoryPath: ["Education", "Courses", "Online"],
    date: "2025-11-22",
  },
  {
    id: "8",
    description: "Phone Bill",
    amount: 65.0,
    categoryPath: ["Utilities", "Phone", "Mobile"],
    date: "2025-11-21",
  },
]

const initialCategories: Category[] = [
  {
    id: "food",
    name: "Food",
    color: "bg-chart-1",
    budget: 500,
    children: [
      {
        id: "groceries",
        name: "Groceries",
        color: "bg-chart-1",
        budget: 0,
        children: [
          { id: "organic", name: "Organic", color: "bg-chart-1", budget: 0 },
          { id: "regular", name: "Regular", color: "bg-chart-1", budget: 0 },
        ],
      },
      {
        id: "dining-out",
        name: "Dining Out",
        color: "bg-chart-1",
        budget: 0,
        children: [
          { id: "restaurant", name: "Restaurant", color: "bg-chart-1", budget: 0 },
          { id: "fast-food", name: "Fast Food", color: "bg-chart-1", budget: 0 },
          { id: "cafe", name: "Cafe", color: "bg-chart-1", budget: 0 },
        ],
      },
      { id: "coffee", name: "Coffee", color: "bg-chart-1", budget: 0 },
    ],
  },
  {
    id: "transport",
    name: "Transport",
    color: "bg-chart-2",
    budget: 200,
    children: [
      {
        id: "fuel",
        name: "Fuel",
        color: "bg-chart-2",
        budget: 0,
        children: [
          { id: "regular-fuel", name: "Regular", color: "bg-chart-2", budget: 0 },
          { id: "premium", name: "Premium", color: "bg-chart-2", budget: 0 },
        ],
      },
      { id: "public-transit", name: "Public Transit", color: "bg-chart-2", budget: 0 },
      { id: "ride-share", name: "Ride Share", color: "bg-chart-2", budget: 0 },
    ],
  },
  {
    id: "utilities",
    name: "Utilities",
    color: "bg-chart-3",
    budget: 300,
    children: [
      { id: "electricity", name: "Electricity", color: "bg-chart-3", budget: 0 },
      { id: "water", name: "Water", color: "bg-chart-3", budget: 0 },
      { id: "internet", name: "Internet", color: "bg-chart-3", budget: 0 },
      {
        id: "phone",
        name: "Phone",
        color: "bg-chart-3",
        budget: 0,
        children: [
          { id: "mobile", name: "Mobile", color: "bg-chart-3", budget: 0 },
          { id: "landline", name: "Landline", color: "bg-chart-3", budget: 0 },
        ],
      },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    color: "bg-chart-4",
    budget: 150,
    children: [
      {
        id: "streaming",
        name: "Streaming",
        color: "bg-chart-4",
        budget: 0,
        children: [
          { id: "video", name: "Video", color: "bg-chart-4", budget: 0 },
          { id: "music", name: "Music", color: "bg-chart-4", budget: 0 },
        ],
      },
      { id: "movies", name: "Movies", color: "bg-chart-4", budget: 0 },
      { id: "games", name: "Games", color: "bg-chart-4", budget: 0 },
    ],
  },
  {
    id: "health",
    name: "Health",
    color: "bg-chart-5",
    budget: 100,
    children: [
      {
        id: "fitness",
        name: "Fitness",
        color: "bg-chart-5",
        budget: 0,
        children: [
          { id: "gym", name: "Gym", color: "bg-chart-5", budget: 0 },
          { id: "equipment", name: "Equipment", color: "bg-chart-5", budget: 0 },
        ],
      },
      { id: "medical", name: "Medical", color: "bg-chart-5", budget: 0 },
      { id: "pharmacy", name: "Pharmacy", color: "bg-chart-5", budget: 0 },
    ],
  },
  {
    id: "education",
    name: "Education",
    color: "bg-primary",
    budget: 250,
    children: [
      {
        id: "courses",
        name: "Courses",
        color: "bg-primary",
        budget: 0,
        children: [
          { id: "online", name: "Online", color: "bg-primary", budget: 0 },
          { id: "in-person", name: "In-Person", color: "bg-primary", budget: 0 },
        ],
      },
      { id: "books", name: "Books", color: "bg-primary", budget: 0 },
      { id: "supplies", name: "Supplies", color: "bg-primary", budget: 0 },
    ],
  },
]

const initialIncome: Income[] = [
  {
    id: "i1",
    description: "Monthly Salary",
    amount: 5000,
    source: "Salary",
    date: "2025-11-01",
  },
  {
    id: "i2",
    description: "Freelance Project",
    amount: 750,
    source: "Freelance",
    date: "2025-11-15",
  },
  {
    id: "i3",
    description: "Stock Dividends",
    amount: 125,
    source: "Investment",
    date: "2025-11-20",
  },
]

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [income, setIncome] = useState<Income[]>(initialIncome)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false)
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false)

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalBudget = getTotalBudget(categories)
  const remainingBudget = totalBudget - totalExpenses
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0)

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses([newExpense, ...expenses])
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id))
  }

  const updateCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories)
  }

  const addIncome = (newIncome: Omit<Income, "id">) => {
    const incomeEntry: Income = {
      ...newIncome,
      id: Date.now().toString(),
    }
    setIncome([incomeEntry, ...income])
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        onAddExpense={() => setIsDialogOpen(true)}
        onManageBudget={() => setIsBudgetDialogOpen(true)}
        onAddIncome={() => setIsIncomeDialogOpen(true)}
      />

      <div className="flex-1 container mx-auto px-4 py-6 md:py-8">
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

        <div className="mt-6">
          <ExpenseList expenses={expenses} categories={categories} onDelete={deleteExpense} />
        </div>
      </div>

      <AddExpenseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddExpense={addExpense}
        categories={categories}
      />

      {/* <ManageBudgetDialog
        open={isBudgetDialogOpen}
        onOpenChange={setIsBudgetDialogOpen}
        categories={categories}
        onUpdateCategories={updateCategories}
      /> */}

      <AddIncomeDialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen} onAddIncome={addIncome} />
    </div>
  )
}
