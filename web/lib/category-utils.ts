import type { Category, FlatCategory } from "./types"

// Flatten categories into a list with paths for selection dropdowns
export function flattenCategories(
  categories: Category[],
  parentPath: string[] = [],
  parentColor = "bg-chart-1",
): FlatCategory[] {
  const result: FlatCategory[] = []

  for (const cat of categories) {
    const currentPath = [...parentPath, cat.name]
    const color = cat.color || parentColor

    result.push({
      id: cat.id,
      name: cat.name,
      path: currentPath,
      depth: currentPath.length - 1,
      color,
      budget: cat.budget,
      hasChildren: (cat.children?.length ?? 0) > 0,
    })

    if (cat.children && cat.children.length > 0) {
      result.push(...flattenCategories(cat.children, currentPath, color))
    }
  }

  return result
}

// Get display string for a category path
export function getCategoryPathString(path: string[]): string {
  return path.join(" → ")
}

// Find a category by path in the tree
export function findCategoryByPath(categories: Category[], path: string[]): Category | null {
  if (path.length === 0) return null

  const [first, ...rest] = path
  const found = categories.find((c) => c.name === first)

  if (!found) return null
  if (rest.length === 0) return found
  if (!found.children) return null

  return findCategoryByPath(found.children, rest)
}

// Get color for a category path (uses root category color)
export function getCategoryColor(categories: Category[], path: string[]): string {
  if (path.length === 0) return "bg-chart-1"
  const rootCategory = categories.find((c) => c.name === path[0])
  return rootCategory?.color || "bg-chart-1"
}

// Calculate total budget for all categories including subcategories
export function getTotalBudget(categories: Category[]): number {
  let total = 0
  for (const cat of categories) {
    total += cat.budget
    if (cat.children && cat.children.length > 0) {
      total += getTotalBudget(cat.children)
    }
  }
  return total
}

// Add a child category at a specific path
export function addChildCategory(categories: Category[], parentPath: string[], newChild: Category): Category[] {
  if (parentPath.length === 0) {
    return [...categories, newChild]
  }

  return categories.map((cat) => {
    if (cat.name === parentPath[0]) {
      if (parentPath.length === 1) {
        return {
          ...cat,
          children: [...(cat.children || []), newChild],
        }
      }
      return {
        ...cat,
        children: addChildCategory(cat.children || [], parentPath.slice(1), newChild),
      }
    }
    return cat
  })
}

// Remove a category at a specific path
export function removeCategoryAtPath(categories: Category[], path: string[]): Category[] {
  if (path.length === 0) return categories

  if (path.length === 1) {
    return categories.filter((c) => c.name !== path[0])
  }

  return categories.map((cat) => {
    if (cat.name === path[0]) {
      return {
        ...cat,
        children: removeCategoryAtPath(cat.children || [], path.slice(1)),
      }
    }
    return cat
  })
}

// Update a category's budget at a specific path
export function updateCategoryBudget(categories: Category[], path: string[], newBudget: number): Category[] {
  if (path.length === 0) return categories

  return categories.map((cat) => {
    if (cat.name === path[0]) {
      if (path.length === 1) {
        return { ...cat, budget: newBudget }
      }
      return {
        ...cat,
        children: updateCategoryBudget(cat.children || [], path.slice(1), newBudget),
      }
    }
    return cat
  })
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

// Move a category from one parent to another
export function moveCategoryById(
  categories: Category[],
  draggedId: string,
  targetParentId: string | null, // null means move to root
): Category[] {
  // First, find and remove the dragged category
  let draggedCategory: Category | null = null

  const removeFromTree = (cats: Category[]): Category[] => {
    return cats
      .filter((cat) => {
        if (cat.id === draggedId) {
          draggedCategory = { ...cat }
          return false
        }
        return true
      })
      .map((cat) => ({
        ...cat,
        children: cat.children ? removeFromTree(cat.children) : [],
      }))
  }

  const result = removeFromTree(categories)

  if (!draggedCategory) return categories

  // If target is null, add to root level
  if (targetParentId === null) {
    return [...result, draggedCategory]
  }

  // Otherwise, find target parent and add as child
  const addToParent = (cats: Category[]): Category[] => {
    return cats.map((cat) => {
      if (cat.id === targetParentId) {
        return {
          ...cat,
          children: [...(cat.children || []), draggedCategory!],
        }
      }
      return {
        ...cat,
        children: cat.children ? addToParent(cat.children) : [],
      }
    })
  }

  return addToParent(result)
}

export function isDescendantOf(categories: Category[], potentialParentId: string, childId: string): boolean {
  const findInChildren = (cat: Category): boolean => {
    if (cat.id === childId) return true
    return cat.children?.some(findInChildren) ?? false
  }

  const parent = findCategoryById(categories, potentialParentId)
  return parent ? findInChildren(parent) : false
}

export function findCategoryById(categories: Category[], id: string): Category | null {
  for (const cat of categories) {
    if (cat.id === id) return cat
    if (cat.children) {
      const found = findCategoryById(cat.children, id)
      if (found) return found
    }
  }
  return null
}
