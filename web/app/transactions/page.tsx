"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import { useExpenseContext } from "@/lib/expense-context";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { generateId } from "@/lib/category-utils";
import * as XLSX from "xlsx";
import { AddExpenseDialog } from "@/components/add-expense-dialog";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { EditExpenseDialog } from "@/components/edit-expense-dialog";

export default function TransactionPage() {
  const { categories, addExpense } = useExpenseContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  const editTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsDialogOpen(true);
  };

  const groupByDate = (exp: Transaction[]) => {
    const grouped: { [date: string]: Transaction[] } = {};
    exp.forEach((item) => {
      const date =
        new Date(item.date).getDate().toString() +
        "-" +
        (new Date(item.date).getMonth() + 1).toString() +
        "-" +
        new Date(item.date).getFullYear().toString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return Object.entries(grouped);
  };

  const fi = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "array" });
      const sheetName = workbook.SheetNames[1];
      const sheet = workbook.Sheets[sheetName];

      // Parse to JSON
      const data = XLSX.utils.sheet_to_json(sheet);
      /**
     * Amount
: 
"+2.00"
Date
: 
"21/12/2025"
Other Transaction Details (UPI ID or A/c No)
: 
"poweraccess.paytm3@axisbank"
Tags
: 
"#💰 Cashback"
Time
: 
"15:54:25"
Transaction Details
: 
"Cashback Received from One97 Communications Limited"
UPI Ref No.
: 
"501230863555"
Your Account
: 
"Jio Payments Bank - 97"
     */
      const transactionsFromFile: Transaction[] = data.map((item: any) => {

        const a = {
          id: item["UPI Ref No."] || generateId(),
          date: new Date(
            item["Date"].split("/").reverse().join("-") + "T" + item["Time"]
          ).toISOString(),
          time: item["Time"],
          account: item["Your Account"],
          details: item["Transaction Details"],
          amount: parseFloat(item["Amount"].replace("+", "").replace(",", "")),
          type: item["Amount"].startsWith("+") ? "deposit" : "withdraw" as "deposit" | "withdraw",
          note: `Other Transaction Details (UPI ID or A/c No): ${
            item["Other Transaction Details (UPI ID or A/c No)"]
          }, UPI Ref No.: ${item["UPI Ref No."] || ""}`,
          categoryPath: item["Tags"]
            ? [item["Tags"].replace(/[^\w\s]/g, "").trim()]
            : ["Uncategorized"],
        };
      if (a.type === "withdraw") {
        addExpense({ id: a.id, date: a.date, amount: Math.abs(a.amount), categoryPath: a.categoryPath, description: a.details, note: `${a.note} Your Account: ${a.account}` });
      }
        return a;
      });
      setLocalTransactions(transactionsFromFile);
      // console.log(data);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <PageHeader
        title="Transactions"
        description="Manage your transactions efficiently."
        actions={
          <>
          </>
        }
      />
      <Input type="file" onChange={fi} />
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Transactions
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1"></p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <DataTable columns={columns} data={localTransactions} setCurrentTransaction={editTransaction} />
        </CardContent>
      </Card>

      <EditExpenseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddExpense={addExpense}
        categories={categories}
        transaction={currentTransaction}
      />
    </div>
  );
}
