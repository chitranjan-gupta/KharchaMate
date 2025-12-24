export interface Expense {
  id: string
  description: string
  amount: number
  categoryPath: string[] // e.g. ["Food", "Groceries", "Organic"]
  date: string
  note?: string
}

export interface Income {
  id: string
  description: string
  amount: number
  source: string
  date: string
}

export interface Category {
  id: string
  name: string
  color: string
  budget: number
  children?: Category[]
}

export interface Cat {
  id: string
  name: string
  color: string
  amount: number
  date: string
  children?: Cat[]
}

export interface Transaction {
  id: string
  details: string
  amount: number
  type: "withdraw" | "deposit"
  date: string
  time: string
  account: string
  categoryPath: string[]
  note?: string
}

export interface FlatCategory {
  id: string
  name: string
  path: string[]
  depth: number
  color: string
  budget: number
  hasChildren: boolean
}
