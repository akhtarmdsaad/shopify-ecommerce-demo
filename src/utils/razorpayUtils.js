const verifyPayment = async (razorpay_payment_id, razorpay_order_id, razorpay_signature) => {
    // const { orderId, paymentId, signature } = req.body; in server.js
    console.log('[razorpayUtils] Verifying payment with:', { razorpay_order_id, razorpay_payment_id, razorpay_signature });
    try {
        const response = await fetch('http://localhost:4000/verify-payment', {
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
        } else {
        console.error("Payment verification failed:", data);
        }
        return data;
    } catch (error) {
        console.error("Error verifying payment:", error);
    }
    }

const createOrder = async ({amount, currency}) => {
    try {
        const response = await fetch('http://localhost:4000/create-order', {
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
    }
}

export { createOrder, verifyPayment };