"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CheckoutButtonProps {
  priceId: string;
  tier: "FREE" | "PRO";
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function CheckoutButton({
  priceId,
  tier,
  className,
  size = "lg",
  variant = "default",
}: CheckoutButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=/pricing`);
      return;
    }

    if (tier === "FREE") {
      router.push("/auth/signup");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to create checkout session");
        setLoading(false);
        return;
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : tier === "FREE" ? (
        "Get Started Free"
      ) : (
        "Start PRO Trial"
      )}
    </Button>
  );
}
