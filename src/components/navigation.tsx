"use client";

import Link from "next/link";
import { TrendingUp, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function Navigation() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/analyze", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/auth/signin", label: "Sign In" },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TradeSignal AI</span>
          </Link>
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation - Centered */}
        <div className="flex md:hidden items-center justify-between">
          {/* Left spacer for balance */}
          <div className="w-10" />
          
          {/* Centered Logo */}
          <Link href="/" className="flex items-center gap-2 flex-1 justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">TradeSignal AI</span>
          </Link>

          {/* Right: Theme + Menu */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col gap-6 mt-8">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
