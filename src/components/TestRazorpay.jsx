import React from 'react';
import { toast } from 'react-toastify';

import { createOrder, verifyPayment } from '../utils/razorpayUtils.js';

const TestRazorpay = () => {
  const TEST_AMOUNT = 50000; // Amount in paise (50000 paise = 500 INR)
  const TEST_CURRENCY = 'INR';
  const [razorpayData, setRazorpayData] = React.useState(null);
  const [razorpayPaymentVerified, setRazorpayPaymentVerified] = React.useState(false);

  const handlePayment = async () => {
    try {
      // Use the createOrder utility function
      const data = await createOrder({ amount: TEST_AMOUNT, currency: TEST_CURRENCY });

      if (data.id) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: 'Test Payment',
          order_id: data.id,
          handler: function (response) {
            // alert("Payment Successful!");
            toast.success("Payment Successful!");
            // console.log("Payment ID:", response.razorpay_payment_id);
            // console.log("Order ID:", response.razorpay_order_id);
            // console.log("Signature:", response.razorpay_signature);

            setRazorpayData({
              id: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: data.amount,
              currency: data.currency,
              status: "Success",
              receipt: data.receipt,
              notes: data.notes,
              signature: response.razorpay_signature
            });
          },
          prefill: {
            name: "Saad Demo",
            email: "test@example.com",
            contact: "9000090000",
          },
          notes: {
            address: "Demo Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        razorpay.on('payment.failed', function (response) {
          toast.error("Payment Failed!");
          // console.log("Error Code:", response.error.code);
          // console.log("Error Description:", response.error.description);
          // console.log("Error Source:", response.error.source);
          // console.log("Error Step:", response.error.step);
          // console.log("Error Reason:", response.error.reason);
          // console.log("Error Metadata:", response.error.metadata);
        });
        setRazorpayData(data);
      } else {
        // alert('Failed to create order');
        toast.error('Failed to create order');
        console.error('Failed to create order:', data);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('An error occurred while creating the order.');
      // alert('An error occurred while creating the order.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Test Razorpay Payment</h1>
      <button
        onClick={handlePayment}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={razorpayData !== null}
        style={{ cursor: razorpayData ? 'not-allowed' : 'pointer', opacity: razorpayData ? 0.5 : 1 }}
      >
        Pay {TEST_AMOUNT / 100} {TEST_CURRENCY}
      </button>
      {razorpayData && (
        <div className="mt-4 p-4 border rounded bg-black-100">
          <h2 className="text-lg font-semibold">Payment Success</h2>
          {razorpayData && (
            Object.entries(razorpayData).map(([key, value]) => (
              <p key={key} className="text-sm">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
              </p>
            ))
          )}
          <div
            className="flex flex-col items-center justify-center mt-4"
            style={{ cursor: 'pointer', opacity: 1 }}
          >
            <button
              onClick={() => {
                setRazorpayData(null)
                setRazorpayPaymentVerified(false);
                toast.info("Payment data reset.");
              }}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
            <button 
              onClick={async () => {
                if (!razorpayData) {
                  console.error("No payment data available to verify.");
                  return;
                }
                const paymentId = razorpayData.id;
                const orderId = razorpayData.orderId;
                const signature = razorpayData.signature;
                console.log("[TestRazorpay] Verifying payment with:", { paymentId, orderId, signature });
                const data = await verifyPayment(paymentId, orderId, signature);
                if (data.success) {
                  // alert("Payment verified successfully!");
                  toast.success("Payment verified successfully!");
                  setRazorpayPaymentVerified(true);
                } else {
                  // alert("Payment verification failed!");
                  toast.error("Payment verification failed!");
                  setRazorpayPaymentVerified(false);
                }
              }
              }
              disabled={razorpayPaymentVerified}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify Razorpay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestRazorpay