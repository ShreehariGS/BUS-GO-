import React from 'react';
import { Bus, Seat, BoardingPoint, DroppingPoint } from '../types';
import { 
  ShieldCheck, 
  Star, 
  Clock, 
  Wifi, 
  Zap, 
  Droplet, 
  ShieldAlert, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  UserCheck, 
  Sparkles, 
  Navigation,
  Ticket,
  CreditCard,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SeatSelector } from './SeatSelector';

interface BusCardProps {
  bus: Bus;
  isExpanded: boolean;
  onToggleExpand: () => void;
  selectedSeats: Seat[];
  onToggleSeat: (seat: Seat) => void;
  selectedBoarding: BoardingPoint;
  setSelectedBoarding: (point: BoardingPoint) => void;
  selectedDropping: DroppingPoint;
  setSelectedDropping: (point: DroppingPoint) => void;
  onProceedToPassengers: () => void;
  onQuickPayNow?: (couponDiscount: number) => void;
  travelDate?: string;
}

export const BusCard: React.FC<BusCardProps> = ({
  bus,
  isExpanded,
  onToggleExpand,
  selectedSeats,
  onToggleSeat,
  selectedBoarding,
  setSelectedBoarding,
  selectedDropping,
  setSelectedDropping,
  onProceedToPassengers,
  onQuickPayNow,
  travelDate,
}) => {
  const generalAvailable = bus.seats.filter((s) => s.status === 'available').length;
  const ladiesAvailable = bus.seats.filter((s) => s.status === 'female_reserved').length;
  const availableSeatsCount = generalAvailable + ladiesAvailable;
  const isSleeper = bus.busType.toLowerCase().includes('sleeper');

  // Calculate accurate price metrics
  const seatPrices = bus.seats.map((s) => s.price);
  const minSeatPrice = seatPrices.length > 0 ? Math.min(...seatPrices) : bus.baseFare;
  const maxSeatPrice = seatPrices.length > 0 ? Math.max(...seatPrices) : bus.baseFare;
  const hasPriceRange = minSeatPrice !== maxSeatPrice;
  const selectedSeatsTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const selectedSeatsGst = Math.round(selectedSeatsTotal * 0.05 * 10) / 10;
  const selectedSeatsGrandTotal = Math.round(selectedSeatsTotal + selectedSeatsGst);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
      isExpanded ? 'border-red-500 ring-2 ring-red-100 shadow-md' : 'border-slate-200 hover:border-slate-300'
    }`}>
      {/* Top Card Info Row */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Operator Details & Bus Type */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {bus.operatorName}
              </h3>

              {bus.operatorType === 'RTC' ? (
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                  <span>State RTC ({bus.stateRTC})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Verified Private Fleet</span>
                </span>
              )}

              <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                {bus.busNumber}
              </span>

              {/* Real-time Bus Seat Availability Badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                availableSeatsCount <= 5
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${availableSeatsCount <= 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                <span>{availableSeatsCount} {isSleeper ? 'Berths' : 'Seats'} Available</span>
                {ladiesAvailable > 0 && (
                  <span className="text-[10px] text-rose-600 font-medium">({ladiesAvailable} Ladies)</span>
                )}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span className="font-semibold text-slate-700">{bus.busType}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Navigation className="w-3 h-3" /> Live GPS Tracking
              </span>
            </p>

            {/* Amenities Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {bus.amenities.slice(0, 4).map((amenity, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                >
                  {amenity.includes('WiFi') && <Wifi className="w-3 h-3 text-slate-400" />}
                  {amenity.includes('Charging') && <Zap className="w-3 h-3 text-amber-500" />}
                  {amenity.includes('Water') && <Droplet className="w-3 h-3 text-blue-500" />}
                  <span>{amenity}</span>
                </span>
              ))}
              {bus.amenities.length > 4 && (
                <span className="text-[10px] text-slate-400">+{bus.amenities.length - 4} more</span>
              )}
            </div>
          </div>

          {/* Schedule & Duration Timeline */}
          <div className="flex items-center justify-between sm:justify-center gap-4 sm:gap-8 py-2 lg:py-0 border-y sm:border-y-0 border-slate-100">
            {/* Departure */}
            <div className="text-left">
              <span className="text-xl font-black text-slate-900">{bus.departureTime}</span>
              <p className="text-xs font-bold text-slate-600 truncate max-w-[90px] sm:max-w-[110px]">{bus.route.from}</p>
              <p className="text-[10px] text-slate-400">Boarding Point</p>
            </div>

            {/* Travel Line with Duration */}
            <div className="flex flex-col items-center justify-center px-2">
              <span className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> {bus.duration}
              </span>
              <div className="w-20 sm:w-28 h-0.5 bg-slate-300 relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-400 absolute -left-1"></div>
                <div className="w-2 h-2 rounded-full bg-red-600 absolute -right-1"></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">{bus.route.distanceKm} km</span>
            </div>

            {/* Arrival */}
            <div className="text-right">
              <span className="text-xl font-black text-slate-900">{bus.arrivalTime}</span>
              <p className="text-xs font-bold text-slate-600 truncate max-w-[90px] sm:max-w-[110px]">{bus.route.to}</p>
              <p className="text-[10px] text-slate-400">Next Day / Drop</p>
            </div>
          </div>

          {/* Accurate Pricing & Seat Selector CTA */}
          <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 shrink-0">
            <div className="text-left lg:text-right">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                {hasPriceRange ? 'Starts From' : 'Accurate Fare'}
              </span>
              <div className="flex items-center gap-1.5 lg:justify-end">
                <span className="text-xs text-slate-400 line-through">₹{minSeatPrice + 200}</span>
                <span className="text-2xl font-black text-red-600">₹{minSeatPrice}</span>
                {hasPriceRange && (
                  <span className="text-xs font-bold text-slate-500">to ₹{maxSeatPrice}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 lg:justify-end">
                <span className="inline-flex items-center gap-0.5 text-xs font-extrabold bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                  <Star className="w-3 h-3 fill-white" />
                  {bus.rating}
                </span>
                <span className="text-[11px] text-slate-400">({bus.reviewsCount})</span>
                <span className="text-[10px] text-slate-400 font-medium ml-1">+ 5% GST</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={onToggleExpand}
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                  isExpanded
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>{isExpanded ? 'Close Seat Selector' : `Select Seats (${availableSeatsCount} Available)`}</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Pick Interactive Seat Buttons directly on BusCard */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-500 text-[11px] flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-red-600" />
              <span>Quick Pick Seats:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {bus.seats
                .filter((s) => s.status === 'available' || selectedSeats.some((sel) => sel.id === s.id))
                .slice(0, 5)
                .map((seat) => {
                  const isSelected = selectedSeats.some((sel) => sel.id === seat.id);
                  return (
                    <motion.button
                      key={seat.id}
                      type="button"
                      onClick={() => onToggleSeat(seat)}
                      whileTap={{ scale: 0.92 }}
                      animate={{ scale: isSelected ? [0.94, 1.05, 1] : 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs ring-2 ring-emerald-300'
                          : 'bg-white border-emerald-600/70 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-700 shadow-2xs'
                      }`}
                      title={`Click to ${isSelected ? 'unselect' : 'select'} Seat ${seat.number} (₹${seat.price})`}
                    >
                      <AnimatePresence mode="wait">
                        {isSelected && (
                          <motion.span
                            key="check"
                            initial={{ scale: 0, rotate: -45, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <span>{seat.number}</span>
                      <span className={`text-[10px] font-medium ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                        ₹{seat.price}
                      </span>
                    </motion.button>
                  );
                })}
              <button
                type="button"
                onClick={onToggleExpand}
                className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline px-1 py-0.5 cursor-pointer ml-1"
              >
                {isExpanded ? 'Hide Layout' : `View Full Layout →`}
              </button>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 hidden md:inline">
            Click any seat to select / remove
          </span>
        </div>

        {/* Live Selected Seats Summary Ribbon on Card (shown when card is collapsed) */}
        {selectedSeats.length > 0 && !isExpanded && (
          <div className="py-2.5 px-4 sm:px-5 bg-red-50/90 border-t border-red-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-red-700">
                Selected {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedSeats.map((s) => (
                  <motion.button
                    key={s.id}
                    type="button"
                    onClick={() => onToggleSeat(s)}
                    whileTap={{ scale: 0.92 }}
                    animate={{ scale: [0.95, 1.05, 1] }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="font-extrabold text-emerald-800 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300 flex items-center gap-1 cursor-pointer hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-colors shadow-2xs"
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
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Total:</span>
                <span className="font-black text-red-600 text-sm">₹{selectedSeatsGrandTotal}</span>
                <span className="text-[10px] text-slate-500">(Includes GST)</span>
              </div>
              {onQuickPayNow && (
                <button
                  type="button"
                  onClick={() => onQuickPayNow(50)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Quick Pay</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Driver Snapshot Info strip */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Assigned Driver: <strong>{bus.driver.name}</strong> ({bus.driver.phone})</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline">License: {bus.driver.license}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-emerald-700">Driver Shift: {bus.driver.shift}</span>
          </div>
        </div>
      </div>

      {/* Expanded Interactive Seat Selector Drawer */}
      {isExpanded && (
        <SeatSelector
          bus={bus}
          selectedSeats={selectedSeats}
          onToggleSeat={onToggleSeat}
          selectedBoarding={selectedBoarding}
          setSelectedBoarding={setSelectedBoarding}
          selectedDropping={selectedDropping}
          setSelectedDropping={setSelectedDropping}
          onProceedToPassengers={onProceedToPassengers}
          onQuickPayNow={onQuickPayNow}
          onClose={onToggleExpand}
          travelDate={travelDate}
        />
      )}
    </div>
  );
};
