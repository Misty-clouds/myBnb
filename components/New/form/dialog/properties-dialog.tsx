"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Check, AlertCircle, Image, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadFile,getOptimizedImageUrl } from "../uploadFile"
import type { PropertiesDetails } from "@/types"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/helper-functions"
import { insertPropertiesDetails } from "@/helper-functions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PropertiesDialogProps {
  company_id: string
  onPropertyAdded?: () => void
}

export function PropertiesDialog({ company_id, onPropertyAdded }: PropertiesDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("active")
  const [propertyImage, setPropertyImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<{
    status: "idle" | "uploading" | "success" | "error"
    message: string
  }>({ status: "idle", message: "" })

  const user = useUser()
  const userId = user?.id
  const userEmail = user?.email

  const { toast } = useToast()

  // Handle property image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setPropertyImage(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Reset upload status when a new file is selected
      setUploadStatus({ status: "idle", message: "" })
    }
  }

  const resetForm = () => {
    setName("")
    setLocation("")
    setStatus("active")
    setPropertyImage(null)
    setImagePreview(null)
    setUploadStatus({ status: "idle", message: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a property name",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let imageUrl = null

      // Upload property image to Cloudinary if provided
      if (propertyImage) {
        setUploadStatus({
          status: "uploading",
          message: "Uploading property image to Cloudinary...",
        })

        try {
          // Upload to Cloudinary
          imageUrl = await uploadFile(propertyImage, String(userId))

          // Get an optimized thumbnail URL for display
          const thumbnailUrl = getOptimizedImageUrl(imageUrl, 200, 200)

          setUploadStatus({
            status: "success",
            message: "Property image uploaded successfully to Cloudinary!",
          })
        } catch (error) {
          console.error("Error uploading file to Cloudinary:", error)
          setUploadStatus({
            status: "error",
            message: "Failed to upload property image to Cloudinary. Please try again.",
          })

          // Show toast for upload error
          toast({
            title: "Upload Error",
            description: "Failed to upload property image to Cloudinary. Please try again.",
            variant: "destructive",
          })

          setIsSubmitting(false)
          return
        }
      }

      // Prepare property details
      const propertyDetails: Partial<PropertiesDetails> = {
        name,
        location,
        status,
        image: imageUrl,
        company_uid:company_id,
        created_by: String(userEmail),
      }

      await insertPropertiesDetails(propertyDetails)

      toast({
        title: "Success",
        description: "Property details have been saved successfully",
      })

      resetForm()
      setOpen(false)

      // Notify parent component that a property was added
      if (onPropertyAdded) {
        onPropertyAdded()
      }

      // Dispatch a custom event to refresh the table
      const event = new CustomEvent("property-added", {
        detail: { timestamp: new Date().getTime() },
      })
      document.dispatchEvent(event)
    } catch (error) {
      console.error("Error submitting property:", error)
      toast({
        title: "Error",
        description: "Failed to save property details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/30 sm:w-32 md:w-48">Add Property</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Property</DialogTitle>
        </DialogHeader>

        <Card className="bg-muted/60 dark:bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Property Name */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter property name"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter property location"
                    className="pl-9"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={setStatus} value={status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                    <SelectItem value="renovation">Under Renovation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Property Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="propertyImage">Property Image</Label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    id="propertyImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Image className="h-4 w-4" />
                  </div>
                </div>
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded overflow-hidden border">
                    <img
                      src={imagePreview || "/placeholder.svg?height=64&width=64"}
                      alt="Property preview"
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

              <p className="text-xs text-muted-foreground mt-1">Upload a property image (JPEG, PNG). Max size: 5MB.</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Property"}
              </Button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

