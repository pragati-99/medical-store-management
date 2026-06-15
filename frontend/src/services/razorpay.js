// services/razorpay.js
const API_URL = 'http://localhost:8080/api';

export const initiateRazorpayPayment = async (userId, amount, onSuccess, onFailure) => {
    try {
        console.log('Initiating payment for userId:', userId, 'amount:', amount);
        
        // Create order on backend
        const response = await fetch(`${API_URL}/payment/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount })
        });
        
        const data = await response.json();
        console.log('Create order response:', data);
        
        if (!data.success) {
            onFailure(data.message || 'Failed to create order');
            return;
        }
        
        // Check if Razorpay is loaded
        if (!window.Razorpay) {
            onFailure('Razorpay SDK not loaded. Please check your internet connection.');
            return;
        }
        
        // Razorpay options
        const options = {
            key: data.razorpayKeyId,
            amount: data.amount * 100, // Convert to paise
            currency: "INR",
            name: "HealthMart",
            description: "Medical Store Purchase",
            order_id: data.orderId,
            handler: async function(response) {
                console.log('Payment success response:', response);
                // Verify payment on backend
                const verifyResponse = await fetch(`${API_URL}/payment/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    })
                });
                
                const verifyData = await verifyResponse.json();
                console.log('Verify response:', verifyData);
                
                if (verifyData.success) {
                    onSuccess(response);
                } else {
                    onFailure(verifyData.message || 'Payment verification failed');
                }
            },
            prefill: {
                name: "Customer Name",
                email: "customer@example.com",
                contact: "9999999999"
            },
            theme: {
                color: "#4CAF50"
            },
            modal: {
                ondismiss: function() {
                    onFailure('Payment cancelled by user');
                }
            }
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        
    } catch (error) {
        console.error('Payment initiation failed:', error);
        onFailure(error.message);
    }
};