"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TrendingUp, TrendingDown, Lock, Loader2, Calendar, Eye } from "lucide-react";
import Link from "next/link";

interface Pick {
  id: string;
  symbol: string;
  timeframe: string;
  direction: string;
  confidence: number;
  technicalAnalysis: string;
  coinglassData: string;
  timestamp: string;
}

export default function DailyPicksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/daily-picks");
      return;
    }

    if (status === "authenticated") {
      fetchPicks();
    }
  }, [status, router]);

  const fetchPicks = async () => {
    try {
      const response = await fetch("/api/daily-picks");
      
      if (response.status === 403) {
        const data = await response.json();
        setError(data.error);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch picks");
      }

      const data = await response.json();
      setPicks(data.picks || []);
      setDate(data.date || "");
      setViewCount(data.viewCount || 0);
      setIsToday(data.isToday || false);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to load daily picks");
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // PRO upgrade required
  if (error && error.includes("PRO")) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TradeSignal AI</span>
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto border-2 border-primary/20">
            <CardContent className="p-8 text-center">
              <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">PRO Feature</h2>
              <p className="text-muted-foreground mb-6">
                Daily Picks is a PRO-only feature. Upgrade to get 3-5 curated trading signals every day.
              </p>
              <div className="space-y-3 text-sm mb-6">
                <p>✅ 3-5 curated signals daily</p>
                <p>✅ AI + CoinGlass validation</p>
                <p>✅ Best risk/reward setups</p>
                <p>✅ Multiple timeframes</p>
              </div>
              <Button size="lg" className="w-full" asChild>
                <Link href="/upgrade">Upgrade to PRO - $79/month</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
              <Link href="/calculator">Calculator</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/track-record">Track Record</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">📅 Daily Trading Signals</h1>
                <p className="text-muted-foreground">
                  Curated setups analyzed by AI + CoinGlass market data
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(date).toLocaleDateString()}</span>
                </div>
                {isToday && (
                  <span className="inline-block px-3 py-1 bg-green-500/10 text-green-500 text-xs font-semibold rounded-full">
                    TODAY
                  </span>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Eye className="h-3 w-3" />
                  <span>{viewCount} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signals */}
          {picks.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No signals available yet</h3>
                <p className="text-muted-foreground">
                  Our AI is analyzing the markets. Check back soon for today's picks!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {picks.map((pick, index) => (
                <Card key={pick.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{pick.symbol}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {pick.timeframe} timeframe
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                          pick.direction === "LONG"
                            ? "bg-green-500/10 text-green-500"
                            : pick.direction === "SHORT"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}>
                          {pick.direction === "LONG" ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span className="font-bold">{pick.direction}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Confidence: {pick.confidence}%
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">📊 Technical Analysis</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pick.technicalAnalysis}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🔍 CoinGlass Data</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pick.coinglassData}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Footer Note */}
          <Card className="mt-8 bg-muted/50">
            <CardContent className="p-6">
              <p className="text-sm text-center text-muted-foreground">
                ⚠️ <strong>Not financial advice.</strong> These signals are generated by AI analysis and should be used as one factor in your trading decisions. Always do your own research and manage risk carefully.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
