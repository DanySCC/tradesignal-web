import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Shield, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              AI-Powered Trading Signals
            </h1>
            <p className="text-base md:text-xl text-muted-foreground px-4">
              Upload any chart. Get instant LONG/SHORT recommendations backed by CoinGlass liquidation data.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button size="lg" className="text-base md:text-lg w-full sm:w-auto" asChild>
              <Link href="/analyze">Analyze Chart Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base md:text-lg w-full sm:w-auto" asChild>
              <Link href="/daily-picks">View Daily Picks</Link>
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-16">
            <Card className="p-5 md:p-6 space-y-3 md:space-y-4 text-center">
              <Zap className="h-8 md:h-10 w-8 md:w-10 text-primary mx-auto" />
              <h3 className="text-base md:text-lg font-semibold">Instant Analysis</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Upload chart, get AI analysis in 3 seconds. LONG, SHORT, or NEUTRAL with confidence score.
              </p>
            </Card>
            
            <Card className="p-5 md:p-6 space-y-3 md:space-y-4 text-center">
              <Shield className="h-8 md:h-10 w-8 md:w-10 text-primary mx-auto" />
              <h3 className="text-base md:text-lg font-semibold">SMART Engine</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                CoinGlass liquidation data validates technical analysis. Overrides when market data conflicts.
              </p>
            </Card>
            
            <Link href="/track-record" className="block">
              <Card className="p-5 md:p-6 space-y-3 md:space-y-4 text-center hover:border-primary transition-colors cursor-pointer">
                <BarChart3 className="h-8 md:h-10 w-8 md:w-10 text-primary mx-auto" />
                <h3 className="text-base md:text-lg font-semibold">Track Record</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  100% transparent. All signals shown publicly. See our real win rate, not marketing fluff.
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12 md:mt-20">
        <div className="container mx-auto px-4 py-6 md:py-8 text-center text-xs md:text-sm text-muted-foreground">
          <p>© 2026 TradeSignal AI. Not financial advice. Trade at your own risk.</p>
        </div>
      </footer>
    </div>
  );
}
