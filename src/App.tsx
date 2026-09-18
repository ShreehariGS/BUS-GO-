/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  Booking, 
  DriverInfo, 
  Seat, 
  BoardingPoint, 
  DroppingPoint, 
  Passenger, 
  UserSession, 
  PaymentDetails,
  StateRTC 
} from './types';
import { INITIAL_BUSES, INITIAL_DRIVERS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { BusSearchHero } from './components/BusSearchHero';
import { BusFilters } from './components/BusFilters';
import { BusCard } from './components/BusCard';
import { PassengerForm } from './components/PassengerForm';
import { PaymentModal } from './components/PaymentModal';
import { TicketInvoiceModal } from './components/TicketInvoiceModal';
import { MyBookingsView } from './components/MyBookingsView';
import { AdminPortal } from './components/AdminPortal';
import { StateRTCView } from './components/StateRTCView';
import { AuthModal } from './components/AuthModal';
import { BusFront, RefreshCw, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { auth, db, testConnection, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'book' | 'my-bookings' | 'admin' | 'fleets'>('book');

  // Booking Flow Step: 'search' | 'passengers'
  const [bookingStep, setBookingStep] = useState<'search' | 'passengers'>('search');

  // User Authentication state
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('busgo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Search State
  const [fromCity, setFromCity] = useState('Bengaluru');
  const [toCity, setToCity] = useState('Hyderabad');
  const [travelDate, setTravelDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedRTC, setSelectedRTC] = useState('ALL');
  const [operatorTypeFilter, setOperatorTypeFilter] = useState('ALL');

  // Filters State
  const [busTypeFilter, setBusTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('price_asc');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [departureTimeSlot, setDepartureTimeSlot] = useState('ALL');

  // Live Data State
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [drivers, setDrivers] = useState<DriverInfo[]>(INITIAL_DRIVERS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Active Selection State for Booking - auto-expand first bus seat selector so it is immediately available
  const [expandedBusId, setExpandedBusId] = useState<string | null>(INITIAL_BUSES[0]?.id || null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedBoarding, setSelectedBoarding] = useState<BoardingPoint | null>(INITIAL_BUSES[0]?.boardingPoints[0] || null);
  const [selectedDropping, setSelectedDropping] = useState<DroppingPoint | null>(INITIAL_BUSES[0]?.droppingPoints[0] || null);
  const [activeBookingBus, setActiveBookingBus] = useState<Bus | null>(INITIAL_BUSES[0] || null);

  // Passenger & Payment Checkout State
  const [passengersToBook, setPassengersToBook] = useState<Passenger[]>([]);
  const [contactToBook, setContactToBook] = useState<{ email: string; phone: string }>({ email: '', phone: '' });
  const [insuranceOpted, setInsuranceOpted] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [totalAmountToPay, setTotalAmountToPay] = useState(0);

  // Active Modal for viewing / printing ticket & invoice
  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState<Booking | null>(null);

  // Fetch initial data from full-stack API
  const fetchBuses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromCity) params.append('from', fromCity);
      if (toCity) params.append('to', toCity);
      if (operatorTypeFilter !== 'ALL') params.append('operatorType', operatorTypeFilter);
      if (selectedRTC !== 'ALL') params.append('stateRTC', selectedRTC);
      if (busTypeFilter !== 'ALL') params.append('busType', busTypeFilter);
      params.append('sort', sortBy);

      const res = await fetch(`/api/buses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.buses) {
          setBuses(data.buses);
          if (data.buses.length > 0) {
            setExpandedBusId((prev) => (prev ? prev : data.buses[0].id));
            setSelectedBoarding((prev) => (prev ? prev : data.buses[0].boardingPoints[0]));
            setSelectedDropping((prev) => (prev ? prev : data.buses[0].droppingPoints[0]));
          }
        }
      }
    } catch {
      // Keep initial buses fallback if offline
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.bookings) {
          setBookings(data.bookings);
        }
      }
    } catch {
      // Fallback
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch('/api/admin/drivers');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.drivers) {
          setDrivers(data.drivers);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchBuses();
    fetchBookings();
    fetchDrivers();
    testConnection();

    // Listen to Firebase Auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser((prev) => {
          const updated: UserSession = {
            uid: fbUser.uid,
            name: fbUser.displayName || prev?.name || 'BusGo Passenger',
            email: fbUser.email || prev?.email || 'passenger@busgo.in',
            phone: fbUser.phoneNumber || prev?.phone || '+91 98765 43210',
            role: (fbUser.email?.includes('admin') || prev?.role === 'admin') ? 'admin' : 'passenger',
          };
          try {
            localStorage.setItem('busgo_user', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        setShowAuthModal(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time Firestore sync for user bookings
  useEffect(() => {
    if (!user?.uid) return;

    try {
      const userBookingsRef = collection(db, 'users', user.uid, 'bookings');
      const unsubscribeBookings = onSnapshot(userBookingsRef, (snapshot) => {
        const firestoreBookings = snapshot.docs.map((docSnap) => docSnap.data() as Booking);
        if (firestoreBookings.length > 0) {
          setBookings((prev) => {
            const map = new Map<string, Booking>();
            prev.forEach((b) => map.set(b.id, b));
            firestoreBookings.forEach((b) => map.set(b.id, b));
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt || b.bookedAt || 0).getTime() - new Date(a.createdAt || a.bookedAt || 0).getTime()
            );
          });
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}/bookings`);
      });

      return () => unsubscribeBookings();
    } catch (e) {
      console.warn('Firestore subscription failed', e);
    }
  }, [user?.uid]);

  // Sync user session to localStorage
  const handleLoginSuccess = (loggedInUser: UserSession) => {
    setUser(loggedInUser);
    try {
      localStorage.setItem('busgo_user', JSON.stringify(loggedInUser));
    } catch {}
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out note:', err);
    }
    setUser(null);
    localStorage.removeItem('busgo_user');
    setShowAuthModal(true);
  };

  // Toggle seat selection
  const handleToggleSeat = (bus: Bus, seat: Seat) => {
    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);
    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        alert('You can select a maximum of 6 seats in a single booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Proceed from seat selection to passenger form
  const handleProceedToPassengers = (bus: Bus) => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat before continuing.');
      return;
    }
    setActiveBookingBus(bus);
    setBookingStep('passengers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct Quick Pay (UPI / Net Banking / Cards) straight from the Seat Blueprint
  const handleDirectPayNow = (bus: Bus, couponDiscount: number = 0) => {
    if (selectedSeats.length === 0) return;
    setActiveBookingBus(bus);

    const passengers: Passenger[] = selectedSeats.map((seat, idx) => ({
      name: idx === 0 ? (user?.name || 'Primary Passenger') : `Passenger ${idx + 1}`,
      age: 28,
      gender: (seat.status === 'female_reserved' ? 'Female' : 'Male') as 'Male' | 'Female' | 'Other',
      seatNumber: seat.number,
      seatType: seat.deck === 'upper' ? 'Sleeper (Upper)' : (seat.deck === 'lower' ? 'Sleeper (Lower)' : 'Seater'),
      fare: seat.price,
    }));

    const baseFareTotal = passengers.reduce((sum, p) => sum + p.fare, 0);
    const gst = Math.round(baseFareTotal * 0.05 * 10) / 10;
    const discount = couponDiscount > 0 ? couponDiscount : (baseFareTotal > 1500 ? 50 : 0);
    const total = Math.max(0, Math.round(baseFareTotal + gst - discount));

    setPassengersToBook(passengers);
    setContactToBook({
      email: user?.email || 'shreeharigsofficial6@gmail.com',
      phone: user?.phone || '+91 98765 43210',
    });
    setInsuranceOpted(false);
    setTotalAmountToPay(total);
    setShowPaymentModal(true);
  };

  // Passenger form submission -> opens payment modal
  const handlePassengerSubmit = (
    passengers: Passenger[],
    contact: { email: string; phone: string },
    insurance: boolean
  ) => {
    if (!activeBookingBus) return;

    setPassengersToBook(passengers);
    setContactToBook(contact);
    setInsuranceOpted(insurance);

    const baseFareTotal = passengers.reduce((sum, p) => sum + p.fare, 0);
    const gst = Math.round(baseFareTotal * 0.05 * 10) / 10;
    const insuranceAmount = insurance ? passengers.length * 15 : 0;
    const discount = baseFareTotal > 1500 ? 100 : 0;
    const total = baseFareTotal + gst + insuranceAmount - discount;

    setTotalAmountToPay(total);
    setShowPaymentModal(true);
  };

  // Payment confirmation -> calls backend /api/bookings to generate PNR & invoice
  const handlePaymentSuccess = async (paymentDetails: PaymentDetails) => {
    if (!activeBookingBus) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: activeBookingBus.id,
          travelDate,
          boardingPoint: selectedBoarding || activeBookingBus.boardingPoints[0],
          droppingPoint: selectedDropping || activeBookingBus.droppingPoints[0],
          passengers: passengersToBook,
          contact: contactToBook,
          paymentMethod: paymentDetails.method,
          upiId: paymentDetails.upiId,
          cardLast4: paymentDetails.cardLast4,
          walletProvider: paymentDetails.walletProvider,
          insuranceOpted,
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        const newBooking: Booking = data.booking;
        
        // Save passenger booking directly into Firestore
        if (user?.uid) {
          const bookingWithUser = {
            ...newBooking,
            userId: user.uid,
          };
          try {
            await setDoc(doc(db, 'users', user.uid, 'bookings', newBooking.id), bookingWithUser);
            await setDoc(doc(db, 'bookings', newBooking.id), bookingWithUser);
          } catch (firestoreErr) {
            handleFirestoreError(firestoreErr, OperationType.WRITE, `users/${user.uid}/bookings/${newBooking.id}`);
          }
        }

        setBookings([newBooking, ...bookings]);
        setShowPaymentModal(false);
        setActiveInvoiceBooking(newBooking);
        setBookingStep('search');
        setSelectedSeats([]);
        setExpandedBusId(null);
        fetchBuses(); // Refresh seat counts
      }
    } catch (err) {
      alert('Error creating booking. Please try again.');
    }
  };

  // Cancel booking action
  const handleCancelBooking = async (pnr: string) => {
    try {
      const res = await fetch(`/api/bookings/${pnr}/cancel`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBookings(bookings.map((b) => (b.pnr === pnr ? data.booking : b)));
        alert(`Booking ${pnr} has been cancelled. Refund of ₹${data.refundAmount} initiated.`);
        fetchBuses();
      }
    } catch {
      alert('Cancellation failed.');
    }
  };

  // Admin Route Management Handlers
  const handleUpdateBusStatus = async (busId: string, status: Bus['status']) => {
    try {
      const res = await fetch(`/api/admin/buses/${busId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success && data.bus) {
        setBuses(buses.map((b) => (b.id === busId ? data.bus : b)));
      }
    } catch {
      setBuses(buses.map((b) => (b.id === busId ? { ...b, status } : b)));
    }
  };

  const handleUpdateBusFare = async (busId: string, newFare: number) => {
    try {
      const res = await fetch(`/api/admin/buses/${busId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseFare: newFare }),
      });
      const data = await res.json();
      if (data.success && data.bus) {
        setBuses(buses.map((b) => (b.id === busId ? data.bus : b)));
      }
    } catch {
      setBuses(buses.map((b) => (b.id === busId ? { ...b, baseFare: newFare } : b)));
    }
  };

  const handleCreateBusRoute = async (busData: any) => {
    try {
      const res = await fetch('/api/admin/buses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(busData),
      });
      const data = await res.json();
      if (data.success && data.bus) {
        setBuses([data.bus, ...buses]);
        alert(`Bus Route ${busData.from} → ${busData.to} deployed to live system!`);
      }
    } catch {
      // Fallback
    }
  };

  const handleUpdateDriverStatus = async (
    driverId: string,
    status: DriverInfo['status'],
    shift: DriverInfo['shift']
  ) => {
    try {
      const res = await fetch(`/api/admin/drivers/${driverId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, shift }),
      });
      const data = await res.json();
      if (data.success && data.driver) {
        setDrivers(drivers.map((d) => (d.id === driverId ? data.driver : d)));
      }
    } catch {
      setDrivers(drivers.map((d) => (d.id === driverId ? { ...d, status, shift } : d)));
    }
  };

  // Toggle amenity in filters
  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Filter and sort buses for the search view
  const displayedBuses = buses.filter((bus) => {
    // Departure slot
    if (departureTimeSlot !== 'ALL') {
      const hour = parseInt(bus.departureTime.split(':')[0]);
      if (departureTimeSlot === 'morning' && (hour < 6 || hour >= 12)) return false;
      if (departureTimeSlot === 'afternoon' && (hour < 12 || hour >= 18)) return false;
      if (departureTimeSlot === 'evening' && (hour < 18 || hour >= 22)) return false;
      if (departureTimeSlot === 'night' && (hour >= 6 && hour < 22)) return false;
    }

    // Amenities
    if (selectedAmenities.length > 0) {
      const hasAll = selectedAmenities.every((a) => bus.amenities.includes(a));
      if (!hasAll) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-red-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setBookingStep('search');
        }}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        bookingsCount={bookings.length}
      />

      {/* Main Content Area based on currentTab */}
      <main className="flex-1">
        {currentTab === 'book' && (
          <div>
            {bookingStep === 'search' ? (
              <>
                {/* Search Hero */}
                <BusSearchHero
                  fromCity={fromCity}
                  setFromCity={setFromCity}
                  toCity={toCity}
                  setToCity={setToCity}
                  travelDate={travelDate}
                  setTravelDate={setTravelDate}
                  selectedRTC={selectedRTC}
                  setSelectedRTC={(rtc) => {
                    setSelectedRTC(rtc);
                    fetchBuses();
                  }}
                  operatorTypeFilter={operatorTypeFilter}
                  setOperatorTypeFilter={(type) => {
                    setOperatorTypeFilter(type);
                    fetchBuses();
                  }}
                  onSearch={fetchBuses}
                />

                {/* Results Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {/* Buses Available Highlight Header */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-200 uppercase tracking-wide">
                            <BusFront className="w-3.5 h-3.5" />
                            {displayedBuses.length} Buses Available
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>
                              {displayedBuses.reduce(
                                (sum, b) =>
                                  sum +
                                  b.seats.filter((s) => s.status === 'available' || s.status === 'female_reserved').length,
                                0
                              )}{' '}
                              Seats Open
                            </span>
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                          <span>Buses Available on</span>
                          <span className="text-red-600 font-extrabold">{fromCity} → {toCity}</span>
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Travel Date: <strong>{travelDate}</strong> • Real-time live seat inventory and transparent pricing
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={fetchBuses}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-red-600 ${loading ? 'animate-spin' : ''}`} />
                          <span>Refresh Bus Availability</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mr-1">Quick Select:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setBusTypeFilter('ALL');
                          setOperatorTypeFilter('ALL');
                          setSelectedRTC('ALL');
                          fetchBuses();
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                          busTypeFilter === 'ALL' && operatorTypeFilter === 'ALL'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        All Buses ({buses.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBusTypeFilter('Sleeper');
                          fetchBuses();
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                          busTypeFilter === 'Sleeper'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        AC Sleeper Berths
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBusTypeFilter('Semi-Sleeper');
                          fetchBuses();
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                          busTypeFilter === 'Semi-Sleeper'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Luxury Seater / Semi-Sleeper
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOperatorTypeFilter('RTC');
                          fetchBuses();
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                          operatorTypeFilter === 'RTC'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Government State RTCs
                      </button>
                    </div>
                  </div>

                  {/* 2-Column Layout: Filters (Left) + Bus Cards List (Right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-4 sticky top-22">
                      <BusFilters
                        busTypeFilter={busTypeFilter}
                        setBusTypeFilter={(type) => {
                          setBusTypeFilter(type);
                          fetchBuses();
                        }}
                        sortBy={sortBy}
                        setSortBy={(sort) => {
                          setSortBy(sort);
                          fetchBuses();
                        }}
                        selectedAmenities={selectedAmenities}
                        toggleAmenity={toggleAmenity}
                        departureTimeSlot={departureTimeSlot}
                        setDepartureTimeSlot={setDepartureTimeSlot}
                        onReset={() => {
                          setBusTypeFilter('ALL');
                          setSortBy('price_asc');
                          setSelectedAmenities([]);
                          setDepartureTimeSlot('ALL');
                          setSelectedRTC('ALL');
                          setOperatorTypeFilter('ALL');
                          fetchBuses();
                        }}
                      />
                    </div>

                    {/* Bus Cards List */}
                    <div className="lg:col-span-8 space-y-4">
                      {displayedBuses.length === 0 ? (
                        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
                          <BusFront className="w-12 h-12 text-slate-300 mx-auto" />
                          <h3 className="text-base font-extrabold text-slate-800">No Buses Matching Your Search</h3>
                          <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Try broadening your filters, or search popular routes like Bengaluru → Hyderabad or Delhi → Jaipur.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setFromCity('Bengaluru');
                              setToCity('Hyderabad');
                              fetchBuses();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                          >
                            View Bengaluru → Hyderabad Buses
                          </button>
                        </div>
                      ) : (
                        displayedBuses.map((bus) => {
                          const isExpanded = expandedBusId === bus.id;
                          return (
                            <BusCard
                              key={bus.id}
                              bus={bus}
                              isExpanded={isExpanded}
                              onToggleExpand={() => {
                                if (isExpanded) {
                                  setExpandedBusId(null);
                                  setSelectedSeats([]);
                                } else {
                                  setExpandedBusId(bus.id);
                                  setSelectedSeats([]);
                                  setSelectedBoarding(bus.boardingPoints[0]);
                                  setSelectedDropping(bus.droppingPoints[0]);
                                }
                              }}
                              selectedSeats={expandedBusId === bus.id ? selectedSeats : []}
                              onToggleSeat={(seat) => handleToggleSeat(bus, seat)}
                              selectedBoarding={selectedBoarding || bus.boardingPoints[0]}
                              setSelectedBoarding={setSelectedBoarding}
                              selectedDropping={selectedDropping || bus.droppingPoints[0]}
                              setSelectedDropping={setSelectedDropping}
                              onProceedToPassengers={() => handleProceedToPassengers(bus)}
                              onQuickPayNow={(couponDiscount) => handleDirectPayNow(bus, couponDiscount)}
                              travelDate={travelDate}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Step 2: Passenger Details Form */
              activeBookingBus && (
                <PassengerForm
                  bus={activeBookingBus}
                  selectedSeats={selectedSeats}
                  selectedBoarding={selectedBoarding || activeBookingBus.boardingPoints[0]}
                  selectedDropping={selectedDropping || activeBookingBus.droppingPoints[0]}
                  travelDate={travelDate}
                  user={user}
                  onBack={() => setBookingStep('search')}
                  onSubmit={handlePassengerSubmit}
                />
              )
            )}
          </div>
        )}

        {/* Tab 2: My Bookings & Receipts View */}
        {currentTab === 'my-bookings' && (
          <MyBookingsView
            bookings={bookings}
            user={user}
            onOpenAuth={() => setShowAuthModal(true)}
            onSelectBookingForInvoice={(booking) => setActiveInvoiceBooking(booking)}
            onCancelBooking={handleCancelBooking}
            onSearchPnr={(pnr) => {}}
            onBookNewBus={() => {
              setCurrentTab('book');
              setBookingStep('search');
            }}
          />
        )}

        {/* Tab 3: State RTC Unified Directory */}
        {currentTab === 'fleets' && (
          <StateRTCView
            onSelectRTC={(rtc) => {
              setSelectedRTC(rtc);
              setOperatorTypeFilter('RTC');
              setCurrentTab('book');
              setBookingStep('search');
              fetchBuses();
            }}
          />
        )}

        {/* Tab 4: Admin Portal */}
        {currentTab === 'admin' && (
          <AdminPortal
            buses={buses}
            drivers={drivers}
            bookings={bookings}
            onUpdateBusStatus={handleUpdateBusStatus}
            onUpdateBusFare={handleUpdateBusFare}
            onCreateBusRoute={handleCreateBusRoute}
            onUpdateDriverStatus={handleUpdateDriverStatus}
            onSelectBookingForInvoice={(booking) => setActiveInvoiceBooking(booking)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-8 px-4 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-red-600">bus<span className="text-slate-900">go</span></span>
            <span>• All-India Inter-State & RTC Bus Ticketing Network</span>
          </div>
          <p className="text-center sm:text-right">
            Official ticketing partner for KSRTC, TSRTC, APSRTC, MSRTC, Kerala RTC & top verified private fleets.
          </p>
        </div>
      </footer>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        totalAmount={totalAmountToPay}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Official E-Ticket & GST Invoice Modal */}
      {activeInvoiceBooking && (
        <TicketInvoiceModal
          booking={activeInvoiceBooking}
          isOpen={!!activeInvoiceBooking}
          onClose={() => setActiveInvoiceBooking(null)}
          onViewMyBookings={() => {
            setActiveInvoiceBooking(null);
            setCurrentTab('my-bookings');
          }}
        />
      )}

      {/* Mandatory Auth Gate & Firebase Account Modal */}
      <AuthModal
        isOpen={!user || showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleLoginSuccess}
        currentUser={user}
      />
    </div>
  );
}
