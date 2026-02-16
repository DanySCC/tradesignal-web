"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Lock, ArrowUp, ArrowDown, Minus } from "lucide-react";

interface DailyPick {
  id: string;
  symbol: string;
  timeframe: string;
  recommendation: "LONG" | "SHORT" | "NEUTRAL";
  confidence: number;
  entry: string;
  stopLoss: string;
  takeProfit: string;
  reasoning: string;
  timestamp: string;
}

export default function DailyPicksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [picks, setPicks] = useState<DailyPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/daily-picks");
      return;
    }

    if (status === "authenticated") {
      fetchDailyPicks();
    }
  }, [status, router]);

  const fetchDailyPicks = async () => {
    try {
      const response = await fetch("/api/daily-picks");
      
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 403) {
          setError("Daily picks are only available for PRO users. Upgrade to unlock!");
        } else {
          setError(error.error || "Failed to load daily picks");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setPicks(data.picks || []);
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (rec: string) => {
    if (rec === "LONG") return "text-green-500 bg-green-500/10 border-green-500";
    if (rec === "SHORT") return "text-red-500 bg-red-500/10 border-red-500";
    return "text-yellow-500 bg-yellow-500/10 border-yellow-500";
  };

  const getRecommendationIcon = (rec: string) => {
    if (rec === "LONG") return <ArrowUp className="h-5 w-5" />;
    if (rec === "SHORT") return <ArrowDown className="h-5 w-5" />;
    return <Minus className="h-5 w-5" />;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading daily picks...</p>
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
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/analyze">Analyze</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/pricing">Pricing</Link>
            </Button>
            {session ? (
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              📊 Daily Picks
            </h1>
            <p className="text-lg text-muted-foreground">
              3 curated trading signals every day, powered by AI + SMART engine
            </p>
          </div>

          {error && (
            <Card className="p-8 mb-8 border-2 border-yellow-500/50 bg-yellow-500/5">
              <div className="flex items-start gap-4">
                <Lock className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">PRO Feature</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button asChild>
                    <Link href="/pricing">Upgrade to PRO</Link>
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {!error && picks.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No daily picks available yet. Check back later!
              </p>
            </Card>
          )}

          {!error && picks.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {picks.length} signals available today
                </p>
                <p className="text-sm text-muted-foreground">
                  Updated: {new Date(picks[0].timestamp).toLocaleDateString()}
                </p>
              </div>

              {picks.map((pick) => (
                <Card key={pick.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${getRecommendationColor(pick.recommendation)}`}>
                        {getRecommendationIcon(pick.recommendation)}
                        <span className="font-bold">{pick.recommendation}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{pick.symbol}</h3>
                        <p className="text-sm text-muted-foreground">{pick.timeframe}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="text-2xl font-bold">{pick.confidence}%</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Entry</p>
                      <p className="font-mono font-semibold">{pick.entry}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Stop Loss</p>
                      <p className="font-mono font-semibold">{pick.stopLoss}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Take Profit</p>
                      <p className="font-mono font-semibold">{pick.takeProfit}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Analysis:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pick.reasoning}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
