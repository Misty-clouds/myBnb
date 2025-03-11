"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, Upload, Check, AlertCircle, Image } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { uploadFile, getOptimizedImageUrl } from "./uploadFile"
import { insertBookingDetails } from "@/helper-functions"
import type { BookingDetails } from "@/types"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/helper-functions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BookingDialogProps {
  company_id: string
  onBookingAdded?: () => void
}

export function BookingDialog({ company_id, onBookingAdded }: BookingDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [entryDate, setEntryDate] = useState<Date | undefined>()
  const [exitDate, setExitDate] = useState<Date | undefined>()
  const [customerName, setCustomerName] = useState("")
  const [dailyAmount, setDailyAmount] = useState<number>(0)
  const [propertyId, setPropertyId] = useState<number | null>(null)
  const [propertyName, setPropertyName] = useState("")
  const [bookingMethod, setBookingMethod] = useState("")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [numberOfDays, setNumberOfDays] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<{
    status: "idle" | "uploading" | "success" | "error"
    message: string
  }>({ status: "idle", message: "" })

  const user = useUser()
  const userId = user.id
  const userEmail = user?.email

  const { toast } = useToast()

  // Calculate number of days when dates change
  useEffect(() => {
    if (entryDate && exitDate) {
      const days = differenceInDays(exitDate, entryDate)
      setNumberOfDays(days > 0 ? days : 0)
    } else {
      setNumberOfDays(0)
    }
  }, [entryDate, exitDate])

  // Calculate total amount when daily amount or number of days change
  useEffect(() => {
    setTotalAmount(dailyAmount * numberOfDays)
  }, [dailyAmount, numberOfDays])

  // Handle receipt image preview
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      setReceiptFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setReceiptPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Reset upload status when a new file is selected
      setUploadStatus({ status: "idle", message: "" })
    }
  }

  const resetForm = () => {
    setEntryDate(undefined)
    setExitDate(undefined)
    setCustomerName("")
    setDailyAmount(0)
    setPropertyId(null)
    setPropertyName("")
    setBookingMethod("")
    setReceiptFile(null)
    setReceiptPreview(null)
    setNumberOfDays(0)
    setTotalAmount(0)
    setUploadStatus({ status: "idle", message: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!entryDate || !exitDate) {
      toast({
        title: "Error",
        description: "Please select both entry and exit dates",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let receiptImageUrl = null

      // Upload receipt image to Cloudinary if provided
      if (receiptFile) {
        setUploadStatus({
          status: "uploading",
          message: "Uploading receipt image to Cloudinary...",
        })

        try {
          // Upload to Cloudinary
          receiptImageUrl = await uploadFile(receiptFile, String(userId))

          // Get an optimized thumbnail URL for display
          const thumbnailUrl = getOptimizedImageUrl(receiptImageUrl, 200, 200)

          setUploadStatus({
            status: "success",
            message: "Receipt image uploaded successfully to Cloudinary!",
          })
        } catch (error) {
          console.error("Error uploading file to Cloudinary:", error)
          setUploadStatus({
            status: "error",
            message: "Failed to upload receipt image to Cloudinary. Please try again.",
          })

          // Show toast for upload error
          toast({
            title: "Upload Error",
            description: "Failed to upload receipt image to Cloudinary. Please try again.",
            variant: "destructive",
          })

          setIsSubmitting(false)
          return
        }
      }

      // Prepare booking details
      const bookingDetails: Partial<BookingDetails> = {
        entryDate: entryDate.toISOString().split("T")[0],
        exitDate: exitDate.toISOString().split("T")[0],
        propertyId,
        customerName,
        dailyAmount,
        numberOfDays,
        totalAmount,
        bookingMethod,
        receiptImage: receiptImageUrl,
        created_at: new Date().toISOString().split("T")[0],
        propertyName,
        company_uid: company_id,
        created_by: String(userEmail),
      }

      // Submit booking details
      await insertBookingDetails(bookingDetails)

      toast({
        title: "Success",
        description: "Booking details have been saved successfully",
      })

      resetForm()
      setOpen(false)

      // Notify parent component that a booking was added
      if (onBookingAdded) {
        onBookingAdded()
      }

      // Dispatch a custom event to refresh the table
      const event = new CustomEvent("booking-added", {
        detail: { timestamp: new Date().getTime() },
      })
      document.dispatchEvent(event)
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast({
        title: "Error",
        description: "Failed to save booking details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/30 sm:w-32 md:w-48">Add Booking</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Booking</DialogTitle>
        </DialogHeader>

        <Card className="bg-muted/60 dark:bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Entry Date */}
              <div className="space-y-2">
                <Label htmlFor="entryDate">Entry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {entryDate ? format(entryDate, "PPP") : <span>Select entry date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0" sideOffset={4}>
                    <div className="p-1">
                      <CalendarComponent
                        mode="single"
                        selected={entryDate}
                        onSelect={setEntryDate}
                        initialFocus
                        className="rounded border shadow"
                        classNames={{
                          day_selected: "bg-primary text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground",
                          day_outside: "text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          day_hidden: "invisible",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "text-sm font-medium",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
                          day_range_end: "aria-selected:bg-primary aria-selected:text-primary-foreground",
                          day_range_start: "aria-selected:bg-primary aria-selected:text-primary-foreground",
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Exit Date */}
              <div className="space-y-2">
                <Label htmlFor="exitDate">Exit Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {exitDate ? format(exitDate, "PPP") : <span>Select exit date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0" sideOffset={4}>
                    <div className="p-1">
                      <CalendarComponent
                        mode="single"
                        selected={exitDate}
                        onSelect={setExitDate}
                        initialFocus
                        disabled={(date: Date) => (entryDate ? date < entryDate : false)}
                        className="rounded border shadow"
                        classNames={{
                          day_selected: "bg-primary text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground",
                          day_outside: "text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          day_hidden: "invisible",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "text-sm font-medium",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
                          day_range_end: "aria-selected:bg-primary aria-selected:text-primary-foreground",
                          day_range_start: "aria-selected:bg-primary aria-selected:text-primary-foreground",
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
              </div>

              {/* Property Name */}
              <div className="space-y-2">
                <Label htmlFor="propertyName">Property Name</Label>
                <Input
                  id="propertyName"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="Enter property name"
                  required
                />
              </div>

              {/* Daily Amount */}
              <div className="space-y-2">
                <Label htmlFor="dailyAmount">Daily Amount</Label>
                <Input
                  id="dailyAmount"
                  type="number"
                  value={dailyAmount || ""}
                  onChange={(e) => setDailyAmount(Number(e.target.value))}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Number of Days (Calculated) */}
              <div className="space-y-2">
                <Label htmlFor="numberOfDays">Number of Days</Label>
                <Input id="numberOfDays" value={numberOfDays} readOnly className="bg-muted" />
              </div>

              {/* Total Amount (Calculated) */}
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input id="totalAmount" value={totalAmount.toFixed(2)} readOnly className="bg-muted" />
              </div>

              {/* Booking Method */}
              <div className="space-y-2">
                <Label htmlFor="bookingMethod">Booking Method</Label>
                <Select onValueChange={setBookingMethod} value={bookingMethod} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select booking method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="in-person">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Receipt Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="receiptImage">Receipt Image</Label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    id="receiptImage"
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptChange}
                    className="w-full"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Image className="h-4 w-4" />
                  </div>
                </div>
                {receiptPreview && (
                  <div className="relative w-16 h-16 rounded overflow-hidden border">
                    <img
                      src={receiptPreview || "/placeholder.svg?height=64&width=64"}
                      alt="Receipt preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>

              {/* Upload Status Message */}
              {uploadStatus.status !== "idle" && (
                <Alert
                  variant={
                    uploadStatus.status === "error"
                      ? "destructive"
                      : "default"
                  }
                  className="mt-2"
                >
                  {uploadStatus.status === "success" && <Check className="h-4 w-4" />}
                  {uploadStatus.status === "error" && <AlertCircle className="h-4 w-4" />}
                  {uploadStatus.status === "uploading" && <Upload className="h-4 w-4 animate-pulse" />}
                  <AlertTitle>
                    {uploadStatus.status === "success"
                      ? "Upload Successful"
                      : uploadStatus.status === "error"
                        ? "Upload Failed"
                        : "Uploading..."}
                  </AlertTitle>
                  <AlertDescription>{uploadStatus.message}</AlertDescription>
                </Alert>
              )}

              <p className="text-xs text-muted-foreground mt-1">Upload a receipt image (JPEG, PNG). Max size: 5MB.</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Booking"}
              </Button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

