"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Info } from "lucide-react";

export default function CalculatorPage() {
  const [accountSize, setAccountSize] = useState<string>("10000");
  const [riskPercent, setRiskPercent] = useState<string>("1");
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [leverage, setLeverage] = useState<string>("1");

  const [results, setResults] = useState<{
    positionSize: number;
    riskAmount: number;
    stopLossDistance: number;
    potentialLoss: number;
    contractsQty: number;
  } | null>(null);

  const calculate = () => {
    const account = parseFloat(accountSize);
    const risk = parseFloat(riskPercent);
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const lev = parseFloat(leverage);

    if (!account || !risk || !entry || !sl) {
      alert("Please fill in all required fields");
      return;
    }

    const riskAmount = (account * risk) / 100;
    const stopLossDistance = Math.abs(entry - sl);
    const stopLossPercent = (stopLossDistance / entry) * 100;

    // Position size calculation
    const positionSize = (riskAmount / stopLossPercent) * 100;
    const potentialLoss = riskAmount;
    const contractsQty = (positionSize * lev) / entry;

    setResults({
      positionSize: Math.round(positionSize * 100) / 100,
      riskAmount: Math.round(riskAmount * 100) / 100,
      stopLossDistance: Math.round(stopLossDistance * 100) / 100,
      potentialLoss: Math.round(potentialLoss * 100) / 100,
      contractsQty: Math.round(contractsQty * 100) / 100,
    });
  };

  const reset = () => {
    setAccountSize("10000");
    setRiskPercent("1");
    setEntryPrice("");
    setStopLoss("");
    setLeverage("1");
    setResults(null);
  };

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
              <Link href="/track-record">Track Record</Link>
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

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              💰 Position Size Calculator
            </h1>
            <p className="text-lg text-muted-foreground">
              Calculate optimal position size based on your risk tolerance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Input Parameters</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="accountSize" className="block text-sm font-medium mb-2">
                    Account Size ($)
                  </label>
                  <input
                    id="accountSize"
                    type="number"
                    value={accountSize}
                    onChange={(e) => setAccountSize(e.target.value)}
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="10000"
                  />
                </div>

                <div>
                  <label htmlFor="riskPercent" className="block text-sm font-medium mb-2">
                    Risk per Trade (%)
                  </label>
                  <input
                    id="riskPercent"
                    type="number"
                    step="0.1"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(e.target.value)}
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 1-2% for conservative, 3-5% for aggressive
                  </p>
                </div>

                <div>
                  <label htmlFor="entryPrice" className="block text-sm font-medium mb-2">
                    Entry Price ($)
                  </label>
                  <input
                    id="entryPrice"
                    type="number"
                    step="0.01"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="68500"
                  />
                </div>

                <div>
                  <label htmlFor="stopLoss" className="block text-sm font-medium mb-2">
                    Stop Loss ($)
                  </label>
                  <input
                    id="stopLoss"
                    type="number"
                    step="0.01"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="67000"
                  />
                </div>

                <div>
                  <label htmlFor="leverage" className="block text-sm font-medium mb-2">
                    Leverage (x)
                  </label>
                  <input
                    id="leverage"
                    type="number"
                    step="1"
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher leverage = higher risk. Use with caution.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={calculate} size="lg" className="flex-1">
                    Calculate
                  </Button>
                  <Button onClick={reset} size="lg" variant="outline" className="flex-1">
                    Reset
                  </Button>
                </div>
              </div>
            </Card>

            {/* Results */}
            <div>
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Results</h2>

                {!results ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Enter your parameters and click Calculate
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Position Size</p>
                      <p className="text-3xl font-bold text-primary">
                        ${results.positionSize.toLocaleString()}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Risk Amount</p>
                        <p className="text-xl font-bold">
                          ${results.riskAmount.toLocaleString()}
                        </p>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Stop Distance</p>
                        <p className="text-xl font-bold">
                          ${results.stopLossDistance.toLocaleString()}
                        </p>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Max Loss</p>
                        <p className="text-xl font-bold text-red-500">
                          ${results.potentialLoss.toLocaleString()}
                        </p>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Contracts/Qty</p>
                        <p className="text-xl font-bold">
                          {results.contractsQty.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Risk Management Tips */}
              <Card className="p-6 bg-yellow-500/5 border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">Risk Management Tips</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Never risk more than 1-2% per trade</li>
                      <li>• Always use stop losses</li>
                      <li>• Higher leverage = higher risk</li>
                      <li>• Position size should match your risk tolerance</li>
                      <li>• Protect your capital above all else</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Formula Explanation */}
          <Card className="p-6 mt-8">
            <h3 className="text-xl font-bold mb-4">How It Works</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Risk Amount:</strong> Account Size × Risk %
              </p>
              <p>
                <strong>Stop Loss Distance:</strong> |Entry Price - Stop Loss|
              </p>
              <p>
                <strong>Stop Loss %:</strong> (Stop Loss Distance ÷ Entry Price) × 100
              </p>
              <p>
                <strong>Position Size:</strong> (Risk Amount ÷ Stop Loss %) × 100
              </p>
              <p>
                <strong>Contracts:</strong> (Position Size × Leverage) ÷ Entry Price
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
