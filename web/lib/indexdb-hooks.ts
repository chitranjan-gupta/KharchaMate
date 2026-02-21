import { useCallback } from "react"
import {
  clearAllData,
  loadExpenses,
  loadCategories,
  loadIncome,
  loadTransactions,
  saveExpenses,
  saveCategories,
  saveIncome,
  saveTransactions,
} from "./indexdb-store"

export interface DBSnapshot {
  expenses: any[]
  categories: any[]
  income: any[]
  transactions: any[]
}

/**
 * Hook for managing IndexDB operations
 * Provides methods to export, import, and clear data
 */
export function useIndexDBManagement() {
  /**
   * Export all data from IndexDB
   */
  const exportData = useCallback(async (): Promise<DBSnapshot> => {
    try {
      const [expenses, categories, income, transactions] = await Promise.all([
        loadExpenses(),
        loadCategories(),
        loadIncome(),
        loadTransactions(),
      ])

      return {
        expenses,
        categories,
        income,
        transactions,
      }
    } catch (error) {
      console.error("Error exporting data:", error)
      throw error
    }
  }, [])

  /**
   * Import data to IndexDB
   */
  const importData = useCallback(async (snapshot: DBSnapshot): Promise<void> => {
    try {
      await Promise.all([
        saveExpenses(snapshot.expenses),
        saveCategories(snapshot.categories),
        saveIncome(snapshot.income),
        saveTransactions(snapshot.transactions),
      ])
      console.log("Data imported successfully")
    } catch (error) {
      console.error("Error importing data:", error)
      throw error
    }
  }, [])

  /**
   * Clear all data from IndexDB
   */
  const clearDatabase = useCallback(async (): Promise<void> => {
    try {
      await clearAllData()
      console.log("Database cleared successfully")
    } catch (error) {
      console.error("Error clearing database:", error)
      throw error
    }
  }, [])

  /**
   * Export data as JSON file
   */
  const downloadDataAsJSON = useCallback(async (): Promise<void> => {
    try {
      const snapshot = await exportData()
      const dataStr = JSON.stringify(snapshot, null, 2)
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

      const exportFileDefaultName = `kharchamate-backup-${new Date().toISOString().split("T")[0]}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    } catch (error) {
      console.error("Error downloading data:", error)
      throw error
    }
  }, [exportData])

  /**
   * Import data from JSON file
   */
  const uploadDataFromJSON = useCallback(
    (file: File): Promise<void> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = async (event) => {
          try {
            const content = event.target?.result as string
            const snapshot = JSON.parse(content) as DBSnapshot
            await importData(snapshot)
            resolve()
          } catch (error) {
            console.error("Error uploading data:", error)
            reject(error)
          }
        }

        reader.onerror = () => {
          reject(new Error("Failed to read file"))
        }

        reader.readAsText(file)
      })
    },
    [importData]
  )

  return {
    exportData,
    importData,
    clearDatabase,
    downloadDataAsJSON,
    uploadDataFromJSON,
  }
}
