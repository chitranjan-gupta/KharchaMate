import type { Expense, Category, Income, Transaction } from "./types"

const DB_NAME = "KharchaMateDB"
const DB_VERSION = 1
const EXPENSES_STORE = "expenses"
const CATEGORIES_STORE = "categories"
const INCOME_STORE = "income"
const TRANSACTIONS_STORE = "transactions"

let dbInstance: IDBDatabase | null = null

/**
 * Initialize IndexDB database
 */
export function initializeDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error("Database failed to open:", request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      dbInstance = request.result
      console.log("Database opened successfully")
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create Expenses store
      if (!db.objectStoreNames.contains(EXPENSES_STORE)) {
        db.createObjectStore(EXPENSES_STORE, { keyPath: "id" })
      }

      // Create Categories store
      if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
        db.createObjectStore(CATEGORIES_STORE, { keyPath: "id" })
      }

      // Create Income store
      if (!db.objectStoreNames.contains(INCOME_STORE)) {
        db.createObjectStore(INCOME_STORE, { keyPath: "id" })
      }

      // Create Transactions store
      if (!db.objectStoreNames.contains(TRANSACTIONS_STORE)) {
        db.createObjectStore(TRANSACTIONS_STORE, { keyPath: "id" })
      }
    }
  })
}

/**
 * Save all expenses to IndexDB
 */
export function saveExpenses(expenses: Expense[]): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initializeDB()
      const transaction = db.transaction([EXPENSES_STORE], "readwrite")
      const store = transaction.objectStore(EXPENSES_STORE)

      // Clear existing expenses
      store.clear()

      // Add new expenses
      expenses.forEach((expense) => {
        store.add(expense)
      })

      transaction.oncomplete = () => {
        console.log("Expenses saved to IndexDB")
        resolve()
      }

      transaction.onerror = () => {
        console.error("Error saving expenses:", transaction.error)
        reject(transaction.error)
      }
    } catch (error) {
      console.error("Error in saveExpenses:", error)
      reject(error)
    }
  })
}

/**
 * Load all expenses from IndexDB
 */
export function loadExpenses(): Promise<Expense[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initializeDB()
      const transaction = db.transaction([EXPENSES_STORE], "readonly")
      const store = transaction.objectStore(EXPENSES_STORE)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        console.error("Error loading expenses:", request.error)
        reject(request.error)
      }
    } catch (error) {
      console.error("Error in loadExpenses:", error)
      reject(error)
    }
  })
}

/**
 * Add or update a single expense
 */
export function upsertExpense(expense: Expense): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initializeDB()
      const transaction = db.transaction([EXPENSES_STORE], "readwrite")
      const store = transaction.objectStore(EXPENSES_STORE)

      // First try to delete if exists
      try {
        store.delete(expense.id)
      } catch (e) {
        // Ignore if delete fails
      }

      store.add(expense)

      transaction.oncomplete = () => {
        resolve()
      }

      transaction.onerror = () => {
        reject(transaction.error)
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Delete an expense
 */
export function deleteExpenseFromDB(id: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initializeDB()
      const transaction = db.transaction([EXPENSES_STORE], "readwrite")
      const store = transaction.objectStore(EXPENSES_STORE)
      const request = store.delete(id)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Save all categories to IndexDB
 */
export function saveCategories(categories: Category[]): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initializeDB()
      const transaction = db.transaction([CATEGORIES_STORE], "readwrite")
      const store = transaction.objectStore(CATEGORIES_STORE)

      store.clear()

      categories.forEach((category) => {
        store.add(category)
      })

      transaction.oncomplete = () => {
        console.log("Categories saved to IndexDB")
        resolve()
      }

      transaction.onerror = () => {
        console.error("Error saving categories:", transaction.error)
        reject(transaction.error)
      }
    } catch (error) {
      console.error("Error in saveCategories:", error)
      reject(error)
    }
  })
}

/**
 * Load all categories from IndexDB
 */
export function loadCategories(): Promise<Category[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initializeDB()
      const transaction = db.transaction([CATEGORIES_STORE], "readonly")
      const store = transaction.objectStore(CATEGORIES_STORE)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        console.error("Error loading categories:", request.error)
        reject(request.error)
      }
    } catch (error) {
      console.error("Error in loadCategories:", error)
      reject(error)
    }
  })
}

/**
 * Save all income to IndexDB
 */
export function saveIncome(incomeList: Income[]): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initializeDB()
      const transaction = db.transaction([INCOME_STORE], "readwrite")
      const store = transaction.objectStore(INCOME_STORE)

      store.clear()

      incomeList.forEach((income) => {
        store.add(income)
      })

      transaction.oncomplete = () => {
        console.log("Income saved to IndexDB")
        resolve()
      }

      transaction.onerror = () => {
        console.error("Error saving income:", transaction.error)
        reject(transaction.error)
      }
    } catch (error) {
      console.error("Error in saveIncome:", error)
      reject(error)
    }
  })
}

/**
 * Load all income from IndexDB
 */
export function loadIncome(): Promise<Income[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initializeDB()
      const transaction = db.transaction([INCOME_STORE], "readonly")
      const store = transaction.objectStore(INCOME_STORE)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        console.error("Error loading income:", request.error)
        reject(request.error)
      }
    } catch (error) {
      console.error("Error in loadIncome:", error)
      reject(error)
    }
  })
}

/**
 * Save all transactions to IndexDB
 */
export function saveTransactions(transactions: Transaction[]): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initializeDB()
      const transaction = db.transaction([TRANSACTIONS_STORE], "readwrite")
      const store = transaction.objectStore(TRANSACTIONS_STORE)

      store.clear()

      transactions.forEach((txn) => {
        store.add(txn)
      })

      transaction.oncomplete = () => {
        console.log("Transactions saved to IndexDB")
        resolve()
      }

      transaction.onerror = () => {
        console.error("Error saving transactions:", transaction.error)
        reject(transaction.error)
      }
    } catch (error) {
      console.error("Error in saveTransactions:", error)
      reject(error)
    }
  })
}

/**
 * Load all transactions from IndexDB
 */
export function loadTransactions(): Promise<Transaction[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initializeDB()
      const transaction = db.transaction([TRANSACTIONS_STORE], "readonly")
      const store = transaction.objectStore(TRANSACTIONS_STORE)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        console.error("Error loading transactions:", request.error)
        reject(request.error)
      }
    } catch (error) {
      console.error("Error in loadTransactions:", error)
      reject(error)
    }
  })
}

/**
 * Clear all data from IndexDB
 */
export function clearAllData(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initializeDB()
      const transaction = db.transaction(
        [EXPENSES_STORE, CATEGORIES_STORE, INCOME_STORE, TRANSACTIONS_STORE],
        "readwrite"
      )

      transaction.objectStore(EXPENSES_STORE).clear()
      transaction.objectStore(CATEGORIES_STORE).clear()
      transaction.objectStore(INCOME_STORE).clear()
      transaction.objectStore(TRANSACTIONS_STORE).clear()

      transaction.oncomplete = () => {
        console.log("All data cleared from IndexDB")
        resolve()
      }

      transaction.onerror = () => {
        reject(transaction.error)
      }
    } catch (error) {
      reject(error)
    }
  })
}
