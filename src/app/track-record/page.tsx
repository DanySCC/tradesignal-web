import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

// Mock data for now - will be replaced with real API call
const mockTrackRecord = {
  stats: {
    totalSignals: 47,
    winRate: 68.1,
    avgRoR: 2.3,
    wins: 32,
    losses: 12,
    pending: 3,
  },
  signals: [
    {
      id: "1",
      date: "2026-02-15",
      symbol: "BTC",
      direction: "LONG",
      entry: "68,450",
      exit: "70,100",
      result: "WIN",
      roi: 2.4,
      confidence: 85,
    },
    {
      id: "2",
      date: "2026-02-15",
      symbol: "ETH",
      direction: "SHORT",
      entry: "2,950",
      exit: "2,820",
      result: "WIN",
      roi: 4.4,
      confidence: 78,
    },
    {
      id: "3",
      date: "2026-02-14",
      symbol: "SOL",
      direction: "LONG",
      entry: "87.50",
      exit: "85.20",
      result: "LOSS",
      roi: -2.6,
      confidence: 72,
    },
    {
      id: "4",
      date: "2026-02-14",
      symbol: "BTC",
      direction: "SHORT",
      entry: "69,200",
      exit: "71,500",
      result: "LOSS",
      roi: -3.3,
      confidence: 65,
    },
    {
      id: "5",
      date: "2026-02-13",
      symbol: "XRP",
      direction: "LONG",
      entry: "1.42",
      exit: "1.48",
      result: "WIN",
      roi: 4.2,
      confidence: 81,
    },
  ],
};

export default function TrackRecordPage() {
  const { stats, signals } = mockTrackRecord;

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
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              📈 Track Record
            </h1>
            <p className="text-lg text-muted-foreground">
              100% transparent. All signals. Real results. No cherry-picking.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Win Rate</p>
              <p className="text-3xl font-bold text-green-500">{stats.winRate}%</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Avg R:R</p>
              <p className="text-3xl font-bold">{stats.avgRoR}:1</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Signals</p>
              <p className="text-3xl font-bold">{stats.totalSignals}</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">W / L / P</p>
              <p className="text-3xl font-bold">
                <span className="text-green-500">{stats.wins}</span> /{" "}
                <span className="text-red-500">{stats.losses}</span> /{" "}
                <span className="text-yellow-500">{stats.pending}</span>
              </p>
            </Card>
          </div>

          {/* Transparency Note */}
          <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Why Trust Our Numbers?</h3>
                <p className="text-sm text-muted-foreground">
                  Every single signal we publish is tracked here. No selective reporting, no hiding losses. 
                  We believe in complete transparency because our AI improves through honest feedback loops.
                </p>
              </div>
            </div>
          </Card>

          {/* Signals Table */}
          <Card className="overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">Recent Signals</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Latest {signals.length} signals (showing all closed positions)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Symbol</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Direction</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Entry</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Exit</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Confidence</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Result</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {signals.map((signal) => (
                    <tr key={signal.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm">{signal.date}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{signal.symbol}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {signal.direction === "LONG" ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium text-green-500">LONG</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 text-red-500" />
                              <span className="text-sm font-medium text-red-500">SHORT</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">${signal.entry}</td>
                      <td className="px-6 py-4 text-sm font-mono">${signal.exit}</td>
                      <td className="px-6 py-4 text-sm">{signal.confidence}%</td>
                      <td className="px-6 py-4">
                        {signal.result === "WIN" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                            <CheckCircle className="h-3 w-3" />
                            WIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold">
                            <XCircle className="h-3 w-3" />
                            LOSS
                          </span>
                        )}
                      </td>
                      <td className={`px-6 py-4 text-right text-sm font-bold ${
                        signal.roi > 0 ? "text-green-500" : "text-red-500"
                      }`}>
                        {signal.roi > 0 ? "+" : ""}{signal.roi}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Showing last 5 signals. Full history available for PRO users.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/pricing">View Full Track Record (PRO)</Link>
              </Button>
            </div>
          </Card>

          {/* Methodology */}
          <Card className="p-6 mt-8">
            <h3 className="text-xl font-bold mb-4">How We Track Performance</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Entry:</strong> Signal price at publication time
              </p>
              <p>
                <strong>Exit:</strong> Stop loss or take profit hit (whichever comes first)
              </p>
              <p>
                <strong>ROI Calculation:</strong> Based on 1:1 risk reward unless take profit hit first
              </p>
              <p>
                <strong>Signal Lifecycle:</strong> Tracked for 7 days or until closed position
              </p>
              <p>
                <strong>Pending Signals:</strong> Active positions not yet closed (shown in yellow)
              </p>
            </div>
          </Card>
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
