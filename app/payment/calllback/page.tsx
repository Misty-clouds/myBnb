"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { updateCompanyPaymentStatus } from "@/helper-functions"

export default function PaymentCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "failure">("loading")
  const [message, setMessage] = useState("")
  const [paymentDetails, setPaymentDetails] = useState<{
    companyId?: string
    plan?: string
    amount?: number
    transactionRef?: string
  }>({})

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        // Get tap_id from URL
        const tapId = searchParams.get("tap_id")

        if (!tapId) {
          setStatus("failure")
          setMessage("Payment reference not found")
          return
        }

        // Get stored payment info
        const storedPayment = localStorage.getItem("pendingPayment")
        if (storedPayment) {
          const paymentInfo = JSON.parse(storedPayment)
          setPaymentDetails(paymentInfo)
        }

        // Get company ID from URL
        const companyId = searchParams.get("company_id")

        // Verify payment status with your backend
        const response = await fetch(`/api/payment/verify?tap_id=${tapId}`)
        const data = await response.json()

        if (response.ok && data.status === "CAPTURED") {
          setStatus("success")
          setMessage("Your payment was successful!")

          // Update company payment status if we have the company ID
          if (companyId) {
            await updateCompanyPaymentStatus(companyId, "paid", data.id)
          }

          // Clear the pending payment from localStorage
          localStorage.removeItem("pendingPayment")
        } else {
          setStatus("failure")
          setMessage(data.message || "Payment verification failed")

          // Update company payment status if we have the company ID
          if (companyId) {
            await updateCompanyPaymentStatus(companyId, "failed", data.id)
          }
        }
      } catch (error) {
        console.error("Error verifying payment:", error)
        setStatus("failure")
        setMessage("An error occurred while verifying your payment")
      }
    }

    fetchPaymentStatus()
  }, [searchParams])

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {status === "loading" && (
            <>
              <div className="animate-pulse rounded-full bg-primary/20 p-4">
                <AlertCircle className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Verifying Payment</h1>
              <p className="text-muted-foreground">Please wait while we verify your payment...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
              </div>
              <h1 className="text-2xl font-bold">Payment Successful!</h1>
              <p className="text-muted-foreground">{message}</p>

              {paymentDetails.plan && paymentDetails.amount && (
                <div className="bg-muted p-4 rounded-lg w-full mt-4">
                  <div className="flex justify-between py-2">
                    <span>Plan:</span>
                    <span className="font-medium capitalize">{paymentDetails.plan}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t">
                    <span>Amount:</span>
                    <span className="font-medium">${paymentDetails.amount}</span>
                  </div>
                  {paymentDetails.transactionRef && (
                    <div className="flex justify-between py-2 border-t">
                      <span>Transaction ID:</span>
                      <span className="font-medium text-xs">{paymentDetails.transactionRef}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {status === "failure" && (
            <>
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
                <XCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
              </div>
              <h1 className="text-2xl font-bold">Payment Failed</h1>
              <p className="text-muted-foreground">{message}</p>
            </>
          )}

          <Button
            onClick={() => router.push("/")}
            className="mt-6 w-full"
            variant={status === "success" ? "default" : "outline"}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}

