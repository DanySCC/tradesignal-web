import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">TradeSignal AI</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            href="/analyze" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link 
            href="/pricing" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link 
            href="/auth/signin" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Sign In
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
