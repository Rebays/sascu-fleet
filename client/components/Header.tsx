"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const isHomePage = pathname === "/";
  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'}`}>
              SASCU Rentals
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/")
                  ? "bg-green-500 text-white"
                  : isScrolled || !isHomePage
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Home
            </Link>
            <Link
              href="/vehicles"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/vehicles") || pathname.startsWith("/vehicles/")
                  ? "bg-green-500 text-white"
                  : isScrolled || !isHomePage
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Vehicles
            </Link>
            <Link
              href="/manage-booking"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/manage-booking")
                  ? "bg-green-500 text-white"
                  : isScrolled || !isHomePage
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Manage Booking
            </Link>
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Link href="/vehicles">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled || !isHomePage
                ? "text-gray-900 hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96 mt-4" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                isActive("/")
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Home
            </Link>
            <Link
              href="/vehicles"
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                isActive("/vehicles") || pathname.startsWith("/vehicles/")
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Vehicles
            </Link>
            <Link
              href="/manage-booking"
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                isActive("/manage-booking")
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Manage Booking
            </Link>
            <Link href="/vehicles" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                Book Now
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
