"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CalendarIcon, Search, Shield, Clock, Sparkles } from "lucide-react";
import { format } from "date-fns";

export default function Hero() {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/vehicles");
  };

  return (
    <section className="relative overflow-hidden h-[75vh] w-full flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
      </div>

      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Drive Your
              <span className="block bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Dream Journey
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-gray-200">
              Book instantly, drive confidently with our reliable fleet.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Shield className="w-6 h-6 text-green-400 mb-2" />
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-gray-200 text-xs">Insured</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Clock className="w-6 h-6 text-green-400 mb-2" />
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-gray-200 text-xs">Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Sparkles className="w-6 h-6 text-green-400 mb-2" />
                <div className="text-2xl font-bold text-white mb-1">10+</div>
                <div className="text-gray-200 text-xs">Vehicles</div>
              </div>
            </div>
          </div>

          {/* Right Search Form */}
          <div className="lg:ml-auto w-full lg:max-w-md">
            <Card className="p-8 bg-white/95 backdrop-blur-lg shadow-2xl border-0">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Find Your Vehicle</h3>
              <form onSubmit={handleSearch} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-green-600" />
                    Pick-up Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-gray-300 h-12"
                      >
                        {pickupDate ? format(pickupDate, "PPP") : "Select pick-up date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={pickupDate}
                        onSelect={setPickupDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-green-600" />
                    Return Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-gray-300 h-12"
                      >
                        {returnDate ? format(returnDate, "PPP") : "Select return date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        disabled={(date) =>
                          pickupDate ? date < pickupDate : date < new Date()
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-12 text-base font-semibold"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Vehicles
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
