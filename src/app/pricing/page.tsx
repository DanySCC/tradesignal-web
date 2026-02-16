import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Check, X } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
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
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/analyze">Analyze</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/daily-picks">Daily Picks</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* FREE Tier */}
          <Card className="p-8 border-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">FREE</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>5 chart analyses per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>AI-powered technical analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>LONG/SHORT recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Entry, stop loss, take profit levels</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">SMART engine (CoinGlass data)</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Daily picks feed</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Priority support</span>
              </li>
            </ul>

            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
          </Card>

          {/* PRO Tier */}
          <Card className="p-8 border-2 border-primary relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
              MOST POPULAR
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">PRO</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Unlimited chart analyses</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>AI-powered technical analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>LONG/SHORT recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Entry, stop loss, take profit levels</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">SMART engine with CoinGlass data</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Daily picks feed (3 signals/day)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Priority support</span>
              </li>
            </ul>

            <Button size="lg" className="w-full" asChild>
              <Link href="/auth/signup">Start PRO Trial</Link>
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Cancel anytime. No long-term contracts.
            </p>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">What's included in the FREE tier?</h3>
              <p className="text-muted-foreground">
                You get 5 chart analyses per month with AI-powered technical analysis, including LONG/SHORT recommendations and price levels.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">What is the SMART engine?</h3>
              <p className="text-muted-foreground">
                The SMART engine uses real-time CoinGlass liquidation data, funding rates, and long/short ratios to validate or override technical analysis. It helps you avoid liquidation zones and trade with the smart money.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-muted-foreground">
                Yes! Upgrade to PRO anytime. Downgrade at the end of your billing cycle. No penalties, no questions asked.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                We offer a 7-day money-back guarantee. If you're not satisfied within the first week, we'll refund your payment in full.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and cryptocurrency payments (BTC, ETH, USDT).
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2026 TradeSignal AI. Not financial advice. Trade at your own risk.</p>
        </div>
      </footer>
    </div>
  );
}
