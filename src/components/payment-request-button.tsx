"use client";

import { useEffect, useState } from "react";
import { PaymentRequest, PaymentRequestPaymentMethodEvent } from "@stripe/stripe-js";
import { useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js";

interface PaymentRequestButtonProps {
  amount: number; // in cents
  currency?: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentRequestButton({
  amount,
  currency = "usd",
  onSuccess,
  onError,
}: PaymentRequestButtonProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }

    const pr = stripe.paymentRequest({
      country: "US",
      currency: currency,
      total: {
        label: "TradeSignal AI PRO Subscription",
        amount: amount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check if Apple Pay or Google Pay is available
    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on("paymentmethod", async (ev: PaymentRequestPaymentMethodEvent) => {
      try {
        // Create subscription with payment method
        const response = await fetch("/api/checkout/payment-request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethodId: ev.paymentMethod.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Payment failed");
        }

        const { clientSecret } = await response.json();

        // Confirm the payment
        const { error } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (error) {
          ev.complete("fail");
          onError(error.message || "Payment failed");
        } else {
          ev.complete("success");
          onSuccess();
        }
      } catch (error: any) {
        ev.complete("fail");
        onError(error.message || "Payment failed");
      }
    });
  }, [stripe, elements, amount, currency, onSuccess, onError]);

  if (!paymentRequest) {
    return null;
  }

  return (
    <PaymentRequestButtonElement
      options={{
        paymentRequest,
        style: {
          paymentRequestButton: {
            type: "subscribe",
            theme: "dark",
            height: "48px",
          },
        },
      }}
    />
  );
}
