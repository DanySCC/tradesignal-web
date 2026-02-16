"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingUp } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timeout = setTimeout(() => {
      router.push("/analyze");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">TradeSignal AI</h1>
        </div>

        <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>

        <p className="text-muted-foreground mb-6">
          Welcome to PRO! Your account has been upgraded and you now have unlimited access to all features.
        </p>

        <div className="space-y-3 text-sm text-muted-foreground mb-8">
          <p>✅ Unlimited chart analyses</p>
          <p>✅ Daily picks feed (3 signals/day)</p>
          <p>✅ SMART engine with CoinGlass data</p>
          <p>✅ Priority support</p>
        </div>

        <div className="space-y-3">
          <Button size="lg" className="w-full" asChild>
            <Link href="/analyze">Start Analyzing Charts</Link>
          </Button>

          <Button size="lg" variant="outline" className="w-full" asChild>
            <Link href="/daily-picks">View Daily Picks</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Redirecting to analyzer in 5 seconds...
        </p>
      </Card>
    </div>
  );
}
