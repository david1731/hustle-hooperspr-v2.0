'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Entrenamiento Individual',
          amount: 100, // amount in cents (e.g., $20.00)
        }),
      });

      const { id } = await response.json();
      const stripe = await stripePromise;

      await stripe?.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error('Error during checkout:', error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
    >
      {loading ? 'Processing...' : 'Checkout'}
    </button>
  );
}
