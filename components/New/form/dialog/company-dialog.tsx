"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Check, AlertCircle, Image, Building, Users, CreditCard, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadFile } from "../uploadFile"
import { updateCompanyPaymentStatus } from "@/helper-functions"
import type { CompanyDetails } from "@/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser, insertCompanyDetails } from "@/helper-functions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

interface CompanyDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onCompanyAdded?: (newCompany?: any) => void

}

// Plan pricing
const PLAN_PRICES = {
  basic: 30,
  premium: 50,
  enterprise: 100,
}

export function CompanyDialog({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onCompanyAdded,
}: CompanyDialogProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [managersEmail, setManagersEmail] = useState("")
  const [plan, setPlan] = useState("basic")
  const [companyLogo, setCompanyLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<{
    status: "idle" | "uploading" | "success" | "error"
    message: string
  }>({ status: "idle", message: "" })

  // Customer information for payment
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("965") // Default Kuwait

  // Use external open state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = externalOnOpenChange || setInternalOpen

  const user = useUser()
  const userId = user?.id
  const userEmail = user?.email

  const { toast } = useToast()

  // Handle logo image preview
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setCompanyLogo(file)
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Reset upload status when a new file is selected
      setUploadStatus({ status: "idle", message: "" })
    }
  }

  const resetForm = () => {
    setName("")
    setManagersEmail("")
    setPlan("basic")
    setCompanyLogo(null)
    setLogoPreview(null)
    setUploadStatus({ status: "idle", message: "" })
    setFirstName("")
    setLastName("")
    setPhoneNumber("")
    setCountryCode("965")
  }

  // Process payment with Tap API
  const processPayment = async (companyDetails: Partial<CompanyDetails>) => {
    try {
      // Generate a unique transaction reference
      const transactionRef = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
      const orderRef = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

      // Create payment payload
      const paymentData = {
        amount: PLAN_PRICES[plan as keyof typeof PLAN_PRICES],
        currency: "USD",
        customer_initiated: true,
        threeDSecure: true,
        save_card: false,
        description: `Subscription for ${plan} plan - ${name}`,
        metadata: {
          company_id: companyDetails.id, // If available after creation
          plan: plan,
          user_id: userId,
        },
        receipt: {
          email: true,
          sms: false,
        },
        reference: {
          transaction: transactionRef,
          order: orderRef,
        },
        customer: {
          first_name: firstName,
          last_name: lastName,
          email: userEmail,
          phone: {
            country_code: Number.parseInt(countryCode),
            number: Number.parseInt(phoneNumber),
          },
        },
        source: {
          id: "src_all",
        },
        redirect: {
          url: `${window.location.origin}/payment/callback?company_id=${companyDetails.id || ""}`,
        },
      }

      // Call our API route
      const response = await fetch("/api/payment/create-charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Payment processing failed")
      }

      // Store payment info in localStorage for retrieval after redirect
      localStorage.setItem(
        "pendingPayment",
        JSON.stringify({
          companyId: companyDetails.id,
          plan: plan,
          amount: PLAN_PRICES[plan as keyof typeof PLAN_PRICES],
          transactionRef,
        }),
      )

      // Redirect to Tap payment page
      if (data.transaction && data.transaction.url) {
        window.location.href = data.transaction.url
        return true
      } else {
        throw new Error("No payment URL received")
      }
    } catch (error) {
      console.error("Payment processing error:", error)
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      })
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      })
      return
    }

    if (!userEmail) {
      toast({
        title: "Error",
        description: "User email is required. Please log in again.",
        variant: "destructive",
      })
      return
    }

    // Validate payment information
    if (!firstName || !lastName || !phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all payment information fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let logoUrl = null

      // Upload company logo to Cloudinary if provided
      if (companyLogo) {
        setUploadStatus({
          status: "uploading",
          message: "Uploading company logo...",
        })

        try {
          // Upload to Cloudinary
          logoUrl = await uploadFile(companyLogo, String(userId))

          setUploadStatus({
            status: "success",
            message: "Company logo uploaded successfully!",
          })
        } catch (error) {
          console.error("Error uploading file:", error)
          setUploadStatus({
            status: "error",
            message: "Failed to upload company logo. Please try again.",
          })

          toast({
            title: "Upload Error",
            description: "Failed to upload company logo. Please try again.",
            variant: "destructive",
          })

          setIsSubmitting(false)
          return
        }
      }

      // Parse managers emails into an array
      const managersEmailArray = managersEmail
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0)

      // Prepare company details with only the fields you need
      const companyDetails: Partial<CompanyDetails> = {
        name,
        admin_email: userEmail,
        managers_email: managersEmailArray,
        isSubscribed: true,
        plan,
        logo: logoUrl || "",
        payment_status: "pending", // Add payment status
      }

      // First save the company details
      const savedCompany = await insertCompanyDetails(companyDetails)

      // Now process the payment
      const paymentSuccess = await processPayment({
        ...companyDetails,
        id: savedCompany?.id, // Include the company ID if available
      })

      if (!paymentSuccess) {
        // If payment failed but company was created, you might want to update its status
        // or handle this case appropriately
        toast({
          title: "Warning",
          description: "Company created but payment processing failed",
          variant: "destructive",
        })

        resetForm()
        setOpen(false)

        // Still notify parent that company was added, but payment is pending
        if (onCompanyAdded) {
          onCompanyAdded()
        }
      }

      // Note: We don't close the dialog or reset the form here because
      // the user will be redirected to the payment page
    } catch (error) {
      console.error("Error submitting company:", error)
      toast({
        title: "Error",
        description: "Failed to save company details. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Only render the trigger if we're not controlling the dialog externally */}
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/30 sm:w-32 md:w-48">Add Company</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Company</DialogTitle>
        </DialogHeader>

        <Card className="bg-muted/60 dark:bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Company Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter company name"
                    className="pl-9"
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Managers Email */}
              <div className="space-y-2">
                <Label htmlFor="managersEmail">Managers Email (comma separated)</Label>
                <div className="relative">
                  <Input
                    id="managersEmail"
                    value={managersEmail}
                    onChange={(e) => setManagersEmail(e.target.value)}
                    placeholder="manager1@example.com, manager2@example.com"
                    className="pl-9"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Separate multiple emails with commas</p>
              </div>

              {/* Subscription Plan */}
              <div className="space-y-2">
                <Label htmlFor="plan">Subscription Plan</Label>
                <Select onValueChange={setPlan} value={plan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic - $30/month</SelectItem>
                    <SelectItem value="premium">Premium - $50/month</SelectItem>
                    <SelectItem value="enterprise">Enterprise - $100/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Company Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="companyLogo">Company Logo</Label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input id="companyLogo" type="file" accept="image/*" onChange={handleLogoChange} className="w-full" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Image className="h-4 w-4" />
                  </div>
                </div>
                {logoPreview && (
                  <div className="relative w-16 h-16 rounded overflow-hidden border">
                    <img
                      src={logoPreview || "/placeholder.svg?height=64&width=64"}
                      alt="Company logo preview"
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

              <p className="text-xs text-muted-foreground mt-1">Upload a company logo (JPEG, PNG). Max size: 5MB.</p>
            </div>

            {/* Payment Information Section */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="flex gap-2">
                    <div className="w-20">
                      <div className="flex items-center">
                        <span className="mr-1">+</span>
                        <Input
                          id="countryCode"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          placeholder="965"
                          required
                        />
                      </div>
                    </div>
                    <div className="relative flex-1">
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="51234567"
                        className="pl-9"
                        required
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="bg-muted/50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Information</AlertTitle>
                <AlertDescription>
                  You will be redirected to a secure payment page to complete your subscription payment of $
                  {PLAN_PRICES[plan as keyof typeof PLAN_PRICES]} for the {plan} plan.
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Continue to Payment"}
              </Button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

