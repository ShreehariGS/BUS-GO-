import React, { useState } from 'react';
import { MapPin, Calendar, ArrowRightLeft, Search, ShieldCheck, Bus, Sparkles } from 'lucide-react';
import { POPULAR_INDIAN_CITIES } from '../data/initialData';
import { StateRTC } from '../types';

interface BusSearchHeroProps {
  fromCity: string;
  setFromCity: (city: string) => void;
  toCity: string;
  setToCity: (city: string) => void;
  travelDate: string;
  setTravelDate: (date: string) => void;
  selectedRTC: string;
  setSelectedRTC: (rtc: string) => void;
  operatorTypeFilter: string;
  setOperatorTypeFilter: (type: string) => void;
  onSearch: () => void;
}

export const BusSearchHero: React.FC<BusSearchHeroProps> = ({
  fromCity,
  setFromCity,
  toCity,
  setToCity,
  travelDate,
  setTravelDate,
  selectedRTC,
  setSelectedRTC,
  operatorTypeFilter,
  setOperatorTypeFilter,
  onSearch,
}) => {
  const [swapAnimation, setSwapAnimation] = useState(false);

  const handleSwap = () => {
    setSwapAnimation(true);
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    setTimeout(() => setSwapAnimation(false), 300);
  };

  const handleQuickRoute = (from: string, to: string) => {
    setFromCity(from);
    setToCity(to);
  };

  const rtcOptions: { label: string; value: string; state: string }[] = [
    { label: 'All Fleets', value: 'ALL', state: 'All India' },
    { label: 'KSRTC', value: 'KSRTC', state: 'Karnataka' },
    { label: 'TSRTC', value: 'TSRTC', state: 'Telangana' },
    { label: 'APSRTC', value: 'APSRTC', state: 'Andhra Pradesh' },
    { label: 'MSRTC', value: 'MSRTC', state: 'Maharashtra' },
    { label: 'Kerala RTC', value: 'Kerala RTC', state: 'Kerala' },
  ];

  return (
    <div className="relative bg-gradient-to-b from-red-600 via-red-600 to-red-700 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-lg">
      {/* Background Decorative Bus Graphic Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="bus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bus-grid)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>India's Largest Unified Bus Network • 100,000+ Daily Routes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Book Bus Tickets All Over India
          </h1>
          <p className="text-red-100 text-sm sm:text-base mt-2 font-medium">
            Government State RTCs & Luxury Private Fleets in one seamless platform with Live Seat Selector & Instant GST Invoice.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 text-slate-800 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* From City */}
            <div className="md:col-span-4 relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                From City
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-5 h-5 text-red-600 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  list="from-cities"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="e.g. Bengaluru, Hyderabad"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold text-sm sm:text-base focus:bg-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                />
                <datalist id="from-cities">
                  {POPULAR_INDIAN_CITIES.map((city) => (
                    <option key={`from-${city}`} value={city} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap Cities"
                className={`p-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-transform ${
                  swapAnimation ? 'rotate-180' : ''
                }`}
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To City */}
            <div className="md:col-span-4 relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                To Destination
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-5 h-5 text-red-600 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  list="to-cities"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="e.g. Hyderabad, Chennai, Goa"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold text-sm sm:text-base focus:bg-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                />
                <datalist id="to-cities">
                  {POPULAR_INDIAN_CITIES.map((city) => (
                    <option key={`to-${city}`} value={city} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Date Picker */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Date of Journey
              </label>
              <div className="relative flex items-center">
                <Calendar className="w-5 h-5 text-red-600 absolute left-3 pointer-events-none" />
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Quick Filter Row: Operator Category & State RTCs */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            {/* Quick Sector Filter */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Bus className="w-3.5 h-3.5 text-red-600" /> Fleet:
              </span>
              <button
                type="button"
                onClick={() => setOperatorTypeFilter('ALL')}
                className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                  operatorTypeFilter === 'ALL'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All (RTC + Private)
              </button>
              <button
                type="button"
                onClick={() => setOperatorTypeFilter('RTC')}
                className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  operatorTypeFilter === 'RTC'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Govt RTCs</span>
              </button>
              <button
                type="button"
                onClick={() => setOperatorTypeFilter('PRIVATE')}
                className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                  operatorTypeFilter === 'PRIVATE'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Private Fleets
              </button>
            </div>

            {/* State RTC Chips */}
            <div className="flex flex-wrap items-center gap-1 text-xs">
              <span className="text-slate-500 font-medium mr-1 hidden lg:inline">State RTC:</span>
              {rtcOptions.map((rtc) => (
                <button
                  key={rtc.value}
                  type="button"
                  onClick={() => setSelectedRTC(rtc.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    selectedRTC === rtc.value
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rtc.label}
                </button>
              ))}
            </div>

            {/* Submit / Find Buses Button */}
            <div className="w-full sm:w-auto ml-auto">
              <button
                type="button"
                onClick={onSearch}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black px-6 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-red-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>SEARCH BUSES</span>
              </button>
            </div>
          </div>
        </div>

        {/* Popular Route Chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-red-100">
          <span className="font-semibold text-white">Popular Indian Routes:</span>
          {[
            { from: 'Bengaluru', to: 'Hyderabad' },
            { from: 'Delhi', to: 'Jaipur' },
            { from: 'Mumbai', to: 'Pune' },
            { from: 'Bengaluru', to: 'Chennai' },
            { from: 'Bengaluru', to: 'Goa' },
            { from: 'Vijayawada', to: 'Hyderabad' },
            { from: 'Bengaluru', to: 'Kochi' },
          ].map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuickRoute(r.from, r.to)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-2.5 py-1 text-white font-medium transition-colors cursor-pointer"
            >
              {r.from} → {r.to}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
