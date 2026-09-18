import React, { useState } from 'react';
import { Bus, BoardingPoint, DroppingPoint, Passenger, Seat, UserSession } from '../types';
import { 
  ArrowLeft, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface PassengerFormProps {
  bus: Bus;
  selectedSeats: Seat[];
  selectedBoarding: BoardingPoint;
  selectedDropping: DroppingPoint;
  travelDate: string;
  user: UserSession | null;
  onBack: () => void;
  onSubmit: (passengers: Passenger[], contact: { email: string; phone: string }, insuranceOpted: boolean) => void;
}

export const PassengerForm: React.FC<PassengerFormProps> = ({
  bus,
  selectedSeats,
  selectedBoarding,
  selectedDropping,
  travelDate,
  user,
  onBack,
  onSubmit,
}) => {
  // Initialize passenger list based on selected seats
  const [passengers, setPassengers] = useState<Passenger[]>(() =>
    selectedSeats.map((seat, index) => ({
      name: index === 0 && user?.name ? user.name : '',
      age: 25,
      gender: seat.status === 'female_reserved' ? 'Female' : 'Male',
      seatNumber: seat.number,
      seatType: seat.deck === 'upper' ? 'Upper Sleeper' : seat.deck === 'lower' ? 'Lower Sleeper' : 'Seater',
      fare: seat.price,
    }))
  );

  const [contactEmail, setContactEmail] = useState(user?.email || 'traveler@gmail.com');
  const [contactPhone, setContactPhone] = useState(user?.phone ? user.phone.replace('+91 ', '') : '9876543210');
  const [insuranceOpted, setInsuranceOpted] = useState(true);
  const [gstNumber, setGstNumber] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    passengers.forEach((p, i) => {
      if (!p.name || p.name.trim().length < 2) {
        newErrors[`name_${i}`] = 'Please enter passenger name';
      }
      if (!p.age || p.age < 1 || p.age > 110) {
        newErrors[`age_${i}`] = 'Enter valid age';
      }
    });

    if (!contactEmail || !contactEmail.includes('@')) {
      newErrors['email'] = 'Valid email is required for ticket PDF';
    }
    if (!contactPhone || contactPhone.replace(/[^0-9]/g, '').length < 10) {
      newErrors['phone'] = '10-digit mobile number required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(
      passengers,
      {
        email: contactEmail,
        phone: `+91 ${contactPhone.replace(/[^0-9]/g, '')}`,
      },
      insuranceOpted
    );
  };

  const baseFareTotal = passengers.reduce((sum, p) => sum + p.fare, 0);
  const gst = Math.round(baseFareTotal * 0.05 * 10) / 10;
  const insuranceAmount = insuranceOpted ? passengers.length * 15 : 0;
  const discount = baseFareTotal > 1500 ? 100 : 0;
  const grandTotal = baseFareTotal + gst + insuranceAmount - discount;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back to Results button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 font-bold text-sm mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Bus Results</span>
      </button>

      {/* Header Route Recap Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900 tracking-tight">
                {bus.route.from} → {bus.route.to}
              </span>
              <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                {bus.operatorName}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Date: <strong className="text-slate-800">{travelDate}</strong> • Departure: <strong className="text-slate-800">{bus.departureTime}</strong> • Duration: {bus.duration}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Seats Reserved</span>
            <p className="text-base font-extrabold text-red-600">
              {selectedSeats.map((s) => s.number).join(', ')} ({selectedSeats.length} Passenger{selectedSeats.length > 1 ? 's' : ''})
            </p>
          </div>
        </div>

        {/* Boarding and Dropping details recap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Boarding Point</span>
              <p className="font-bold text-slate-900 mt-0.5">{selectedBoarding.time} - {selectedBoarding.location}</p>
              <p className="text-slate-500 text-[11px]">{selectedBoarding.landmark}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Dropping Point</span>
              <p className="font-bold text-slate-900 mt-0.5">{selectedDropping.time} - {selectedDropping.location}</p>
              <p className="text-slate-500 text-[11px]">{selectedDropping.landmark}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={validateAndProceed} className="space-y-6">
        {/* Passenger Information Cards */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-red-600" />
              <span>Passenger Details</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter name as per government-issued ID card (Aadhaar, Driving License, Voter ID).
            </p>
          </div>

          <div className="space-y-4">
            {passengers.map((passenger, idx) => (
              <div
                key={`passenger-${idx}`}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-800">
                      Passenger {idx + 1}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold bg-white border border-slate-300 text-slate-800 px-2.5 py-1 rounded-lg">
                    Seat: {passenger.seatNumber} ({passenger.seatType}) • ₹{passenger.fare}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Name Input */}
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-semibold focus:outline-none focus:bg-white ${
                        errors[`name_${idx}`]
                          ? 'border-red-500 bg-red-50 text-red-900'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-red-600'
                      }`}
                    />
                    {errors[`name_${idx}`] && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors[`name_${idx}`]}
                      </p>
                    )}
                  </div>

                  {/* Age */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={110}
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(idx, 'age', parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  {/* Gender Selector */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Gender
                    </label>
                    <select
                      value={passenger.gender}
                      onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:border-red-600"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-600" />
              <span>Contact Details for Ticket & Invoice Delivery</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Your official GST invoice and PDF e-ticket will be dispatched via SMS, WhatsApp & Email.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email ID (for e-ticket & bill download) *</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-semibold focus:outline-none ${
                  errors['email'] ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-red-600'
                }`}
              />
              {errors['email'] && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors['email']}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Mobile Number (SMS / WhatsApp) *</span>
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:border-red-600">
                <span className="bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-600 border-r border-slate-300">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3 py-2.5 text-sm font-mono font-bold focus:outline-none"
                />
              </div>
              {errors['phone'] && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors['phone']}
                </p>
              )}
            </div>
          </div>

          {/* Travel Insurance Option */}
          <div className="pt-2">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 cursor-pointer">
              <input
                type="checkbox"
                checked={insuranceOpted}
                onChange={(e) => setInsuranceOpted(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="font-extrabold text-xs text-emerald-900">
                    Add Comprehensive BusGo Travel Insurance (₹15 / passenger)
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Coverage up to ₹5,00,000 for emergency medical, luggage loss, trip delays & accident protection.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Fare Summary & Checkout Action */}
        <div className="bg-white rounded-2xl p-6 border-2 border-red-200 shadow-lg">
          <h4 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Fare Breakdown</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Zero Hidden Charges
            </span>
          </h4>

          <div className="py-4 space-y-2.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Base Ticket Price ({passengers.length} seat{passengers.length > 1 ? 's' : ''}):</span>
              <span className="font-semibold text-slate-800">₹{baseFareTotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (CGST 2.5% + SGST 2.5%):</span>
              <span className="font-semibold text-slate-800">₹{gst}</span>
            </div>
            {insuranceOpted && (
              <div className="flex justify-between text-slate-600">
                <span>Travel Insurance ({passengers.length} × ₹15):</span>
                <span className="font-semibold text-slate-800">₹{insuranceAmount}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>BusGo First-Booking Discount:</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-slate-900 font-black text-lg pt-3 border-t border-slate-200">
              <span>Total Amount Payable:</span>
              <span className="text-2xl text-red-600">₹{grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 px-6 rounded-xl text-base shadow-lg shadow-red-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <CreditCard className="w-5 h-5" />
            <span>Proceed to Payment (UPI / Cards / Wallets)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
