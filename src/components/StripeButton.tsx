'use client';
import React, { useEffect } from 'react';

const StripeBuyButton: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="mt-8">
      <stripe-buy-button
        buy-button-id="buy_btn_1Pq0xCHTRWgOnbrSAYpb1kTF"
        publishable-key="pk_live_51Pn1u0HTRWgOnbrSvRVw3S6wFIs770BPhcSgdAEdyEsJUoxtx7q4LxAbS8ca883RPA0pRDZHwsejMqO4IqJdk4KF00V76LfvRG"
      />
    </div>
  );
};

export default StripeBuyButton;

