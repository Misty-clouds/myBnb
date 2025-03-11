"use client"

import type React from "react"

import type { ColumnDef } from "@tanstack/react-table"
import type { ExpensesDetails } from "@/types"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateExpensesDetails, deleteExpensesDetails } from "@/helper-functions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export const columns = (onSuccessfulAction: () => void): ColumnDef<ExpensesDetails>[] => [
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = Number.parseFloat(String(row.getValue("amount"))) || 0
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "SAR",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date")
      return date ? new Date(date as string).toLocaleDateString("en-US") : "N/A"
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return description || "No description"
    },
  },
  {
    accessorKey: "field",
    header: "Field",
  },
  {
    accessorKey: "created_by",
    header: "Created By",
  },
  {
    accessorKey: "receiptImage",
    header: "Receipt Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("receiptImage") as string
      return imageUrl ? (
        <img
          src={imageUrl || "/placeholder.svg?height=48&width=48"}
          alt="Receipt"
          className="w-12 h-12 object-cover rounded-md"
        />
      ) : (
        <span className="text-gray-400">No Image</span>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
      const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
      const expense = row.original

      // Exclude these keys from details view
      const excludedKeys = ["id", "receiptImage", "company_id"]

      const handleDelete = async () => {
        try {
          await deleteExpensesDetails(expense.id)
          setIsDeleteDialogOpen(false)
          onSuccessfulAction() // Refresh data
        } catch (error) {
          console.error("Failed to delete expense", error)
        }
      }

      const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const updatedExpense: Partial<ExpensesDetails> = {}

        // Convert form data to expense object
        formData.forEach((value, key) => {
          if (key === "amount") {
            updatedExpense[key as keyof ExpensesDetails] = Number.parseFloat(value as string) as any
          } else if (typeof value === "string") {
            updatedExpense[key as keyof ExpensesDetails] = value as any
          }
        })

        try {
          await updateExpensesDetails(expense.id, updatedExpense)
          setIsEditDialogOpen(false)
          onSuccessfulAction() // Refresh data
        } catch (error) {
          console.error("Failed to update expense", error)
        }
      }

      return (
        <>
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* View Details */}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setIsDetailsDialogOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>

              {/* Edit */}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setIsEditDialogOpen(true)
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>

              {/* Delete */}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setIsDeleteDialogOpen(true)
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Details Dialog */}
          <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Expense Details</DialogTitle>
                <DialogDescription>Detailed information about the expense</DialogDescription>
              </DialogHeader>
              <Card className="bg-muted/60 dark:bg-card">
                <CardContent className="space-y-4 pt-6">
                  {Object.entries(expense)
                    .filter(([key]) => !excludedKeys.includes(key))
                    .map(([key, value]) => {
                      // Special handling for receipt image
                      if (key === "receiptImage" && value) {
                        return (
                          <div key={key} className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right capitalize font-medium">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </label>
                            <img
                              src={(value as string) || "/placeholder.svg?height=96&width=96"}
                              alt="Receipt Thumbnail"
                              className="col-span-3 w-24 h-24 object-cover rounded-md"
                            />
                          </div>
                        )
                      }

                      // Handle dates
                      const displayValue =
                        key === "date" && value ? new Date(value as string).toLocaleDateString() : String(value)

                      return (
                        <div key={key} className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right capitalize font-medium">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </label>
                          <span className="col-span-3">{displayValue}</span>
                        </div>
                      )
                    })}
                </CardContent>
              </Card>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Expense</DialogTitle>
                <DialogDescription>Make changes to the expense details</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-6">
                <Card className="bg-muted/60 dark:bg-card">
                  <CardContent className="pt-6">
                    <div className="space-y-2 mb-4">
                      <label htmlFor="amount" className="text-sm font-medium">
                        Amount
                      </label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        defaultValue={expense.amount}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2 mb-4">
                      <label htmlFor="date" className="text-sm font-medium">
                        Date
                      </label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={expense.date ? new Date(expense.date).toISOString().split("T")[0] : ""}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2 mb-4">
                      <label htmlFor="description" className="text-sm font-medium">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={expense.description || ""}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2 mb-4">
                      <label htmlFor="field" className="text-sm font-medium">
                        Field
                      </label>
                      <Input id="field" name="field" defaultValue={expense.field || ""} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the expense.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete}>
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]

