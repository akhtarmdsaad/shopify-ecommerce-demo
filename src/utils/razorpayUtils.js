import { toast } from 'react-toastify';

const verifyPayment = async (razorpay_payment_id, razorpay_order_id, razorpay_signature) => {
    // const { orderId, paymentId, signature } = req.body; in server.js
    console.log('[razorpayUtils] Verifying payment with:', { razorpay_order_id, razorpay_payment_id, razorpay_signature });
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    try {
        const response = await fetch(`${backendUrl}/verify-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
        }),
        });
    
        const data = await response.json();
        if (data.success) {
        console.log("Payment verified successfully:", data);
        toast.success("Payment verified successfully");
        } else {
        console.error("Payment verification failed:", data);
        toast.error("Payment verification failed");
        }
        return data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Error verifying payment");
    }
    }

const createOrder = async ({amount, currency}) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount, currency }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating order:", error);
        toast.error("Error creating order");
    }
}

export { createOrder, verifyPayment };