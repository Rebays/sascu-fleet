"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span>SASCU</span>
        </Link>

        {/* Navigation and Button */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/about") ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            About
          </Link>
          <Link
            href="/vehicles"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/vehicles")
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Vehicles
          </Link>
          <Link
            href="/track-booking"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Track Booking
          </Link>
        </div>

        {/* Mobile CTA */}
        <Link
          href="/track-booking"
          className="md:hidden inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Track Booking
        </Link>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-t px-4 py-3 flex items-center justify-center gap-6">
        <Link
          href="/about"
          className={`text-sm font-medium transition-colors hover:text-primary ${
            isActive("/about") ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          About
        </Link>
        <Link
          href="/vehicles"
          className={`text-sm font-medium transition-colors hover:text-primary ${
            isActive("/vehicles") ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          Vehicles
        </Link>
      </nav>
    </header>
  );
}
