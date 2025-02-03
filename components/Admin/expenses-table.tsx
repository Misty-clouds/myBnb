import { ExpensesItem } from "./expenses-item"

interface Expense {
  id:number;
  field: string
  description: string
  date: string
  amount: number
  receiptImage?: string
  action?:boolean
}

interface ExpensesTableProps {
  expenses: Expense[]
}

export function ExpensesTable({ expenses }: ExpensesTableProps) {
  return (
    <div className="space-y-4">
      <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-background rounded-lg font-medium text-muted-gray">
        <div className="col-span-2">Field/Description</div>
        <div className="text-center">Date</div>
        <div className="text-center">Amount</div>
        <div className="text-center">Receipt</div>
        <div className="text-right">Actions</div>
      </div>
      {expenses.map((expense, index) => (
        <ExpensesItem key={index} {...expense} />
      ))}
    </div>
  )
}

