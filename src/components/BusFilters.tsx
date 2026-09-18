import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Clock, Zap, ShieldCheck } from 'lucide-react';

interface BusFiltersProps {
  busTypeFilter: string;
  setBusTypeFilter: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedAmenities: string[];
  toggleAmenity: (amenity: string) => void;
  departureTimeSlot: string;
  setDepartureTimeSlot: (slot: string) => void;
  onReset: () => void;
}

export const BusFilters: React.FC<BusFiltersProps> = ({
  busTypeFilter,
  setBusTypeFilter,
  sortBy,
  setSortBy,
  selectedAmenities,
  toggleAmenity,
  departureTimeSlot,
  setDepartureTimeSlot,
  onReset,
}) => {
  const amenitiesList = [
    'WiFi',
    'Charging Point',
    'Water Bottle',
    'Blanket',
    'Live GPS Tracking',
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
          <Filter className="w-4 h-4 text-red-600" />
          <span>Filter & Refine</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Sort By</span>
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white"
        >
          <option value="price_asc">Price: Lowest First (₹)</option>
          <option value="price_desc">Price: Highest First (₹)</option>
          <option value="rating">Passenger Rating (High to Low)</option>
          <option value="departure_early">Departure Time (Earliest First)</option>
        </select>
      </div>

      {/* Bus Layout / Seat Category */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>Seat & Bus Format</span>
        </label>
        <div className="space-y-1.5">
          {[
            { label: 'All Bus Types', value: 'ALL' },
            { label: 'AC Sleeper Berths (2+1)', value: 'Sleeper' },
            { label: 'Volvo / Scania Semi-Sleeper', value: 'Semi-Sleeper' },
            { label: 'Electric EV Eco Bus', value: 'Electric' },
            { label: 'Standard Seater', value: 'Seater' },
          ].map((item) => (
            <label
              key={item.value}
              className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                busTypeFilter === item.value
                  ? 'bg-red-50 text-red-700 border border-red-200 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{item.label}</span>
              <input
                type="radio"
                name="bus-type"
                checked={busTypeFilter === item.value}
                onChange={() => setBusTypeFilter(item.value)}
                className="text-red-600 focus:ring-red-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time Slots */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Departure Timing</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'Morning (6 AM - 12 PM)', value: 'morning' },
            { label: 'Afternoon (12 PM - 6 PM)', value: 'afternoon' },
            { label: 'Evening (6 PM - 10 PM)', value: 'evening' },
            { label: 'Night Owl (10 PM - 6 AM)', value: 'night' },
          ].map((slot) => (
            <button
              key={slot.value}
              type="button"
              onClick={() => setDepartureTimeSlot(departureTimeSlot === slot.value ? 'ALL' : slot.value)}
              className={`p-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                departureTimeSlot === slot.value
                  ? 'bg-red-600 text-white border-red-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-slate-400" />
          <span>Key Amenities</span>
        </label>
        <div className="space-y-1.5">
          {amenitiesList.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAmenity(amenity)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Government RTC Guarantee Card */}
      <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-xl p-3.5 border border-red-100 text-xs">
        <div className="flex items-center gap-1.5 text-red-800 font-bold mb-1">
          <ShieldCheck className="w-4 h-4 text-red-600" />
          <span>Official RTC Verification</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-tight">
          Direct sync with State RTC reservation servers: KSRTC, TSRTC, APSRTC, and MSRTC. Zero booking surcharge.
        </p>
      </div>
    </div>
  );
};
