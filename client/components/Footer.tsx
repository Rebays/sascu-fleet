import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">SASCU Rentals</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your trusted partner for vehicle rentals. Experience comfort and reliability on every journey.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-green-500 flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-green-500 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-green-500 flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-green-500 flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-green-500 group-hover:w-2 transition-all"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/vehicles" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-green-500 group-hover:w-2 transition-all"></span>
                  Our Fleet
                </Link>
              </li>
              <li>
                <Link href="/manage-booking" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-green-500 group-hover:w-2 transition-all"></span>
                  Manage Booking
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-green-500 group-hover:w-2 transition-all"></span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Solomon Airlines Office<br />Honiara, Solomon Islands</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a href="mailto:care@sascu.com" className="text-sm hover:text-green-400 transition-colors">
                  care@sascu.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a href="tel:+123456789" className="text-sm hover:text-green-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers and updates
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-green-500"
              />
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 SASCU Credit Union. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-green-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
