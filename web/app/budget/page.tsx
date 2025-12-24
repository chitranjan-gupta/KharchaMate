"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useExpenseContext } from "@/lib/expense-context"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical, Save } from "lucide-react"
import type { Category } from "@/lib/types"
import { generateId, getTotalBudget, moveCategoryById, isDescendantOf } from "@/lib/category-utils"

interface DragState {
  draggedId: string | null
  dragOverId: string | null
  dropPosition: "inside" | "before" | "after" | null
}

function CategoryEditor({
  category,
  depth,
  expanded,
  onToggle,
  onChange,
  onRemove,
  dragState,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  allCategories,
}: {
  category: Category
  depth: number
  expanded: Set<string>
  onToggle: (id: string) => void
  onChange: (updated: Category) => void
  onRemove: () => void
  dragState: DragState
  onDragStart: (id: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, id: string) => void
  onDragLeave: () => void
  onDrop: (targetId: string, position: "inside" | "before" | "after") => void
  allCategories: Category[]
}) {
  const isExpanded = expanded.has(category.id)
  const hasChildren = category.children && category.children.length > 0
  const isRoot = depth === 0
  const isDragging = dragState.draggedId === category.id
  const isDragOver = dragState.dragOverId === category.id

  const handleBudgetChange = (value: string) => {
    onChange({ ...category, budget: Number.parseFloat(value) || 0 })
  }

  const handleChildChange = (childId: string, updated: Category) => {
    onChange({
      ...category,
      children: category.children?.map((c) => (c.id === childId ? updated : c)),
    })
  }

  const handleRemoveChild = (childId: string) => {
    onChange({
      ...category,
      children: category.children?.filter((c) => c.id !== childId),
    })
  }

  const handleAddChildToThis = () => {
    const newChild: Category = {
      id: generateId(),
      name: "New Category",
      color: category.color,
      budget: 0,
      children: [],
    }
    onChange({
      ...category,
      children: [...(category.children || []), newChild],
    })
    if (!expanded.has(category.id)) {
      onToggle(category.id)
    }
  }

  const handleNameChange = (name: string) => {
    onChange({ ...category, name })
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", category.id)
    onDragStart(category.id)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation()
    onDragEnd()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (
      dragState.draggedId &&
      dragState.draggedId !== category.id &&
      !isDescendantOf(allCategories, dragState.draggedId, category.id)
    ) {
      e.dataTransfer.dropEffect = "move"
      onDragOver(e, category.id)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragState.draggedId && dragState.draggedId !== category.id) {
      onDrop(category.id, dragState.dropPosition || "inside")
    }
  }

  const getDropIndicatorClass = () => {
    if (!isDragOver || !dragState.dropPosition) return ""
    switch (dragState.dropPosition) {
      case "inside":
        return "ring-2 ring-primary ring-inset bg-primary/5"
      case "before":
        return "border-t-2 border-primary"
      case "after":
        return "border-b-2 border-primary"
      default:
        return ""
    }
  }

  return (
    <div
      className={`rounded-lg ${isRoot ? "border p-3" : "py-2"} space-y-2 transition-all duration-150
        ${isDragging ? "opacity-50" : ""}
        ${getDropIndicatorClass()}
      `}
      style={{ marginLeft: isRoot ? 0 : 16 }}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-2">
        <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical className="w-4 h-4" />
        </div>

        <button
          type="button"
          onClick={() => onToggle(category.id)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className={`w-3 h-3 rounded-full ${category.color} shrink-0`} />

        <Input
          value={category.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="h-8 text-sm flex-1"
          placeholder="Category name"
        />

        <div className="relative w-24">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
          <Input
            type="number"
            min="0"
            step="10"
            value={category.budget || ""}
            onChange={(e) => handleBudgetChange(e.target.value)}
            className="pl-5 h-8 text-sm"
            placeholder="0"
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleAddChildToThis}
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          title="Add subcategory"
        >
          <Plus className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          title="Remove category"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {isExpanded && (
        <div className={`${isRoot ? "ml-4 pl-4 border-l-2 border-muted" : "pl-2 border-l border-muted/50"}`}>
          {hasChildren ? (
            category.children!.map((child) => (
              <CategoryEditor
                key={child.id}
                category={child}
                depth={depth + 1}
                expanded={expanded}
                onToggle={onToggle}
                onChange={(updated) => handleChildChange(child.id, updated)}
                onRemove={() => handleRemoveChild(child.id)}
                dragState={dragState}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                allCategories={allCategories}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground py-2">No subcategories. Click + to add one.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function BudgetPage() {
  const { categories, updateCategories, totalBudget } = useExpenseContext()
  const [localCategories, setLocalCategories] = useState<Category[]>([])
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [hasChanges, setHasChanges] = useState(false)
  const [dragState, setDragState] = useState<DragState>({
    draggedId: null,
    dragOverId: null,
    dropPosition: null,
  })

  useEffect(() => {
    setLocalCategories(JSON.parse(JSON.stringify(categories)))
    setExpanded(new Set(categories.map((c) => c.id)))
    setHasChanges(false)
  }, [categories])

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

  const handleCategoryChange = (id: string, updated: Category) => {
    setLocalCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
    setHasChanges(true)
  }

  const handleRemoveRootCategory = (id: string) => {
    setLocalCategories((prev) => prev.filter((c) => c.id !== id))
    setHasChanges(true)
  }

  const handleDragStart = (id: string) => {
    setDragState({ draggedId: id, dragOverId: null, dropPosition: null })
  }

  const handleDragEnd = () => {
    setDragState({ draggedId: null, dragOverId: null, dropPosition: null })
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const y = e.clientY - rect.top
    const height = rect.height

    let position: "before" | "inside" | "after" = "inside"
    if (y < height * 0.25) {
      position = "before"
    } else if (y > height * 0.75) {
      position = "after"
    }

    setDragState((prev) => ({
      ...prev,
      dragOverId: id,
      dropPosition: position,
    }))
  }

  const handleDragLeave = () => {
    setDragState((prev) => ({
      ...prev,
      dragOverId: null,
      dropPosition: null,
    }))
  }

  const handleDrop = (targetId: string, position: "inside" | "before" | "after") => {
    if (!dragState.draggedId || dragState.draggedId === targetId) return

    if (position === "inside") {
      setLocalCategories((prev) => moveCategoryById(prev, dragState.draggedId!, targetId))
    } else {
      setLocalCategories((prev) => moveCategoryById(prev, dragState.draggedId!, targetId))
    }

    setExpanded((prev) => new Set([...prev, targetId]))
    setHasChanges(true)
    handleDragEnd()
  }

  const handleAddRootCategory = () => {
    const colors = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"]
    const newCategory: Category = {
      id: generateId(),
      name: "New Category",
      color: colors[localCategories.length % colors.length],
      budget: 0,
      children: [],
    }
    setLocalCategories((prev) => [...prev, newCategory])
    setExpanded((prev) => new Set([...prev, newCategory.id]))
    setHasChanges(true)
  }

  const handleSave = () => {
    updateCategories(localCategories)
    setHasChanges(false)
  }

  const localTotalBudget = getTotalBudget(localCategories)

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <PageHeader
        title="Budget"
        description="Manage your spending categories and monthly limits"
        actions={
          <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        }
      />

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Categories</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Drag categories to reorganize them</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Monthly Budget</p>
              <p className="text-xl font-bold text-foreground">${localTotalBudget.toLocaleString()}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {localCategories.map((category) => (
            <CategoryEditor
              key={category.id}
              category={category}
              depth={0}
              expanded={expanded}
              onToggle={toggleExpanded}
              onChange={(updated) => handleCategoryChange(category.id, updated)}
              onRemove={() => handleRemoveRootCategory(category.id)}
              dragState={dragState}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              allCategories={localCategories}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed bg-transparent"
            onClick={handleAddRootCategory}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Category
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
