"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { Expense, Category } from "@/lib/types"
import { formatAmount } from "@/lib"


interface CategoryBreakdownProps {
  expenses: Expense[]
  categories: Category[]
}

function CategoryItem({
  category,
  expenses,
  parentPath = [],
  depth = 0,
  expanded,
  onToggle,
}: {
  category: Category
  expenses: Expense[]
  parentPath?: string[]
  depth?: number
  expanded: Set<string>
  onToggle: (id: string) => void
}) {
  const isExpanded = expanded.has(category.id)
  const hasChildren = category.children && category.children.length > 0

  // Build the current path for this category
  const currentPath = [...parentPath, category.name]

  // Calculate total for this category (all expenses that start with this path)
  const total = expenses
    .filter((exp) => {
      if (exp.categoryPath.length < currentPath.length) return false
      return currentPath.every((segment, i) => exp.categoryPath[i] === segment)
    })
    .reduce((sum, exp) => sum + exp.amount, 0)

  const hasBudget = category.budget > 0
  const percentage = hasBudget ? (total / category.budget) * 100 : 0

  if (total === 0 && depth > 0 && !hasBudget) return null

  return (
    <div className="space-y-2">
      <div
        className={`space-y-2 ${hasChildren ? "cursor-pointer" : ""}`}
        onClick={() => hasChildren && onToggle(category.id)}
        style={{ paddingLeft: depth > 0 ? `${depth * 16}px` : undefined }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasChildren && (
              <span className="text-muted-foreground">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </span>
            )}
            {!hasChildren && depth > 0 && <span className="w-4" />}
            <div className={`w-3 h-3 rounded-full ${category.color}`} />
            <span className={`text-sm ${depth === 0 ? "font-medium" : ""} text-foreground`}>{category.name}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-foreground">{formatAmount(total)}</span>
            {hasBudget && <span className="text-xs text-muted-foreground ml-1">/ {formatAmount(category.budget)}</span>}
          </div>
        </div>

        {hasBudget && (
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${percentage > 100 ? "bg-destructive" : category.color}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div className="border-l-2 border-muted ml-2">
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              expenses={expenses}
              parentPath={currentPath}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CategoryBreakdown({ expenses, categories }: CategoryBreakdownProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Calculate totals for sorting
  const categoryTotals = categories.map((cat) => {
    const total = expenses.filter((exp) => exp.categoryPath[0] === cat.name).reduce((sum, exp) => sum + exp.amount, 0)
    return { category: cat, total }
  })

  const sortedCategories = [...categoryTotals].sort((a, b) => b.total - a.total)

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">By Category</CardTitle>
        <p className="text-sm text-muted-foreground">Budget utilization</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedCategories.map(({ category }) => (
          <CategoryItem
            key={category.id}
            category={category}
            expenses={expenses}
            parentPath={[]}
            depth={0}
            expanded={expanded}
            onToggle={toggleExpanded}
          />
        ))}
      </CardContent>
    </Card>
  )
}
