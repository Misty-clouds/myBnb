import { NextRequest, NextResponse } from 'next/server';

const TAP_API_URL = 'https://api.tap.company/v2/charges/';
const TAP_SECRET_KEY = 'sk_test_XKokBfNWv6FIYuTMg5sLPjhJ'; // Better to use environment variable

export async function POST(req: NextRequest) {
  try {
    const paymentData = await req.json();
    console.log('Received payment data:', paymentData);

    const response = await fetch(TAP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TAP_SECRET_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Payment request failed');
    }

    console.log('Tap API Response:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment processing failed' },
      { status: 500 }
    );
  }
}