"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Expense, Category, Income, Transaction } from "./types"
import { generateId, getBudget } from "./category-utils"

const initialExpenses: Expense[] = [
  // {
  //   id: "1",
  //   description: "Grocery Shopping",
  //   amount: 156.32,
  //   categoryPath: ["Food", "Groceries", "Organic"],
  //   date: "2025-11-28",
  // },
  // {
  //   id: "2",
  //   description: "Electric Bill",
  //   amount: 89.5,
  //   categoryPath: ["Utilities", "Electricity"],
  //   date: "2025-11-27",
  // },
  // {
  //   id: "3",
  //   description: "Netflix Subscription",
  //   amount: 15.99,
  //   categoryPath: ["Entertainment", "Streaming", "Video"],
  //   date: "2025-11-26",
  // },
  // {
  //   id: "4",
  //   description: "Gas Station",
  //   amount: 45.0,
  //   categoryPath: ["Transport", "Fuel", "Regular"],
  //   date: "2025-11-25",
  // },
  // {
  //   id: "5",
  //   description: "Restaurant Dinner",
  //   amount: 78.45,
  //   categoryPath: ["Food", "Dining Out", "Restaurant"],
  //   date: "2025-11-24",
  // },
  // {
  //   id: "6",
  //   description: "Gym Membership",
  //   amount: 50.0,
  //   categoryPath: ["Health", "Fitness", "Gym"],
  //   date: "2025-11-23",
  // },
  // {
  //   id: "7",
  //   description: "Online Course",
  //   amount: 199.0,
  //   categoryPath: ["Education", "Courses", "Online"],
  //   date: "2025-11-22",
  // },
  // {
  //   id: "8",
  //   description: "Phone Bill",
  //   amount: 65.0,
  //   categoryPath: ["Utilities", "Phone", "Mobile"],
  //   date: "2025-11-21",
  // },
  //   {
  //   id: "9",
  //   description: "Restaurant Dinner",
  //   amount: 78.45,
  //   categoryPath: ["Food", "Dining Out", "Fast Food"],
  //   date: "2025-11-24",
  // },

]

const initialCategories: Category[] = [
  // {
  //   id: "food",
  //   name: "Food",
  //   color: "bg-chart-1",
  //   budget: 500,
  //   children: [
  //     {
  //       id: "groceries",
  //       name: "Groceries",
  //       color: "bg-chart-1",
  //       budget: 0,
  //       children: [
  //         { id: "organic", name: "Organic", color: "bg-chart-1", budget: 0 },
  //         { id: "regular", name: "Regular", color: "bg-chart-1", budget: 0 },
  //       ],
  //     },
  //     {
  //       id: "dining-out",
  //       name: "Dining Out",
  //       color: "bg-chart-1",
  //       budget: 0,
  //       children: [
  //         { id: "restaurant", name: "Restaurant", color: "bg-chart-1", budget: 0 },
  //         { id: "fast-food", name: "Fast Food", color: "bg-chart-1", budget: 0 },
  //         { id: "cafe", name: "Cafe", color: "bg-chart-1", budget: 0 },
  //       ],
  //     },
  //     { id: "coffee", name: "Coffee", color: "bg-chart-1", budget: 0 },
  //   ],
  // },
  // {
  //   id: "transport",
  //   name: "Transport",
  //   color: "bg-chart-2",
  //   budget: 200,
  //   children: [
  //     {
  //       id: "fuel",
  //       name: "Fuel",
  //       color: "bg-chart-2",
  //       budget: 0,
  //       children: [
  //         { id: "regular-fuel", name: "Regular", color: "bg-chart-2", budget: 0 },
  //         { id: "premium", name: "Premium", color: "bg-chart-2", budget: 0 },
  //       ],
  //     },
  //     { id: "public-transit", name: "Public Transit", color: "bg-chart-2", budget: 0 },
  //     { id: "ride-share", name: "Ride Share", color: "bg-chart-2", budget: 0 },
  //   ],
  // },
  // {
  //   id: "utilities",
  //   name: "Utilities",
  //   color: "bg-chart-3",
  //   budget: 300,
  //   children: [
  //     { id: "electricity", name: "Electricity", color: "bg-chart-3", budget: 0 },
  //     { id: "water", name: "Water", color: "bg-chart-3", budget: 0 },
  //     { id: "internet", name: "Internet", color: "bg-chart-3", budget: 0 },
  //     {
  //       id: "phone",
  //       name: "Phone",
  //       color: "bg-chart-3",
  //       budget: 0,
  //       children: [
  //         { id: "mobile", name: "Mobile", color: "bg-chart-3", budget: 0 },
  //         { id: "landline", name: "Landline", color: "bg-chart-3", budget: 0 },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "entertainment",
  //   name: "Entertainment",
  //   color: "bg-chart-4",
  //   budget: 150,
  //   children: [
  //     {
  //       id: "streaming",
  //       name: "Streaming",
  //       color: "bg-chart-4",
  //       budget: 0,
  //       children: [
  //         { id: "video", name: "Video", color: "bg-chart-4", budget: 0 },
  //         { id: "music", name: "Music", color: "bg-chart-4", budget: 0 },
  //       ],
  //     },
  //     { id: "movies", name: "Movies", color: "bg-chart-4", budget: 0 },
  //     { id: "games", name: "Games", color: "bg-chart-4", budget: 0 },
  //   ],
  // },
  // {
  //   id: "health",
  //   name: "Health",
  //   color: "bg-chart-5",
  //   budget: 100,
  //   children: [
  //     {
  //       id: "fitness",
  //       name: "Fitness",
  //       color: "bg-chart-5",
  //       budget: 0,
  //       children: [
  //         { id: "gym", name: "Gym", color: "bg-chart-5", budget: 0 },
  //         { id: "equipment", name: "Equipment", color: "bg-chart-5", budget: 0 },
  //       ],
  //     },
  //     { id: "medical", name: "Medical", color: "bg-chart-5", budget: 0 },
  //     { id: "pharmacy", name: "Pharmacy", color: "bg-chart-5", budget: 0 },
  //   ],
  // },
  // {
  //   id: "education",
  //   name: "Education",
  //   color: "bg-primary",
  //   budget: 250,
  //   children: [
  //     {
  //       id: "courses",
  //       name: "Courses",
  //       color: "bg-primary",
  //       budget: 0,
  //       children: [
  //         { id: "online", name: "Online", color: "bg-primary", budget: 0 },
  //         { id: "in-person", name: "In-Person", color: "bg-primary", budget: 0 },
  //       ],
  //     },
  //     { id: "books", name: "Books", color: "bg-primary", budget: 0 },
  //     { id: "supplies", name: "Supplies", color: "bg-primary", budget: 0 },
  //   ],
  // },
]

const initialIncome: Income[] = [
  // { id: "i1", description: "Monthly Salary", amount: 5000, source: "Salary", date: "2025-11-01" },
  // { id: "i2", description: "Freelance Project", amount: 750, source: "Freelance", date: "2025-11-15" },
  // { id: "i3", description: "Stock Dividends", amount: 125, source: "Investment", date: "2025-11-20" },
]

interface ExpenseContextType {
  expenses: Expense[]
  categories: Category[]
  income: Income[]
  transactions: Transaction[]
  totalExpenses: number
  totalBudget: number
  totalIncome: number
  remainingBudget: number
  addExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
  updateCategories: (categories: Category[]) => void
  addIncome: (income: Income) => void
  deleteIncome: (id: string) => void
  addTransaction?: (transaction: Transaction) => void
}

const ExpenseContext = createContext<ExpenseContextType | null>(null)

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [income, setIncome] = useState<Income[]>(initialIncome)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalBudget = getBudget(categories)
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0)
  const remainingBudget = totalBudget - totalExpenses

  const addExpense = (expense: Expense) => {
    const newExpense: Expense = { ...expense, id: expense.id || generateId() }
    // setExpenses([newExpense, ...expenses])
    setExpenses((prevExpenses) => [prevExpenses.filter((e) => e.id !== newExpense.id), newExpense].flat())
  }

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prevTransactions) => [prevTransactions.filter((t) => t.id !== transaction.id), transaction].flat())
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id))
  }

  const updateCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories)
  }

  const addIncome = (newIncome: Income) => {
    const incomeEntry: Income = { ...newIncome, id: newIncome.id || generateId() }
    setIncome((prevIncome) => [prevIncome.filter((i) => i.id !== incomeEntry.id), incomeEntry].flat())
  }

  const deleteIncome = (id: string) => {
    setIncome(income.filter((inc) => inc.id !== id))
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        transactions,
        income,
        totalExpenses,
        totalBudget,
        totalIncome,
        remainingBudget,
        addExpense,
        deleteExpense,
        updateCategories,
        addIncome,
        deleteIncome,
        addTransaction,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenseContext() {
  const context = useContext(ExpenseContext)
  if (!context) throw new Error("useExpenseContext must be used within ExpenseProvider")
  return context
}
