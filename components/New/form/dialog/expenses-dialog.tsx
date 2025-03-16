"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Check, AlertCircle, Image } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadFile, getOptimizedImageUrl } from "../uploadFile"
import type { ExpensesDetails } from "@/types"
import { insertExpensesDetails } from "@/helper-functions"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useUserContext } from "@/contexts/UserProvider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ExpensesDialogProps {
  company_id: string
  onExpenseAdded?: () => void
}

export function ExpensesDialog({ company_id, onExpenseAdded }: ExpensesDialogProps) {
  const {userEmail,userId}=useUserContext()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [amount, setAmount] = useState<number>(0)
  const [description, setDescription] = useState("")
  const [field, setField] = useState("")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<{
    status: "idle" | "uploading" | "success" | "error"
    message: string
  }>({ status: "idle", message: "" })


  const { toast } = useToast()

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
    setAmount(0)
    setDescription("")
    setField("")
    setReceiptFile(null)
    setReceiptPreview(null)
    setUploadStatus({ status: "idle", message: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!amount || !field) {
      toast({
        title: "Error",
        description: "Please enter an amount and select a category",
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
          message: "Uploading receipt image...",
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

      // Prepare expense details
      const expenseDetails: Partial<ExpensesDetails> = {
        amount,
        company_uid:company_id,
        created_by: String(userEmail),
        description,
        receiptImage: String(receiptImageUrl),
        field,
      }

      // Submit expense details
      await insertExpensesDetails(expenseDetails)

      toast({
        title: "Success",
        description: "Expense details have been saved successfully",
      })

      resetForm()
      setOpen(false)

      // Notify parent component that an expense was added
      if (onExpenseAdded) {
        onExpenseAdded()
      }

      // Dispatch a custom event to refresh the table
      const event = new CustomEvent("expense-added", {
        detail: { timestamp: new Date().getTime() },
      })
      document.dispatchEvent(event)
    } catch (error) {
      console.error("Error submitting expense:", error)
      toast({
        title: "Error",
        description: "Failed to save expense details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/30 sm:w-32 md:w-48">Add Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Expense</DialogTitle>
        </DialogHeader>

        <Card className="bg-muted/60 dark:bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Field/Category */}
              <div className="space-y-2">
                <Label htmlFor="field">Category</Label>
                <Select onValueChange={setField} value={field} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="supplies">Supplies</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="salaries">Salaries</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter expense description"
                rows={3}
              />
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
                <Alert variant={uploadStatus.status === "error" ? "destructive" : "default"} className="mt-2">
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
                {isSubmitting ? "Saving..." : "Save Expense"}
              </Button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

