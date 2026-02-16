"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TrendingUp, TrendingDown, Loader2, BarChart3 } from "lucide-react";
import Link from "next/link";

interface TrackRecordEntry {
  id: string;
  date: string;
  symbol: string;
  direction: string;
  entry: string;
  exit: string;
  stopLoss: string;
  profitLoss: string;
  status: string;
  confidence: number;
  timeframe: string;
  riskReward: string;
}

interface Stats {
  totalSignals: number;
  winRate: string;
  averageRiskReward: string;
  totalProfit: string;
  bestWin: string;
  worstLoss: string;
}

export default function TrackRecordPage() {
  const [trackRecord, setTrackRecord] = useState<TrackRecordEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrackRecord();
  }, []);

  const fetchTrackRecord = async () => {
    try {
      const response = await fetch("/api/track-record?limit=20");
      
      if (!response.ok) {
        throw new Error("Failed to fetch track record");
      }

      const data = await response.json();
      setStats(data.stats);
      setTrackRecord(data.trackRecord || []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to load track record");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              <Link href="/daily-picks">Daily Picks</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/pricing">Pricing</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">📈 Track Record</h1>
            <p className="text-muted-foreground">
              Transparent performance history of all our AI-generated signals
            </p>
          </div>

          {/* Stats Dashboard */}
          {stats && (
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalSignals}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Win Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">{stats.winRate}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg R:R
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.averageRiskReward}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Profit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">+{stats.totalProfit}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Best Win
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">{stats.bestWin}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Worst Loss
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-500">{stats.worstLoss}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Track Record Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Signals</CardTitle>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <p className="text-center text-red-500 py-8">{error}</p>
              ) : trackRecord.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No track record available yet
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-sm text-muted-foreground text-left">
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 pr-4">Symbol</th>
                        <th className="pb-3 pr-4">Direction</th>
                        <th className="pb-3 pr-4">Timeframe</th>
                        <th className="pb-3 pr-4">Entry</th>
                        <th className="pb-3 pr-4">Exit</th>
                        <th className="pb-3 pr-4">R:R</th>
                        <th className="pb-3 pr-4">P/L</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackRecord.map((entry) => (
                        <tr key={entry.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                          <td className="py-4 pr-4 text-sm">
                            {new Date(entry.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 pr-4 font-medium">{entry.symbol}</td>
                          <td className="py-4 pr-4">
                            <div className={`flex items-center gap-1 ${
                              entry.direction.includes("buy") || entry.direction === "LONG"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}>
                              {entry.direction.includes("buy") || entry.direction === "LONG" ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              <span className="text-sm font-semibold">
                                {entry.direction}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 pr-4 text-sm">{entry.timeframe}</td>
                          <td className="py-4 pr-4 text-sm">${entry.entry}</td>
                          <td className="py-4 pr-4 text-sm">${entry.exit}</td>
                          <td className="py-4 pr-4 text-sm font-medium">{entry.riskReward}</td>
                          <td className={`py-4 pr-4 text-sm font-semibold ${
                            parseFloat(entry.profitLoss) > 0
                              ? "text-green-500"
                              : parseFloat(entry.profitLoss) < 0
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }`}>
                            {parseFloat(entry.profitLoss) > 0 ? "+" : ""}
                            {entry.profitLoss}%
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              entry.status === "Win"
                                ? "bg-green-500/10 text-green-500"
                                : entry.status === "Loss"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}>
                              {entry.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer Note */}
          <Card className="mt-8 bg-muted/50">
            <CardContent className="p-6">
              <p className="text-sm text-center text-muted-foreground">
                📊 <strong>Full transparency:</strong> This track record includes all signals generated by our AI, both wins and losses. We update it daily to maintain accountability.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
