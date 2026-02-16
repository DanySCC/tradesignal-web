"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, X, Bitcoin } from "lucide-react";

export function CryptoCheckoutButton({
  className,
  size = "lg",
}: {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);

  useEffect(() => {
    if (showSelector && currencies.length === 0) {
      fetchCurrencies();
    }
  }, [showSelector]);

  const fetchCurrencies = async () => {
    setLoadingCurrencies(true);
    try {
      const response = await fetch("/api/crypto-checkout");
      if (response.ok) {
        const data = await response.json();
        setCurrencies(data.currencies);
      }
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
    } finally {
      setLoadingCurrencies(false);
    }
  };

  const handleCryptoPayment = async (crypto: string) => {
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=/pricing`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/crypto-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cryptocurrency: crypto }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to create crypto payment");
        setLoading(false);
        return;
      }

      const { invoiceUrl } = await response.json();
      
      if (invoiceUrl) {
        window.location.href = invoiceUrl;
      }
    } catch (error) {
      console.error("Crypto checkout error:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (!showSelector) {
    return (
      <Button
        size={size}
        className={className}
        variant="outline"
        onClick={() => setShowSelector(true)}
        disabled={loading}
      >
        <Bitcoin className="mr-2 h-4 w-4" />
        Pay with Crypto (150+ coins)
      </Button>
    );
  }

  return (
    <Card className="p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Select Cryptocurrency</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSelector(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {loadingCurrencies ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {currencies.map((crypto) => (
            <Button
              key={crypto}
              variant="outline"
              className="uppercase"
              onClick={() => handleCryptoPayment(crypto)}
              disabled={loading}
            >
              {crypto}
            </Button>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-4">
        Powered by NOWPayments • 0.5% fee • Your crypto, your wallet
      </p>
    </Card>
  );
}
