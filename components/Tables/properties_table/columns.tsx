"use client"

import type React from "react"

import type { ColumnDef } from "@tanstack/react-table"
import type { PropertiesDetails } from "@/types"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updatePropertiesDetails, deletePropertiesDetails } from "@/helper-functions"
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
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export const columns = (onSuccessfulAction: () => void): ColumnDef<PropertiesDetails>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.getValue("location") as string
      return location || "No location specified"
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      if (!status) return <Badge variant="outline">Not Set</Badge>

      return (
        <Badge
          variant={
            status.toLowerCase() === "available"
              ? "default"
              : status.toLowerCase() === "occupied"
                ? "destructive"
                : status.toLowerCase() === "maintenance"
                  ? "secondary"
                  : "outline"
          }
          className="capitalize"
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    cell: ({ row }) => {
      const createdBy = row.getValue("created_by") as string
      return createdBy || "Unknown"
    },
  },
  {
    accessorKey: "created_at",
    header: "Created Date",
    cell: ({ row }) => {
      const date = row.getValue("created_at")
      return date ? new Date(date as string).toLocaleDateString("en-US") : "N/A"
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("image") as string
      return imageUrl ? (
        <img
          src={imageUrl || "/placeholder.svg?height=48&width=48"}
          alt="Property"
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
      const property = row.original

      // Exclude these keys from details view
      const excludedKeys = ["id", "image", "company_id"]

      const handleDelete = async () => {
        try {
          await deletePropertiesDetails(property.id)
          setIsDeleteDialogOpen(false)
          onSuccessfulAction() // Refresh data
        } catch (error) {
          console.error("Failed to delete property", error)
        }
      }

      const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const updatedProperty: Partial<PropertiesDetails> = {}

        // Convert form data to property object
        formData.forEach((value, key) => {
          if (value) {
            updatedProperty[key as keyof PropertiesDetails] = value as any
          }
        })

        try {
          await updatePropertiesDetails(property.id, updatedProperty)
          setIsEditDialogOpen(false)
          onSuccessfulAction() // Refresh data
        } catch (error) {
          console.error("Failed to update property", error)
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
                <DialogTitle>Property Details</DialogTitle>
                <DialogDescription>Detailed information about the property</DialogDescription>
              </DialogHeader>
              <Card className="bg-muted/60 dark:bg-card">
                <CardContent className="space-y-4 pt-6">
                  {Object.entries(property)
                    .filter(([key]) => !excludedKeys.includes(key))
                    .map(([key, value]) => {
                      // Special handling for property image
                      if (key === "image" && value) {
                        return (
                          <div key={key} className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right capitalize font-medium">{key}:</label>
                            <img
                              src={(value as string) || "/placeholder.svg?height=96&width=96"}
                              alt="Property Thumbnail"
                              className="col-span-3 w-24 h-24 object-cover rounded-md"
                            />
                          </div>
                        )
                      }

                      // Handle dates
                      const displayValue =
                        key === "created_at" && value
                          ? new Date(value as string).toLocaleDateString()
                          : String(value || "Not specified")

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
                <DialogTitle>Edit Property</DialogTitle>
                <DialogDescription>Make changes to the property details</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-6">
                <Card className="bg-muted/60 dark:bg-card">
                  <CardContent className="pt-6">
                    <div className="space-y-2 mb-4">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" name="name" defaultValue={property.name} className="w-full" required />
                    </div>

                    <div className="space-y-2 mb-4">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Input id="location" name="location" defaultValue={property.location || ""} className="w-full" />
                    </div>

                    <div className="space-y-2 mb-4">
                      <label htmlFor="status" className="text-sm font-medium">
                        Status
                      </label>
                      <Input id="status" name="status" defaultValue={property.status || ""} className="w-full" />
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
                  This action cannot be undone. This will permanently delete the property.
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

