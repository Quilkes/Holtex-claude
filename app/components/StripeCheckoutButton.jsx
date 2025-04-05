"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function StripeCheckoutButton({ priceId, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (data.error) {
        console.error("Checkout error:", data.error);
        return;
      }

      // Store any needed data before redirecting
      sessionStorage.setItem("selectedPlan", priceId);

      // Redirect directly to the URL provided by Stripe
      window.location.href = data.sessionUrl;
    } catch (err) {
      console.error("Checkout error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      disabled={loading}
    >
      {loading ? "Processing..." : "Buy Now"}
    </button>
  );
}
