import { type NextRequest, NextResponse } from "next/server"

const TAP_API_URL = "https://api.tap.company/v2/charges/"
const TAP_SECRET_KEY = "sk_test_XKokBfNWv6FIYuTMg5sLPjhJ" // Better to use environment variable

export async function GET(req: NextRequest) {
  try {
    // Get the tap_id from the URL query parameters
    const url = new URL(req.url)
    const tapId = url.searchParams.get("tap_id")

    if (!tapId) {
      return NextResponse.json({ error: "Missing tap_id parameter" }, { status: 400 })
    }

    // Fetch the charge details from Tap API
    const response = await fetch(`${TAP_API_URL}${tapId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TAP_SECRET_KEY}`,
        Accept: "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Payment verification failed")
    }

    console.log("Tap API Verification Response:", data)

    // Return the payment status and details
    return NextResponse.json({
      id: data.id,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      customer: data.customer,
      source: data.source,
      reference: data.reference,
    })
  } catch (error) {
    console.error("Payment Verification Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment verification failed" },
      { status: 500 },
    )
  }
}

