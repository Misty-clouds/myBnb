
'use client'
import { useState } from 'react';

export default function PaymentTestPage() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<any>(null);
    const [amount,setAmount]=useState<number>(0);
    const [currency,setCurrency]=useState<string>("SAR");
    const [receiptEmail,setReceiptEmail]=useState<string>(""); 
    const [customerName,setCustomerName]=useState<string>("");
    const merchantId="1234";//change this later
    const websiteUrl="http://localhost:3000";
    const post_url=websiteUrl+"/api/payment/create-charge";
    const redirect_url=websiteUrl+"/payment/success";
    const description = "My Bnb app payment"
    const [customerPhone,setCustomerPhone]=useState({
        country_code:965 ,
        number:0
    })
    const paymentData = {
        amount: amount,
        currency: currency,
        customer_initiated: true,
        threeDSecure: true,
        save_card: false,
        description: description,
        metadata: {
            udf1: "Metadata 1"
        },
        receipt: {
            email: false,
            sms: false
        },
        reference: {
            transaction: "txn_01",
            order: "ord_01"
        },
        customer: {
            first_name: customerName,
            middle_name: "",
            last_name: "",
            email: receiptEmail,
            phone: {
                country_code: customerPhone.country_code,
                number: customerPhone.number
            }
        },
        merchant: {
            id: merchantId
        },
        source: {
            id: "src_all"
        },
        post: {
            url:post_url
        },
        redirect: {
            url: redirect_url
        }
    };

    const createCharge = async () => {
        try {
            setLoading(true);
            setError(null);
            setResponse(null);

            const res = await fetch('/api/payment/create-charge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Payment request failed');
            }

            setResponse(data);
            console.log('Payment successful:', data);

            // If there's a redirect URL in the response, redirect the user
            if (data.transaction?.url) {
                window.location.href = data.transaction.url;
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to process payment';
            setError(errorMessage);
            console.error('Payment error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            {error && (
                <div className="text-red-500 mb-4 p-2 border border-red-300 rounded">
                    {error}
                </div>
            )}
            
            <button
                onClick={createCharge}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {loading ? 'Processing...' : 'Create Payment'}
            </button>

            {response && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h3 className="font-bold mb-2">Payment Response:</h3>
                    <pre className="whitespace-pre-wrap">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}