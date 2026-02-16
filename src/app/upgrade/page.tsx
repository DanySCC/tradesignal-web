"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/checkout-button";
import { CryptoCheckoutButton } from "@/components/crypto-checkout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TrendingUp, Check, CreditCard, Bitcoin, Smartphone } from "lucide-react";
import Link from "next/link";

const STRIPE_PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "";

export default function UpgradePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin?callbackUrl=/upgrade");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TradeSignal AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/analyze">Analyze</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/pricing">Pricing</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Upgrade Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Upgrade to PRO
            </h1>
            <p className="text-xl text-muted-foreground">
              Unlock unlimited analyses and premium features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PRO Benefits */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-2xl">What You Get</CardTitle>
                  <CardDescription>PRO membership includes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Unlimited Chart Analyses</p>
                        <p className="text-sm text-muted-foreground">No limits. Analyze as much as you want.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">SMART Engine</p>
                        <p className="text-sm text-muted-foreground">CoinGlass liquidation data + funding rates</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Daily Picks Feed</p>
                        <p className="text-sm text-muted-foreground">3 curated signals every day</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Priority Support</p>
                        <p className="text-sm text-muted-foreground">Get help when you need it</p>
                      </div>
                    </li>
                  </ul>

                  <div className="mt-8 p-4 bg-muted rounded-lg">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold">$79</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cancel anytime. 7-day money-back guarantee.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-2xl">Choose Payment Method</CardTitle>
                  <CardDescription>Select how you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stripe Payment (Cards + Apple/Google Pay) */}
                  <Card className="p-4 border-2 hover:border-primary transition-colors">
                    <div className="flex items-start gap-3 mb-4">
                      <CreditCard className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Credit/Debit Card</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Pay with Visa, Mastercard, Amex, or Discover
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Smartphone className="h-4 w-4" />
                          <span>Apple Pay & Google Pay supported</span>
                        </div>
                      </div>
                    </div>
                    <CheckoutButton priceId={STRIPE_PRO_PRICE_ID} />
                  </Card>

                  {/* Crypto Payment */}
                  <Card className="p-4 border-2 hover:border-primary transition-colors">
                    <div className="flex items-start gap-3 mb-4">
                      <Bitcoin className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Cryptocurrency</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Pay with BTC, ETH, USDT, or 150+ other coins
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Lower fees (0.5% vs 2.9%)</span>
                        </div>
                      </div>
                    </div>
                    <CryptoCheckoutButton priceId={STRIPE_PRO_PRICE_ID} />
                  </Card>

                  {/* Security Notice */}
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                      🔒 Secure payment processing via Stripe & NOWPayments
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Common Questions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Cancel anytime from your dashboard. No questions asked.
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-sm text-muted-foreground">
                  We offer a 7-day money-back guarantee on all PRO subscriptions.
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Is my payment secure?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. We use industry-standard payment processors (Stripe & NOWPayments).
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Which crypto do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  BTC, ETH, USDT (ERC20/TRC20), LTC, TRX, BNB, SOL, and 150+ more.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
