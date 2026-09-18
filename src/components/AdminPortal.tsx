import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  DriverInfo, 
  Booking, 
  AdminAnalytics, 
  StateRTC, 
  OperatorType, 
  BusLayoutType 
} from '../types';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  UserCheck, 
  DollarSign, 
  FileText, 
  ArrowRight,
  Sparkles,
  Phone,
  RefreshCw,
  Search,
  Filter,
  Bus as BusIcon
} from 'lucide-react';
import { POPULAR_INDIAN_CITIES } from '../data/initialData';

interface AdminPortalProps {
  buses: Bus[];
  drivers: DriverInfo[];
  bookings: Booking[];
  onUpdateBusStatus: (busId: string, status: Bus['status']) => void;
  onUpdateBusFare: (busId: string, newFare: number) => void;
  onCreateBusRoute: (busData: any) => void;
  onUpdateDriverStatus: (driverId: string, status: DriverInfo['status'], shift: DriverInfo['shift']) => void;
  onSelectBookingForInvoice: (booking: Booking) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  buses,
  drivers,
  bookings,
  onUpdateBusStatus,
  onUpdateBusFare,
  onCreateBusRoute,
  onUpdateDriverStatus,
  onSelectBookingForInvoice,
}) => {
  const [adminTab, setAdminTab] = useState<'analytics' | 'routes' | 'drivers' | 'manifest'>('analytics');

  // New Bus Route Form Modal State
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [newOperatorName, setNewOperatorName] = useState('KSRTC Airavat Club Class');
  const [newOperatorType, setNewOperatorType] = useState<OperatorType>('RTC');
  const [newStateRTC, setNewStateRTC] = useState<StateRTC>('KSRTC');
  const [newFromCity, setNewFromCity] = useState('Bengaluru');
  const [newToCity, setNewToCity] = useState('Goa');
  const [newDistance, setNewDistance] = useState('560');
  const [newDeptTime, setNewDeptTime] = useState('22:00');
  const [newArrTime, setNewArrTime] = useState('08:30');
  const [newDuration, setNewDuration] = useState('10h 30m');
  const [newBusType, setNewBusType] = useState<BusLayoutType>('AC Sleeper 2+1');
  const [newFare, setNewFare] = useState('1250');
  const [newDriverId, setNewDriverId] = useState(drivers[0]?.id || 'DRV-101');

  // Analytics Computation
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.fareBreakdown.totalAmount, 0);
  const totalSeats = buses.reduce((sum, b) => sum + b.seats.length, 0);
  const totalBookedSeats = buses.reduce((sum, b) => sum + b.seats.filter((s) => s.status === 'booked').length, 0);
  const occupancyRate = totalSeats > 0 ? Math.round((totalBookedSeats / totalSeats) * 100) : 0;
  const rtcBookingsCount = confirmedBookings.filter((b) => b.operatorType === 'RTC').length;
  const rtcShare = confirmedBookings.length > 0 ? Math.round((rtcBookingsCount / confirmedBookings.length) * 100) : 50;

  const handleAddBusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateBusRoute({
      operatorName: newOperatorName,
      operatorType: newOperatorType,
      stateRTC: newOperatorType === 'RTC' ? newStateRTC : undefined,
      from: newFromCity,
      to: newToCity,
      distanceKm: parseInt(newDistance) || 450,
      departureTime: newDeptTime,
      arrivalTime: newArrTime,
      duration: newDuration,
      busType: newBusType,
      baseFare: parseInt(newFare) || 1000,
      driverId: newDriverId,
    });
    setShowAddBusModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                Admin Control Room
              </span>
              <span className="text-xs text-slate-400 font-mono">• All-India Unified Fleet Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Fleet Management & Booking Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Monitor real-time passenger manifests, update bus route availability, adjust live tariffs, and schedule driver shifts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddBusModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-red-900 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Bus Route</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-6">
          {[
            { id: 'analytics' as const, label: 'Live Analytics & Occupancy', icon: TrendingUp },
            { id: 'routes' as const, label: `Routes & Fleet Availability (${buses.length})`, icon: BusIcon },
            { id: 'drivers' as const, label: `Driver Schedule & Rosters (${drivers.length})`, icon: UserCheck },
            { id: 'manifest' as const, label: `Passenger Bookings (${bookings.length})`, icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAdminTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Analytics & Metrics */}
      {adminTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Network Revenue</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</span>
                <span className="text-xs font-bold text-emerald-600">+18% today</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">From confirmed online bookings & GST ledger</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Confirmed Bookings</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-slate-900">{confirmedBookings.length}</span>
                <span className="text-xs font-semibold text-slate-400">tickets issued</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Active PNR tickets generated</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Fleet Occupancy</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-red-600">{occupancyRate}%</span>
                <span className="text-xs font-semibold text-slate-500">of capacity</span>
              </div>
              {/* Mini progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: `${occupancyRate}%` }} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Fleet on Road</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-emerald-700">
                  {buses.filter((b) => b.status === 'ACTIVE').length} / {buses.length}
                </span>
                <span className="text-xs font-bold text-emerald-600">Buses Live</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Interstate RTC & Private fleets active</p>
            </div>
          </div>

          {/* Sector Breakdown & Route Popularity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Government RTC vs Private Ratio */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Unified Sector Share</h3>
              <p className="text-xs text-slate-500">
                Ticket volume split between State Transport Undertakings (RTCs) and Verified Private Operators.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-red-700">State RTCs (KSRTC, TSRTC, APSRTC, etc.):</span>
                    <span>{rtcShare}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-3 rounded-full" style={{ width: `${rtcShare}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">Private Luxury Fleets (Zingbus, VRL, IntrCity):</span>
                    <span>{100 - rtcShare}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-slate-800 h-3 rounded-full" style={{ width: `${100 - rtcShare}%` }} />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800">Operational Insight:</span>
                <p>
                  Night Express Sleeper services running between Bengaluru-Hyderabad and Delhi-Jaipur maintain the highest yields.
                </p>
              </div>
            </div>

            {/* Top Routes Revenue List */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Top Revenue Generating Bus Routes</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Route</th>
                      <th className="py-2.5 px-3">Fleet Type</th>
                      <th className="py-2.5 px-3 text-right">Distance</th>
                      <th className="py-2.5 px-3 text-right">Base Fare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {buses.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-extrabold text-slate-900">
                          {b.route.from} ➔ {b.route.to}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.operatorType === 'RTC' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {b.operatorName}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-500 font-mono">{b.route.distanceKm} km</td>
                        <td className="py-3 px-3 text-right font-black text-slate-900">₹{b.baseFare}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Route & Bus Management */}
      {adminTab === 'routes' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Live Fleet Availability & Route Controls</h3>
              <p className="text-xs text-slate-500">Update real-time bus operation status, tariffs, and route timetables.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddBusModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Bus Route</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buses.map((bus) => {
              const bookedSeats = bus.seats.filter((s) => s.status === 'booked').length;
              return (
                <div
                  key={bus.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="font-extrabold text-base text-slate-900">{bus.operatorName}</span>
                      <p className="text-xs font-mono text-slate-500">Reg: {bus.busNumber} • {bus.busType}</p>
                    </div>
                    {/* Status Badge */}
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                        bus.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : bus.status === 'DELAYED'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      ● {bus.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Route</span>
                      <p className="font-bold text-slate-800">{bus.route.from} → {bus.route.to}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Timings</span>
                      <p className="font-bold text-slate-800">{bus.departureTime} - {bus.arrivalTime}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Occupancy</span>
                      <p className="font-bold text-red-600">{bookedSeats} / {bus.seats.length} booked</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-500">Base Fare:</span>
                      <strong className="text-slate-900">₹{bus.baseFare}</strong>
                      <button
                        type="button"
                        onClick={() => {
                          const newFare = prompt(`Enter new base fare for ${bus.busNumber}:`, bus.baseFare.toString());
                          if (newFare && !isNaN(Number(newFare))) {
                            onUpdateBusFare(bus.id, Number(newFare));
                          }
                        }}
                        className="text-red-600 text-xs font-bold hover:underline ml-1 cursor-pointer"
                      >
                        Edit Fare
                      </button>
                    </div>

                    {/* Status Change Buttons */}
                    <div className="flex items-center gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => onUpdateBusStatus(bus.id, 'ACTIVE')}
                        className={`px-2 py-1 rounded-lg font-bold ${
                          bus.status === 'ACTIVE' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateBusStatus(bus.id, 'DELAYED')}
                        className={`px-2 py-1 rounded-lg font-bold ${
                          bus.status === 'DELAYED' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Delayed
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateBusStatus(bus.id, 'MAINTENANCE')}
                        className={`px-2 py-1 rounded-lg font-bold ${
                          bus.status === 'MAINTENANCE' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Maintenance
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Driver Schedule & Rosters */}
      {adminTab === 'drivers' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Driver Schedules & Duty Rosters</h3>
              <p className="text-xs text-slate-500">Commercial heavy vehicle license verification & real-time duty status.</p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl">
              Total Drivers: {drivers.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{driver.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{driver.id}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                    ★ {driver.rating}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <strong className="text-slate-800">{driver.phone}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">DL Number:</span>
                    <strong className="text-slate-800 font-mono">{driver.license}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Shift Time:</span>
                    <strong className="text-slate-800">{driver.shift}</strong>
                  </p>
                </div>

                {/* Duty Status Selector */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">Duty Status:</span>
                  <div className="flex items-center gap-1">
                    {(['On Duty', 'En Route', 'Resting'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => onUpdateDriverStatus(driver.id, st, driver.shift)}
                        className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          driver.status === st
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Customer Passenger Bookings Manifest */}
      {adminTab === 'manifest' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Network Passenger Manifest</h3>
              <p className="text-xs text-slate-500">Every confirmed transaction with GST invoice and seat allocation.</p>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
              {bookings.length} Bookings Recorded
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">PNR</th>
                    <th className="py-3 px-4">Route & Date</th>
                    <th className="py-3 px-4">Operator & Bus</th>
                    <th className="py-3 px-4">Passengers & Seats</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-black text-red-600">{b.pnr}</td>
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900">{b.route.from} ➔ {b.route.to}</span>
                        <p className="text-[11px] text-slate-500">{b.travelDate} ({b.departureTime})</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{b.operatorName}</span>
                        <p className="text-[11px] font-mono text-slate-500">{b.busNumber}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {b.passengers.map((p, i) => (
                            <div key={i} className="text-slate-700">
                              <strong>{p.name}</strong> ({p.seatNumber})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900">₹{b.fareBreakdown.totalAmount}</span>
                        <p className="text-[10px] text-slate-500 font-mono">{b.payment.method}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectBookingForInvoice(b)}
                          className="text-red-600 font-bold hover:underline text-xs cursor-pointer"
                        >
                          View Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Bus Route Modal */}
      {showAddBusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden">
            <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-extrabold text-base">Add New Bus Route to Fleet</h3>
              <button
                type="button"
                onClick={() => setShowAddBusModal(false)}
                className="p-1 rounded-full hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBusSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Operator Name</label>
                <input
                  type="text"
                  value={newOperatorName}
                  onChange={(e) => setNewOperatorName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sector Type</label>
                  <select
                    value={newOperatorType}
                    onChange={(e) => setNewOperatorType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="RTC">Government State RTC</option>
                    <option value="PRIVATE">Private Verified Fleet</option>
                  </select>
                </div>
                {newOperatorType === 'RTC' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State RTC</label>
                    <select
                      value={newStateRTC}
                      onChange={(e) => setNewStateRTC(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    >
                      <option value="KSRTC">KSRTC (Karnataka)</option>
                      <option value="TSRTC">TSRTC (Telangana)</option>
                      <option value="APSRTC">APSRTC (Andhra)</option>
                      <option value="MSRTC">MSRTC (Maharashtra)</option>
                      <option value="Kerala RTC">Kerala RTC (Kerala)</option>
                      <option value="UPSRTC">UPSRTC (Uttar Pradesh)</option>
                      <option value="RSRTC">RSRTC (Rajasthan)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">From City</label>
                  <input
                    type="text"
                    value={newFromCity}
                    onChange={(e) => setNewFromCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">To City</label>
                  <input
                    type="text"
                    value={newToCity}
                    onChange={(e) => setNewToCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departure</label>
                  <input
                    type="time"
                    value={newDeptTime}
                    onChange={(e) => setNewDeptTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Arrival</label>
                  <input
                    type="time"
                    value={newArrTime}
                    onChange={(e) => setNewArrTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Base Fare (₹)</label>
                  <input
                    type="number"
                    value={newFare}
                    onChange={(e) => setNewFare(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Seat Layout & Category</label>
                <select
                  value={newBusType}
                  onChange={(e) => setNewBusType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  <option value="AC Sleeper 2+1">AC Sleeper 2+1 (Upper & Lower Berths)</option>
                  <option value="Volvo Multi-Axle Semi-Sleeper">Volvo Multi-Axle Semi-Sleeper (2+2)</option>
                  <option value="Electric AC Sleeper">Electric AC Sleeper (Eco-Friendly)</option>
                  <option value="Non-AC Seater">Non-AC Seater Standard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assign Driver</label>
                <select
                  value={newDriverId}
                  onChange={(e) => setNewDriverId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.phone} • {d.shift})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBusModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs"
                >
                  Deploy Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
