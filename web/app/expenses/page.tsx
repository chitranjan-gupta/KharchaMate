"use client";

import { useEffect, useState } from "react";
import { useExpenseContext } from "@/lib/expense-context";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddExpenseDialog } from "@/components/add-expense-dialog";
import { Plus, Trash2, ChevronDown, ChevronRight, Cross } from "lucide-react";
import type { Category, Expense } from "@/lib/types";
import { Calendar24 } from "@/components/date-time-picker";

interface ExpenseTreeNode {
  name: string;
  color: string;
  expenses: Expense[];
  total: number;
  children: ExpenseTreeNode[];
}

function buildExpenseTree(
  expenses: Expense[],
  categories: Category[]
): ExpenseTreeNode[] {
  const tree: ExpenseTreeNode[] = [];

  // Group expenses by their category path
  for (const category of categories) {
    const node = buildNodeForCategory(category, expenses, [category.name]);
    if (node.total > 0 || node.children.length > 0) {
      tree.push(node);
    }
  }

  return tree;
}

function buildNodeForCategory(
  category: Category,
  allExpenses: Expense[],
  currentPath: string[]
): ExpenseTreeNode {
  // Find expenses that exactly match this category path
  const directExpenses = allExpenses.filter(
    (exp) =>
      exp.categoryPath.length === currentPath.length &&
      exp.categoryPath.every((p, i) => p === currentPath[i])
  );
  // Build children nodes
  const children: ExpenseTreeNode[] = [];
  if (category.children) {
    for (const child of category.children) {
      const childPath = [...currentPath, child.name];
      const childNode = buildNodeForCategory(child, allExpenses, childPath);
      if (childNode.total > 0 || childNode.children.length > 0) {
        children.push(childNode);
      }
    }
  }

  // Also find expenses in subcategories for total calculation
  const allSubExpenses = allExpenses.filter(
    (exp) =>
      exp.categoryPath.length >= currentPath.length &&
      currentPath.every((p, i) => exp.categoryPath[i] === p)
  );

  const total = allSubExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return {
    name: category.name,
    color: category.color,
    expenses: directExpenses,
    total,
    children,
  };
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

function ExpenseTreeItem({
  node,
  depth,
  expanded,
  onToggle,
  onDeleteExpense,
}: {
  node: ExpenseTreeNode;
  depth: number;
  expanded: Set<string>;
  onToggle: (name: string) => void;
  onDeleteExpense: (id: string) => void;
}) {
  const isExpanded = expanded.has(node.name);
  const hasContent = node.expenses.length > 0 || node.children.length > 0;
  const isRoot = depth === 0;

  return (
    <div
      className={`rounded-lg ${isRoot ? "border p-3" : "py-2"} space-y-2`}
      style={{ marginLeft: isRoot ? 0 : 16 }}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onToggle(node.name)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        <div className={`w-3 h-3 rounded-full ${node.color} shrink-0`} />

        <span className="text-sm font-medium flex-1">{node.name}</span>

        <span className="text-sm font-semibold text-destructive">
          {formatAmount(node.total)}
        </span>
      </div>

      {isExpanded && (
        <div
          className={`${
            isRoot
              ? "ml-4 pl-4 border-l-2 border-muted"
              : "pl-2 border-l border-muted/50"
          }`}
        >
          {/* Direct expenses in this category */}
          {node.expenses.length > 0 && (
            <div className="space-y-1 mb-2">
              {node.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {expense.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(expense.date)}
                      </p>
                      {expense.note && (
                        <p
                          className="text-xs text-muted-foreground mt-1 italic truncate"
                          title={expense.note}
                        >
                          {expense.note}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-destructive">
                      {formatAmount(expense.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteExpense(expense.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span className="sr-only">Delete expense</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Child categories */}
          {node.children.length > 0 ? (
            node.children.map((child) => (
              <ExpenseTreeItem
                key={child.name}
                node={child}
                depth={depth + 1}
                expanded={expanded}
                onToggle={onToggle}
                onDeleteExpense={onDeleteExpense}
              />
            ))
          ) : node.expenses.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              No expenses in this category.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function ExpensesPage() {
  const { expenses, categories, totalExpenses, addExpense, deleteExpense } =
    useExpenseContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(categories.map((c) => c.name))
  );
  const [filterDate, setFilterDate] = useState<Date | null>(new Date());
  const [expenseTree, setExpenseTree] = useState<ExpenseTreeNode[]>(() =>
    buildExpenseTree(expenses, categories)
  );

  const toggleExpanded = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  useEffect(() => {
    if (filterDate) {
      const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getFullYear() === filterDate.getFullYear() &&
          expenseDate.getMonth() === filterDate.getMonth() &&
          expenseDate.getDate() === filterDate.getDate()
        );
      });
      // Rebuild the expense tree with filtered expenses
      const newExpenseTree = buildExpenseTree(filteredExpenses, categories);
      setExpenseTree(newExpenseTree);
    } else {
      // If no filter date, show all expenses
      const newExpenseTree = buildExpenseTree(expenses, categories);
      console.log(newExpenseTree)
      setExpenseTree(newExpenseTree);
    }
  }, [filterDate]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <PageHeader
        title="Expenses"
        description={`Total: ${formatAmount(totalExpenses)} across ${
          expenses.length
        } transactions`}
        actions={
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        }
      />

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                By Category
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Expenses organized by category hierarchy
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mt-1">Filter By</p>
              <div className="flex flex-row items-center">
                <Calendar24 date={filterDate} setDate={setFilterDate} />
                <Button onClick={() => setFilterDate(null)} className="gap-2">
                  <Cross className="w-4 h-4" />
                  Clear
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Spent</p>
              <p className="text-xl font-bold text-destructive">
                {formatAmount(totalExpenses)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {expenseTree.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No expenses yet. Add your first expense!
            </p>
          ) : (
            expenseTree.map((node) => (
              <ExpenseTreeItem
                key={node.name}
                node={node}
                depth={0}
                expanded={expanded}
                onToggle={toggleExpanded}
                onDeleteExpense={deleteExpense}
              />
            ))
          )}
        </CardContent>
      </Card>

      <AddExpenseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddExpense={addExpense}
        categories={categories}
      />
    </div>
  );
}
