import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/payment/';

const createRazorpayOrder = async (amount, name) => {
  const response = await fetch(API_URL + 'create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, amount }),
  });
  if (!response.ok) throw new Error('Failed to create Razorpay order');
  return await response.json();
};

const verifyPayment = async (paymentData) => {
  const response = await fetch(API_URL + 'verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Verification failed');
  return result.message;
};

const PaymentServices = () => {
  const location = useLocation();
  const amountFromState = location.state?.amount || 1000;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    if (!name.trim() || !email.trim() || !contact.trim()) {
      setError('Please enter name, email, and contact number.');
      setLoading(false);
      return;
    }

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Failed to load Razorpay SDK.');

      const orderData = await createRazorpayOrder(amountFromState, name);

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Donation',
        description: `Donation of ₹${amountFromState}`,
        image: 'https://cdn.razorpay.com/logos/RxT_square.png',
        order_id: orderData.orderId,
        theme: { color: '#3399CC' },
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              name,
              email,
              contact,
              amount: amountFromState,
            });

            setMessage('🎉 ' + verifyRes);
            setName('');
            setEmail('');
            setContact('');
          } catch (err) {
            console.error('Verification error:', err);
            setError(err.message || 'Error verifying payment.');
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setError(response.error.description || 'Payment failed.');
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">Pay Now</h1>
        <p className="text-md italic text-gray-600 mb-6">
          Make a difference with every rupee — your support counts.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Donate securely ₹{amountFromState.toFixed(2)}
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <input
          type="tel"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Enter your contact number"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>

        {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
        {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
      </div>
    </div>
  );
};

export default PaymentServices;
