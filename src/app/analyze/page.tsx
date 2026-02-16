"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Upload, X } from "lucide-react";
import Link from "next/link";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (uploadedFile: File) => {
    // Validate file type
    if (!uploadedFile.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, JPEG)");
      return;
    }

    // Validate file size (max 10MB)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB");
      return;
    }

    setFile(uploadedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalyzing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("chart", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
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

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight">
              Analyze Your Chart
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload a trading chart and get instant AI-powered analysis with SMART recommendations
            </p>
          </div>

          {!preview ? (
            // Upload Zone
            <Card
              className={`p-12 border-2 border-dashed transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-6">
                <Upload className="h-16 w-16 text-muted-foreground" />
                <div className="text-center space-y-2">
                  <p className="text-xl font-semibold">
                    Drop your chart here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PNG, JPG, JPEG (max 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleChange}
                />
                <Button size="lg" onClick={() => document.getElementById("file-upload")?.click()}>
                  Select File
                </Button>
              </div>
            </Card>
          ) : (
            // Preview & Analysis
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Chart Preview</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    disabled={analyzing}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="rounded-lg overflow-hidden border">
                  <img
                    src={preview}
                    alt="Chart preview"
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-6 flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                  >
                    {analyzing ? "Analyzing..." : "Analyze Chart"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleReset}
                    disabled={analyzing}
                  >
                    Upload Different Chart
                  </Button>
                </div>
              </Card>

              {/* Results */}
              {result && (
                <Card className="p-6 space-y-6">
                  <h2 className="text-2xl font-semibold">Analysis Results</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Technical Analysis */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Technical Analysis</h3>
                      <div className={`p-4 rounded-lg border-2 ${
                        result.technical.bias === "LONG"
                          ? "border-green-500 bg-green-500/10"
                          : result.technical.bias === "SHORT"
                          ? "border-red-500 bg-red-500/10"
                          : "border-yellow-500 bg-yellow-500/10"
                      }`}>
                        <div className="text-2xl font-bold mb-2">
                          {result.technical.bias}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Confidence: {result.technical.confidence}%
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><strong>Entry:</strong> ${result.technical.entry}</p>
                        <p><strong>Stop Loss:</strong> ${result.technical.stopLoss}</p>
                        <p><strong>Take Profit:</strong> ${result.technical.takeProfit}</p>
                      </div>
                    </div>

                    {/* SMART Analysis */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">SMART Recommendation</h3>
                      <div className={`p-4 rounded-lg border-2 ${
                        result.smart.recommendation === "LONG"
                          ? "border-green-500 bg-green-500/10"
                          : result.smart.recommendation === "SHORT"
                          ? "border-red-500 bg-red-500/10"
                          : "border-yellow-500 bg-yellow-500/10"
                      }`}>
                        <div className="text-2xl font-bold mb-2">
                          {result.smart.recommendation}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {result.smart.override ? "⚠️ Override Active" : "✅ Confirms Technical"}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><strong>Liquidation Risk:</strong> {result.smart.liquidationRisk}</p>
                        <p><strong>Funding Rate:</strong> {result.smart.fundingRate}</p>
                        <p><strong>Long/Short Ratio:</strong> {result.smart.longShortRatio}</p>
                      </div>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Analysis Reasoning</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {result.reasoning}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t">
                    <Button size="lg" className="flex-1">
                      Save to Dashboard
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1">
                      Share Analysis
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
