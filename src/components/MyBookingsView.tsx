import React, { useState } from 'react';
import { Booking, UserSession } from '../types';
import { 
  Ticket, 
  Download, 
  Printer, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Navigation, 
  XCircle, 
  FileText,
  Bus,
  RefreshCw
} from 'lucide-react';

interface MyBookingsViewProps {
  bookings: Booking[];
  user: UserSession | null;
  onOpenAuth: () => void;
  onSelectBookingForInvoice: (booking: Booking) => void;
  onCancelBooking: (pnr: string) => void;
  onSearchPnr: (pnr: string) => void;
  onBookNewBus: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  user,
  onOpenAuth,
  onSelectBookingForInvoice,
  onCancelBooking,
  onSearchPnr,
  onBookNewBus,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingPnr, setCancellingPnr] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    // Tab filter
    if (filterTab === 'upcoming' && b.status !== 'CONFIRMED') return false;
    if (filterTab === 'cancelled' && b.status !== 'CANCELLED') return false;
    if (filterTab === 'completed' && b.status !== 'COMPLETED') return false;

    // Search query filter (matches PNR, route from, route to, passenger name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchPnr = b.pnr.toLowerCase().includes(q);
      const matchRoute = b.route.from.toLowerCase().includes(q) || b.route.to.toLowerCase().includes(q);
      const matchPassenger = b.passengers.some((p) => p.name.toLowerCase().includes(q));
      return matchPnr || matchRoute || matchPassenger;
    }
    return true;
  });

  const handleCancelClick = (pnr: string) => {
    if (window.confirm(`Are you sure you want to cancel booking ${pnr}? A 90% refund will be credited to the original payment source.`)) {
      onCancelBooking(pnr);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                Customer Ledger
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Instant Receipt Downloads</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Bookings, Tickets & Past Invoices
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Access all your bus tickets, download official GST bills, track real-time bus status, and manage cancellations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBookNewBus}
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-red-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Bus className="w-4 h-4" />
              <span>Book New Journey</span>
            </button>
          </div>
        </div>

        {/* User login state reminder */}
        {!user && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Want to sync tickets booked with your mobile or Google account?
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenAuth}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
            >
              Sign In with OTP / Google
            </button>
          </div>
        )}

        {/* Search & Tabs Filter Row */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {[
              { id: 'all', label: 'All Trips' },
              { id: 'upcoming', label: 'Confirmed' },
              { id: 'completed', label: 'Past Receipts' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterTab === tab.id
                    ? 'bg-white text-red-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by PNR or City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">No Bookings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              You don't have any tickets under this filter. Search available buses to book your next trip!
            </p>
          </div>
          <button
            type="button"
            onClick={onBookNewBus}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-red-200 cursor-pointer inline-flex items-center gap-2"
          >
            <Bus className="w-4 h-4" />
            <span>Search & Book Buses</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 space-y-4"
            >
              {/* Top Row: PNR, Operator, Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{booking.operatorName}</span>
                      <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {booking.busNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">PNR: <strong className="text-slate-800">{booking.pnr}</strong></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {booking.status === 'CONFIRMED' && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-extrabold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Confirmed</span>
                    </span>
                  )}
                  {booking.status === 'CANCELLED' && (
                    <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-extrabold">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Cancelled / Refunded</span>
                    </span>
                  )}
                  {booking.status === 'COMPLETED' && (
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-extrabold">
                      <span>Completed</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Journey Route & Passengers */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Route & Timings */}
                <div className="md:col-span-6 space-y-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-lg font-black text-slate-900">{booking.departureTime}</span>
                      <p className="text-xs font-bold text-slate-700">{booking.route.from}</p>
                    </div>
                    <div className="flex-1 max-w-[120px] text-center">
                      <div className="h-0.5 bg-slate-300 relative my-2">
                        <div className="w-2 h-2 rounded-full bg-red-600 absolute right-0 -top-0.5"></div>
                      </div>
                      <span className="text-[10px] text-slate-400">{booking.travelDate}</span>
                    </div>
                    <div>
                      <span className="text-lg font-black text-slate-900">{booking.arrivalTime}</span>
                      <p className="text-xs font-bold text-slate-700">{booking.route.to}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Boarding: <strong>{booking.boardingPoint.location}</strong> ({booking.boardingPoint.landmark})
                  </p>
                </div>

                {/* Assigned Seats & Passenger summary */}
                <div className="md:col-span-3 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Assigned Seats</span>
                  <p className="font-extrabold text-red-600 text-sm">
                    {booking.passengers.map((p) => p.seatNumber).join(', ')}
                  </p>
                  <p className="text-slate-600">
                    {booking.passengers.map((p) => p.name).join(', ')}
                  </p>
                </div>

                {/* Amount Paid & Actions */}
                <div className="md:col-span-3 text-right space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Total Paid</span>
                    <p className="text-xl font-black text-slate-900">₹{booking.fareBreakdown.totalAmount}</p>
                    <p className="text-[10px] text-slate-400 font-mono">via {booking.payment.method}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Driver phone contact */}
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Driver: <strong>{booking.driver.name}</strong> ({booking.driver.phone})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectBookingForInvoice(booking)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Bill / Ticket</span>
                  </button>

                  {booking.status === 'CONFIRMED' && (
                    <button
                      type="button"
                      onClick={() => handleCancelClick(booking.pnr)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancel Ticket
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
