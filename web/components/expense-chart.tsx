"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Expense } from "@/lib/types"
import { formatAmount } from "@/lib"

interface ExpenseChartProps {
  expenses: Expense[]
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date("2026-01-07")
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split("T")[0]
  })

  const chartData = last7Days.map((date) => {
    const dayExpenses = expenses.filter((exp) => new Date(exp.date).getDate() === new Date(date).getDate())
    const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    const dayName = new Date(date).toLocaleDateString("en-IN", { weekday: "short" })
    return { date: dayName, amount: total }
  })

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Spending Trend</CardTitle>
        <p className="text-sm text-muted-foreground">Last 7 days</p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.15 160)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.15 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.5 0.02 260)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.5 0.02 260)", fontSize: 12 }}
                tickFormatter={(value) => `${value.toString()}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border rounded-lg shadow-lg p-3">
                        <p className="text-sm font-medium text-foreground">{formatAmount(Number(payload[0].value) || 0)}</p>
                        <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="oklch(0.55 0.15 160)"
                strokeWidth={2}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
