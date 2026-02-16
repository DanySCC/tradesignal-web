import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TradeSignal AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/analyze">Features</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              AI-Powered Trading Signals
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload any chart. Get instant LONG/SHORT recommendations backed by CoinGlass liquidation data.
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/analyze">Analyze Chart Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/daily-picks">View Daily Picks</Link>
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 space-y-4">
              <Zap className="h-10 w-10 text-primary" />
              <h3 className="text-lg font-semibold">Instant Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Upload chart, get AI analysis in 3 seconds. LONG, SHORT, or NEUTRAL with confidence score.
              </p>
            </Card>
            
            <Card className="p-6 space-y-4">
              <Shield className="h-10 w-10 text-primary" />
              <h3 className="text-lg font-semibold">SMART Engine</h3>
              <p className="text-sm text-muted-foreground">
                CoinGlass liquidation data validates technical analysis. Overrides when market data conflicts.
              </p>
            </Card>
            
            <Card className="p-6 space-y-4" asChild>
              <Link href="/track-record">
                <TrendingUp className="h-10 w-10 text-primary" />
                <h3 className="text-lg font-semibold">Track Record</h3>
                <p className="text-sm text-muted-foreground">
                  100% transparent. All signals shown publicly. See our real win rate, not marketing fluff.
                </p>
              </Link>
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
