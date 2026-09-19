import React, { useState } from 'react';
import { Bus, BoardingPoint, DroppingPoint, Seat } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Ticket, 
  Smartphone, 
  Building2, 
  Clock, 
  Tag,
  Zap,
  RotateCcw,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface SeatSelectorProps {
  bus: Bus;
  selectedSeats: Seat[];
  onToggleSeat: (seat: Seat) => void;
  selectedBoarding: BoardingPoint;
  setSelectedBoarding: (point: BoardingPoint) => void;
  selectedDropping: DroppingPoint;
  setSelectedDropping: (point: DroppingPoint) => void;
  onProceedToPassengers: () => void;
  onQuickPayNow?: (couponDiscount: number) => void;
  onClose: () => void;
  travelDate?: string;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  bus,
  selectedSeats,
  onToggleSeat,
  selectedBoarding,
  setSelectedBoarding,
  selectedDropping,
  setSelectedDropping,
  onProceedToPassengers,
  onQuickPayNow,
  onClose,
  travelDate = 'Fri, 18 Sep',
}) => {
  const isSleeper = bus.busType.toLowerCase().includes('sleeper');
  const [couponApplied, setCouponApplied] = useState(true);
  const [activeMobileDeck, setActiveMobileDeck] = useState<'both' | 'lower' | 'upper'>('both');
  const [showStopsPicker, setShowStopsPicker] = useState(false);
  const [seatFilter, setSeatFilter] = useState<'all' | 'available' | 'window' | 'ladies'>('all');

  const lowerSeats = bus.seats.filter((s) => s.deck === 'lower' || s.deck === 'single');
  const upperSeats = bus.seats.filter((s) => s.deck === 'upper');

  const availableSeatsList = bus.seats.filter(
    (s) => s.status === 'available' || s.status === 'female_reserved'
  );
  const totalAvailableCount = availableSeatsList.length;

  const couponDiscount = couponApplied && selectedSeats.length > 0 ? 50 : 0;
  const totalSeatsPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const gstAmount = Math.round(totalSeatsPrice * 0.05 * 10) / 10;
  const grandTotalAmount = Math.max(0, Math.round(totalSeatsPrice + gstAmount - couponDiscount));

  // Quick auto-pick best available seat
  const handleAutoPickAvailable = () => {
    // Find first available unselected seat
    const firstFree = availableSeatsList.find((s) => !selectedSeats.some((sel) => sel.id === s.id));
    if (firstFree) {
      onToggleSeat(firstFree);
    }
  };

  // Render sleeper berth capsule matching the reference blueprint
  const renderSleeperBerth = (seat: Seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    const isBooked = seat.status === 'booked';
    const isFemale = seat.status === 'female_reserved';

    // Apply seatFilter: if filtered to available only, dim out booked seats
    if (seatFilter === 'available' && isBooked) {
      return (
        <div
          key={seat.id}
          className="w-[50px] sm:w-[54px] h-[82px] sm:h-[88px] rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center opacity-30 select-none cursor-not-allowed overflow-hidden shrink-0"
        >
          <span className="text-[9px] text-slate-400">Sold</span>
        </div>
      );
    }

    if (seatFilter === 'window' && seat.berthPosition !== 'single-berth' && !isSelected) {
      return (
        <div
          key={seat.id}
          className="w-[50px] sm:w-[54px] h-[82px] sm:h-[88px] rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center opacity-40 select-none cursor-not-allowed overflow-hidden shrink-0"
        >
          <span className="text-[9px] text-slate-400">{seat.number}</span>
        </div>
      );
    }

    if (seatFilter === 'ladies' && !isFemale && !isSelected) {
      return (
        <div
          key={seat.id}
          className="w-[50px] sm:w-[54px] h-[82px] sm:h-[88px] rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center opacity-40 select-none cursor-not-allowed overflow-hidden shrink-0"
        >
          <span className="text-[9px] text-slate-400">{seat.number}</span>
        </div>
      );
    }

    if (isBooked) {
      return (
        <div
          key={seat.id}
          className="w-[50px] sm:w-[54px] h-[82px] sm:h-[88px] rounded-xl bg-[#eef1f6] border border-[#d8e0ec] flex flex-col items-center justify-between py-2 cursor-not-allowed opacity-80 select-none overflow-hidden shrink-0"
          title={`Seat ${seat.number} (Booked / Sold Out)`}
        >
          <span className="text-[9px] text-slate-400 font-bold">{seat.number}</span>
          <span className="text-[8px] text-slate-400 font-medium">Booked</span>
          {/* Gray pillow bar */}
          <div className="w-6 sm:w-7 h-1 sm:h-1.5 rounded-full bg-[#cbd5e1]/70" />
        </div>
      );
    }

    if (isSelected) {
      return (
        <motion.button
          key={seat.id}
          type="button"
          onClick={() => onToggleSeat(seat)}
          whileTap={{ scale: 0.93 }}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="w-[50px] sm:w-[54px] h-[82px] sm:h-[88px] rounded-xl bg-emerald-600 border-2 border-emerald-700 text-white shadow-md ring-2 ring-emerald-300 transition-colors relative flex flex-col items-center justify-between py-1.5 sm:py-2 cursor-pointer overflow-hidden shrink-0"
          title={`Selected ${seat.number} - ₹${seat.price} (Click to remove)`}
        >
          <div className="w-full flex items-center justify-between px-1.5 text-[9px] font-black opacity-95">
            <span>{seat.number}</span>
            <motion.div
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <Check className="w-3 h-3 text-white stroke-[3]" />
            </motion.div>
          </div>
          <div className="text-center px-0.5">
            <span className="text-[11px] sm:text-xs font-black tracking-tight whitespace-nowrap block">₹{seat.price}</span>
            <span className="text-[8px] uppercase tracking-wider font-bold text-emerald-100 block">Selected</span>
          </div>
          {/* White Pillow line */}
          <div className="w-6 sm:w-7 h-1 sm:h-1.5 rounded-full bg-white/90" />
        </motion.button>
      );
    }

    if (isFemale) {
      return (
        <motion.button
          key={seat.id}
          type="button"
          onClick={() => onToggleSeat(seat)}
          whileTap={{ scale: 0.93 }}
          className="w-[50px] sm:w-[54px] h-[82px] sm:h-[88px] rounded-xl bg-rose-50/80 border-2 border-rose-300 hover:border-rose-400 hover:bg-rose-100/70 transition-colors relative flex flex-col items-center justify-between py-1.5 sm:py-2 cursor-pointer shadow-2xs group overflow-hidden shrink-0"
          title={`Seat ${seat.number} - Ladies Reserved (Available at ₹${seat.price})`}
        >
          <div className="w-full flex items-center justify-between px-1.5 text-[9px] font-bold text-rose-700">
            <span>{seat.number}</span>
            <span className="text-[10px] font-black">♀</span>
          </div>
          <div className="text-center px-0.5">
            <span className="text-[11px] sm:text-xs font-black text-rose-700 whitespace-nowrap block">₹{seat.price}</span>
            <span className="text-[8px] font-bold text-rose-500 block">Available</span>
          </div>
          {/* Pink Pillow line */}
          <div className="w-6 sm:w-7 h-1 sm:h-1.5 rounded-full bg-rose-200 group-hover:bg-rose-300" />
        </motion.button>
      );
    }

    // Available seat - clearly clickable with green border and price
    return (
      <motion.button
        key={seat.id}
        type="button"
        onClick={() => onToggleSeat(seat)}
        whileTap={{ scale: 0.93 }}
        className="w-[50px] sm:w-[54px] h-[82px] sm:h-[88px] rounded-xl bg-white border-2 border-emerald-600 hover:border-emerald-700 hover:bg-emerald-50/60 hover:shadow-sm transition-colors relative flex flex-col items-center justify-between py-1.5 sm:py-2 cursor-pointer shadow-2xs group overflow-hidden shrink-0"
        title={`Seat ${seat.number} - Available! Click to select (₹${seat.price})`}
      >
        {/* Offer dot inside capsule top-right */}
        <span className="w-2 h-2 rounded-full bg-rose-500 border border-white absolute top-1 right-1 shadow-2xs pointer-events-none" />
        
        <div className="w-full flex items-center justify-between px-1.5 text-[9px] font-bold text-slate-600">
          <span>{seat.number}</span>
          <span className="text-[7px] text-emerald-600 font-extrabold uppercase">Open</span>
        </div>

        <div className="text-center px-0.5">
          <span className="text-[11px] sm:text-xs font-black text-emerald-700 group-hover:text-emerald-800 whitespace-nowrap block">
            ₹{seat.price}
          </span>
          <span className="text-[8px] text-slate-400 group-hover:text-emerald-600 font-medium truncate block max-w-full">
            {seat.berthPosition === 'single-berth' ? 'Window' : 'Berth'}
          </span>
        </div>

        {/* Green Pillow line at bottom */}
        <div className="w-6 sm:w-7 h-1 sm:h-1.5 rounded-full bg-emerald-200 group-hover:bg-emerald-300 transition-colors" />
      </motion.button>
    );
  };

  // Group sleeper seats into rows of 3: 1 single berth on left + 2 double berths on right
  const renderDeckBerths = (seats: Seat[]) => {
    const singleBerths = seats.filter((s) => s.berthPosition === 'single-berth');
    const doubleBerths = seats.filter((s) => s.berthPosition === 'double-berth');

    const doublePairs: Seat[][] = [];
    for (let i = 0; i < doubleBerths.length; i += 2) {
      doublePairs.push(doubleBerths.slice(i, i + 2));
    }

    const rowCount = Math.max(singleBerths.length, doublePairs.length, 6);

    return (
      <div className="space-y-2.5 sm:space-y-3">
        {Array.from({ length: rowCount }).map((_, rowIdx) => {
          const singleSeat = singleBerths[rowIdx];
          const pair = doublePairs[rowIdx] || [];

          return (
            <div key={`row-${rowIdx}`} className="flex items-center justify-between gap-1.5 sm:gap-2 max-w-[245px] sm:max-w-[265px] mx-auto py-0.5">
              {/* Left Single Berth */}
              <div className="shrink-0 w-[50px] sm:w-[54px]">
                {singleSeat ? renderSleeperBerth(singleSeat) : <div className="w-[50px] sm:w-[54px] h-[82px] sm:h-[88px]" />}
              </div>

              {/* Aisle in middle */}
              <div className="flex-1 min-w-[20px] max-w-[40px] flex flex-col items-center justify-center select-none py-1 px-0.5">
                <div className="w-full h-px border-t border-dashed border-slate-200"></div>
                <span className="text-[8px] text-slate-300 font-bold uppercase tracking-wider my-0.5">Aisle</span>
                <div className="w-full h-px border-t border-dashed border-slate-200"></div>
              </div>

              {/* Right Double Berths */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-[50px] sm:w-[54px]">
                  {pair[0] ? renderSleeperBerth(pair[0]) : <div className="w-[50px] sm:w-[54px] h-[82px] sm:h-[88px]" />}
                </div>
                <div className="w-[50px] sm:w-[54px]">
                  {pair[1] ? renderSleeperBerth(pair[1]) : <div className="w-[50px] sm:w-[54px] h-[82px] sm:h-[88px]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-[#f5f7fb] border-t border-slate-200 rounded-b-3xl pb-6 animate-in fade-in duration-200">
      {/* 1. Top Blueprint Header Bar (Matching Image) */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 relative z-10 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm cursor-pointer py-1 pr-2 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-blue-600" />
            <span>Back</span>
          </button>

          {/* Centered Route Header */}
          <div className="text-center truncate px-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight flex items-center justify-center gap-2">
              <span>Select seats</span>
              <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {totalAvailableCount} Available
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate">
              {selectedBoarding?.location || bus.boardingPoints[0]?.location || 'Boarding'}, {bus.route.from} → {bus.route.to}
            </p>
          </div>

          {/* Top Right Golden Offer Voucher Badge */}
          <button
            type="button"
            onClick={() => setCouponApplied(!couponApplied)}
            className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-black transition-all cursor-pointer shadow-2xs ${
              couponApplied
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/40'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-50 hover:text-amber-800'
            }`}
            title="Click to toggle ₹50 coupon discount"
          >
            <Tag className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Try new</span>
            <span className="text-amber-900">₹50 OFF</span>
            {couponApplied && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
          </button>
        </div>
      </div>

      {/* 2. Quick Available Seats Selector Toolbar */}
      <div className="bg-emerald-50/70 border-b border-emerald-100 py-2.5 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-extrabold text-emerald-900">
              {totalAvailableCount} Berths Available to Book Right Now
            </span>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAutoPickAvailable}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer hover:bg-emerald-700"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Auto-Select Available Seat</span>
            </button>

            {selectedSeats.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  selectedSeats.forEach((s) => onToggleSeat(s));
                }}
                className="text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Seat Filter Pills & Deck View Switcher */}
      <div className="max-w-4xl mx-auto px-4 pt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-slate-500 mr-1">Filter:</span>
          <button
            type="button"
            onClick={() => setSeatFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              seatFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Berths ({bus.seats.length})
          </button>
          <button
            type="button"
            onClick={() => setSeatFilter('available')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              seatFilter === 'available'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Available Only ({totalAvailableCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setSeatFilter('window')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              seatFilter === 'window'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Window Berths
          </button>
          <button
            type="button"
            onClick={() => setSeatFilter('ladies')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              seatFilter === 'ladies'
                ? 'bg-rose-600 text-white'
                : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            Ladies (♀)
          </button>
        </div>

        {/* Deck View Toggle (Desktop and Mobile) */}
        {isSleeper && (
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 px-1.5 uppercase">Deck:</span>
            <button
              type="button"
              onClick={() => setActiveMobileDeck('both')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                activeMobileDeck === 'both' ? 'bg-red-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Both Decks
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileDeck('lower')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                activeMobileDeck === 'lower' ? 'bg-red-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Lower
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileDeck('upper')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                activeMobileDeck === 'upper' ? 'bg-red-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Upper
            </button>
          </div>
        )}
      </div>

      {/* 3. Main Seat Blueprint Container (Side-by-Side Decks) */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4">
        {isSleeper ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 justify-center items-start">
            {/* Lower Deck Card */}
            {(activeMobileDeck === 'both' || activeMobileDeck === 'lower') && (
              <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs overflow-x-auto min-w-0">
                {/* Deck Card Header with Steering Wheel Icon */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                      Lower deck
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {lowerSeats.filter((s) => s.status === 'available').length} Open
                    </span>
                  </div>

                  {/* Steering Wheel Graphic (Top Right of Lower Deck, matching screenshot) */}
                  <div
                    className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-400 bg-slate-50"
                    title="Driver Side Steering Wheel"
                  >
                    <svg className="w-5 h-5 text-slate-400 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                      <line x1="12" y1="3" x2="12" y2="9.5" />
                      <line x1="4" y1="16" x2="10" y2="13" />
                      <line x1="20" y1="16" x2="14" y2="13" />
                    </svg>
                  </div>
                </div>

                {/* Lower deck sleeper berths */}
                {renderDeckBerths(lowerSeats)}
              </div>
            )}

            {/* Upper Deck Card */}
            {(activeMobileDeck === 'both' || activeMobileDeck === 'upper') && (
              <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs overflow-x-auto min-w-0">
                {/* Deck Card Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                      Upper deck
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {upperSeats.filter((s) => s.status === 'available').length} Open
                    </span>
                  </div>
                </div>

                {/* Upper deck sleeper berths */}
                {renderDeckBerths(upperSeats)}
              </div>
            )}
          </div>
        ) : (
          /* Seater Blueprint (2+2 Luxury Layout) */
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-5 shadow-xs overflow-x-auto min-w-0">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <span className="text-sm font-extrabold text-slate-900">2 + 2 Luxury Seater Layout</span>
              <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                  <line x1="12" y1="3" x2="12" y2="9.5" />
                  <line x1="4" y1="16" x2="10" y2="13" />
                  <line x1="20" y1="16" x2="14" y2="13" />
                </svg>
              </div>
            </div>

            {/* 2+2 rows */}
            <div className="space-y-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((row) => {
                const sA = bus.seats.find((s) => s.number === `${row}A`);
                const sB = bus.seats.find((s) => s.number === `${row}B`);
                const sC = bus.seats.find((s) => s.number === `${row}C`);
                const sD = bus.seats.find((s) => s.number === `${row}D`);

                const renderSeaterBtn = (seat?: Seat) => {
                  if (!seat) return <div className="w-10 sm:w-11 h-10 sm:h-11 shrink-0" />;
                  const isSel = selectedSeats.some((s) => s.id === seat.id);
                  const isBk = seat.status === 'booked';
                  const isFem = seat.status === 'female_reserved';

                  if (isBk) {
                    return (
                      <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-[#eef1f6] border border-[#d8e0ec] cursor-not-allowed opacity-80 flex items-center justify-center text-[10px] text-slate-300 font-bold shrink-0 overflow-hidden" />
                    );
                  }
                  if (isSel) {
                    return (
                      <motion.button
                        key={seat.id}
                        type="button"
                        onClick={() => onToggleSeat(seat)}
                        whileTap={{ scale: 0.92 }}
                        initial={{ scale: 0.94 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-emerald-600 border border-emerald-700 text-white font-extrabold text-[11px] shadow-sm ring-2 ring-emerald-300 flex flex-col items-center justify-center cursor-pointer shrink-0 overflow-hidden relative"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -45, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                          className="flex items-center gap-0.5 leading-none"
                        >
                          <span className="leading-tight text-[10px]">{seat.number}</span>
                          <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                        </motion.div>
                        <span className="text-[8px] font-normal leading-tight opacity-90">₹{seat.price}</span>
                      </motion.button>
                    );
                  }
                  if (isFem) {
                    return (
                      <motion.button
                        key={seat.id}
                        type="button"
                        onClick={() => onToggleSeat(seat)}
                        whileTap={{ scale: 0.92 }}
                        className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 font-extrabold text-[11px] hover:bg-rose-100 flex flex-col items-center justify-center cursor-pointer shadow-2xs shrink-0 overflow-hidden transition-colors"
                      >
                        <span className="leading-tight">{seat.number}</span>
                        <span className="text-[8px] font-normal leading-tight whitespace-nowrap">♀ ₹{seat.price}</span>
                      </motion.button>
                    );
                  }
                  return (
                    <motion.button
                      key={seat.id}
                      type="button"
                      onClick={() => onToggleSeat(seat)}
                      whileTap={{ scale: 0.92 }}
                      className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-white border-2 border-emerald-600 text-emerald-700 font-extrabold text-[11px] hover:bg-emerald-50 hover:shadow-xs flex flex-col items-center justify-center cursor-pointer shadow-2xs shrink-0 overflow-hidden transition-colors"
                    >
                      <span className="leading-tight">{seat.number}</span>
                      <span className="text-[8px] font-normal leading-tight">₹{seat.price}</span>
                    </motion.button>
                  );
                };

                return (
                  <div key={row} className="flex items-center justify-between gap-2 max-w-[260px] mx-auto">
                    <div className="flex gap-1.5">
                      {renderSeaterBtn(sA)}
                      {renderSeaterBtn(sB)}
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono select-none">{row}</span>
                    <div className="flex gap-1.5">
                      {renderSeaterBtn(sC)}
                      {renderSeaterBtn(sD)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-5 py-2.5 px-4 bg-white rounded-2xl border border-slate-200 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-white border-2 border-emerald-600 inline-block"></span>
            <span className="text-slate-700 font-semibold">Available Berths</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-rose-50 border-2 border-rose-300 inline-block"></span>
            <span className="text-rose-700 font-bold">Ladies (♀)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-emerald-600 border border-emerald-700 inline-block shadow-xs"></span>
            <span className="text-emerald-700 font-extrabold">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-[#eef1f6] border border-[#d8e0ec] inline-block"></span>
            <span className="text-slate-400 font-medium">Booked</span>
          </div>
        </div>

        {/* 4. Bottom Sheet / Docked Card (Matching bottom sheet in image) */}
        <div className="mt-6 bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
          {/* Pull handle */}
          <div className="pt-3 pb-1 flex justify-center">
            <div className="w-12 h-1 bg-slate-300 rounded-full" />
          </div>

          <div className="p-4 sm:p-5">
            {/* Operator Header & Timing */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{bus.operatorName}</span>
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-white" />
                    {bus.rating}
                  </span>
                  <span className="text-xs text-slate-400">({bus.reviewsCount})</span>
                </h4>
                <p className="text-xs text-slate-600 font-semibold mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {bus.departureTime} - {bus.arrivalTime} · {travelDate}
                  </span>
                  <span className="text-slate-400">• {bus.duration}</span>
                </p>
              </div>

              {/* Toggle pickup/drop points */}
              <button
                type="button"
                onClick={() => setShowStopsPicker(!showStopsPicker)}
                className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>{showStopsPicker ? 'Hide Boarding Points' : 'Change Boarding/Drop Points'}</span>
              </button>
            </div>

            {/* Boarding and Dropping Points Picker Accordion */}
            {showStopsPicker && (
              <div className="py-3 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50/60 p-3 rounded-2xl mt-3 animate-in fade-in duration-150">
                <div>
                  <span className="font-extrabold text-slate-700 block mb-1">
                    Pickup: {bus.route.from}
                  </span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {bus.boardingPoints.map((b) => (
                      <label
                        key={b.location}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer ${
                          selectedBoarding.location === b.location
                            ? 'bg-red-50 border-red-300 font-bold text-red-700'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <span>{b.location} ({b.time})</span>
                        <input
                          type="radio"
                          name="bp"
                          checked={selectedBoarding.location === b.location}
                          onChange={() => setSelectedBoarding(b)}
                          className="text-red-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-extrabold text-slate-700 block mb-1">
                    Drop: {bus.route.to}
                  </span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {bus.droppingPoints.map((d) => (
                      <label
                        key={d.location}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer ${
                          selectedDropping.location === d.location
                            ? 'bg-red-50 border-red-300 font-bold text-red-700'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <span>{d.location} ({d.time})</span>
                        <input
                          type="radio"
                          name="dp"
                          checked={selectedDropping.location === d.location}
                          onChange={() => setSelectedDropping(d)}
                          className="text-red-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Selected Seats and Pricing Row */}
            <div className="py-4">
              {selectedSeats.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 shrink-0">
                        Selected Berths ({selectedSeats.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSeats.map((s) => (
                          <motion.button
                            key={s.id}
                            type="button"
                            onClick={() => onToggleSeat(s)}
                            whileTap={{ scale: 0.92 }}
                            animate={{ scale: [0.95, 1.05, 1] }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold text-xs px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-colors shadow-2xs"
                            title={`Seat ${s.number} selected. Click to remove`}
                          >
                            <motion.span
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                            >
                              <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                            </motion.span>
                            <span>{s.number}</span>
                            <span className="text-[10px] text-emerald-600 font-normal">
                              ({s.deck === 'upper' ? 'Upper' : 'Lower'})
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs text-slate-400 line-through mr-2">
                        ₹{totalSeatsPrice + (couponDiscount ? 50 : 0) + gstAmount}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-red-600">
                        ₹{grandTotalAmount}
                      </span>
                      <span className="text-[10px] text-slate-400 block">(Taxes & GST included)</span>
                    </div>
                  </div>

                  {/* Price breakdown pill */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span>Base Fare: <strong>₹{totalSeatsPrice}</strong></span>
                    <span>•</span>
                    <span>GST (5%): <strong>₹{gstAmount}</strong></span>
                    {couponDiscount > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold bg-emerald-100/60 px-1.5 py-0.5 rounded">
                          ₹50 Discount Applied
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">Zero Convenience Fee</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200 text-center sm:text-left">
                  <div>
                    <p className="text-xs font-black text-emerald-900 flex items-center justify-center sm:justify-start gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>{totalAvailableCount} seats ready to book!</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Click any white berth with green price border above, or use the quick button.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoPickAvailable}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Quick Select 1 Berth</span>
                  </button>
                </div>
              )}
            </div>

            {/* Pay Now UPI / Net Banking & Passenger Details Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              {/* Secondary Option: Fill Passenger Details */}
              <button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={onProceedToPassengers}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer text-center"
              >
                Add Passenger Names & Details
              </button>

              {/* PRIMARY ACTION: PAY NOW UPI / NET BANKING */}
              <button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={() => {
                  if (onQuickPayNow) {
                    onQuickPayNow(couponDiscount);
                  } else {
                    onProceedToPassengers();
                  }
                }}
                className="flex-1 w-full bg-red-600 hover:bg-red-700 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-3 px-5 rounded-2xl text-sm sm:text-base shadow-lg shadow-red-200 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <Building2 className="w-4 h-4" />
                </div>
                <span>
                  {selectedSeats.length === 0
                    ? 'Select an Available Seat to Pay'
                    : `Pay ₹${grandTotalAmount} Now (UPI / Net Banking)`}
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
