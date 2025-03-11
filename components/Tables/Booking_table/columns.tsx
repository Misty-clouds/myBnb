"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BookingDetails } from "@/types";
import { MoreHorizontal, Edit, Trash2, Eye, User, Building2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateBookingDetails, deleteBookingDetails } from "@/helper-functions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Table columns with improved actions
export const columns = (
  onSuccessfulAction: () => void
): ColumnDef<BookingDetails>[] => [
    {
        accessorKey: "customerName",
        header: "Customer Name",
      },
      {
        accessorKey: "dailyAmount",
        header: "Daily Amount",
        cell: ({ row }) => {
          const dailyAmount = parseFloat(row.getValue("dailyAmount")) || 0;
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "SAR",
          }).format(dailyAmount);
    
          return <div className="text-right font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: "numberOfDays",
        header: "Number of Days",
        cell: ({ row }) => <div className="text-center">{row.getValue("numberOfDays")}</div>,
      },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
        cell: ({ row }) => {
          const totalAmount = parseFloat(row.getValue("totalAmount")) || 0;
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "SAR",
          }).format(totalAmount);
    
          return <div className="text-right font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: "bookingMethod",
        header: "Booking Method",
      },
      {
        accessorKey: "receiptImage",
        header: "Receipt Image",
        cell: ({ row }) => {
          const imageUrl = row.getValue("receiptImage") as string;
          return imageUrl ? (
            <img src={imageUrl} alt="Receipt" className="w-12 h-12 object-cover rounded-md" />
          ) : (
            <span className="text-gray-400">No Image</span>
          );
        },
      },
      {
        accessorKey: "date",
        header: "Created Date",
        cell: ({ row }) => {
          const date = row.getValue("date");
          return date ? new Date(date as string).toLocaleDateString("en-US") : "N/A";
        },
      },
      {
        accessorKey: "propertyName",
        header: "Property Name",
      },
      {
        accessorKey: "created_by",
        header: "Created By",
      },
      {
        accessorKey: "entryDate",
        header: "Entry Date",
        cell: ({ row }) => {
          const date = row.getValue("entryDate");
          return date ? new Date(date as string).toLocaleDateString("en-US") : "N/A";
        },
      },
      {
        accessorKey: "exitDate",
        header: "Exit Date",
        cell: ({ row }) => {
          const date = row.getValue("exitDate");
          return date ? new Date(date as string).toLocaleDateString("en-US") : "N/A";
        },
      },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
      const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
      const booking = row.original;

      // Exclude these keys from details view
      const excludedKeys = ['id', 'receiptImage'];

      const handleDelete = async () => {
        try {
          await deleteBookingDetails(String(booking.id));
          setIsDeleteDialogOpen(false);
          onSuccessfulAction(); // Refresh data
        } catch (error) {
          console.error("Failed to delete booking", error);
        }
      };

      const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const updatedBooking: Partial<BookingDetails> = {};
        

        try {
          await updateBookingDetails(String(booking.id), updatedBooking);
          setIsEditDialogOpen(false);
          onSuccessfulAction(); // Refresh data
        } catch (error) {
          console.error("Failed to update booking", error);
        }
      };

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
                  e.preventDefault();
                  setIsDetailsDialogOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              
              {/* Edit */}
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              
              {/* Delete */}
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  setIsDeleteDialogOpen(true);
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
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                  Detailed information about the booking
                </DialogDescription>
              </DialogHeader>
              <Card className="bg-muted/60 dark:bg-card">
                <CardContent className="space-y-4 pt-6">
                  {Object.entries(booking)
                    .filter(([key]) => !excludedKeys.includes(key))
                    .map(([key, value]) => {
                      // Special handling for receipt image
                      if (key === 'receiptImage' && value) {
                        return (
                          <div key={key} className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right capitalize font-medium">{key}:</label>
                            <img 
                              src={value as string} 
                              alt="Receipt Thumbnail" 
                              className="col-span-3 w-24 h-24 object-cover rounded-md"
                            />
                          </div>
                        );
                      }


                      // Handle dates
                      const displayValue = value instanceof Date 
                        ? value.toLocaleDateString() 
                        : String(value);

                      return (
                        <div key={key} className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right capitalize font-medium">{key}:</label>
                          <span className="col-span-3">{displayValue}</span>
                        </div>
                      );
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
                <DialogTitle>Edit Booking</DialogTitle>
                <DialogDescription>
                  Make changes to the booking details
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-6">
                <Card className="bg-muted/60 dark:bg-card">
                  <CardContent className="pt-6">
                    {Object.entries(booking)
                      .filter(([key]) => key !== 'id' && key !== 'receiptImage')
                      .map(([key, value]) => (
                        <div key={key} className="space-y-2 mb-4">
                          <label htmlFor={key} className="text-sm font-medium capitalize">
                            {key}
                          </label>
                          <Input
                            id={key}
                            name={key}
                            defaultValue={String(value)}
                            className="w-full"
                          />
                        </div>
                      ))}
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
                  This action cannot be undone. This will permanently delete the booking.
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
      );
    },
  },
];

