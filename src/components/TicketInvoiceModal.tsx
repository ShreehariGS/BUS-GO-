import React from 'react';
import { Booking } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Bus, 
  ShieldCheck, 
  QrCode, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  Copy, 
  Share2, 
  FileText 
} from 'lucide-react';

interface TicketInvoiceModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onViewMyBookings: () => void;
}

export const TicketInvoiceModal: React.FC<TicketInvoiceModalProps> = ({
  booking,
  isOpen,
  onClose,
  onViewMyBookings,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPnr = () => {
    navigator.clipboard.writeText(booking.pnr);
    alert(`PNR ${booking.pnr} copied to clipboard!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden my-6">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">Booking Confirmed & Invoice Issued</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket / Bill Invoice Container */}
        <div className="p-6 sm:p-8 space-y-6 ticket-print-container">
          {/* Official Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-red-600 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-200">
                <Bus className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black tracking-tight text-red-600">bus<span className="text-slate-900">go</span></span>
                  <span className="text-[10px] uppercase font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                    Official E-Ticket
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold">
                  GST Tax Invoice & Passenger Boarding Pass
                </p>
              </div>
            </div>

            {/* PNR & QR Code Box */}
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PNR NUMBER</span>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-xl font-black font-mono text-red-600 tracking-wider">
                    {booking.pnr}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPnr}
                    className="no-print text-slate-400 hover:text-red-600"
                    title="Copy PNR"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Invoice: INV-{booking.id.slice(-6)}</p>
              </div>
              <div className="w-14 h-14 bg-white border border-slate-300 rounded-xl flex items-center justify-center p-1">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
            </div>
          </div>

          {/* Journey & Operator Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-red-50/40 p-4 rounded-2xl border border-red-100">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Bus Operator & Type</span>
              <p className="font-extrabold text-sm text-slate-900">{booking.operatorName}</p>
              <p className="text-xs font-mono text-red-700 mt-0.5 font-bold">Bus No: {booking.busNumber}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Route & Date</span>
              <p className="font-extrabold text-sm text-slate-900">{booking.route.from} → {booking.route.to}</p>
              <p className="text-xs text-slate-600 mt-0.5 font-semibold">Travel Date: {booking.travelDate}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Assigned Driver & Helpline</span>
              <p className="font-extrabold text-sm text-slate-900">{booking.driver.name}</p>
              <p className="text-xs text-slate-600 font-mono mt-0.5">{booking.driver.phone}</p>
            </div>
          </div>

          {/* Boarding and Dropping Detailed Timelines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Boarding Point */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Boarding Station</span>
              </div>
              <p className="text-base font-black text-slate-900">
                {booking.departureTime} • {booking.boardingPoint.location}
              </p>
              <p className="text-xs text-slate-500">{booking.boardingPoint.landmark}</p>
              <p className="text-[11px] text-amber-700 font-semibold pt-1">
                * Please report at least 15 minutes before departure.
              </p>
            </div>

            {/* Dropping Point */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Dropping Station</span>
              </div>
              <p className="text-base font-black text-slate-900">
                {booking.arrivalTime} • {booking.droppingPoint.location}
              </p>
              <p className="text-xs text-slate-500">{booking.droppingPoint.landmark}</p>
            </div>
          </div>

          {/* Passenger Manifest Table */}
          <div>
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Passenger Manifest & Assigned Berths / Seats
            </span>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Passenger Name</th>
                    <th className="py-2.5 px-3">Age / Gender</th>
                    <th className="py-2.5 px-3">Seat Number</th>
                    <th className="py-2.5 px-3">Seat Type</th>
                    <th className="py-2.5 px-3 text-right">Fare (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {booking.passengers.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-extrabold text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{p.age} Yrs / {p.gender}</td>
                      <td className="py-2.5 px-3 font-mono font-black text-red-600">{p.seatNumber}</td>
                      <td className="py-2.5 px-3 text-slate-600">{p.seatType}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹{p.fare}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fare & GST Breakdown */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Payment Confirmation</span>
              <p className="text-slate-600">
                Payment Mode: <strong className="text-slate-900">{booking.payment.method}</strong>
              </p>
              <p className="text-slate-600 font-mono text-[11px]">
                Txn ID: {booking.payment.transactionId}
              </p>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PAID IN FULL • NO DUES PENDING</span>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Base Fare Total:</span>
                <span className="font-semibold text-slate-900">₹{booking.fareBreakdown.baseFareTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (2.5%):</span>
                <span className="font-semibold text-slate-900">₹{Math.round((booking.fareBreakdown.gst / 2) * 10) / 10}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (2.5%):</span>
                <span className="font-semibold text-slate-900">₹{Math.round((booking.fareBreakdown.gst / 2) * 10) / 10}</span>
              </div>
              {booking.fareBreakdown.insurance > 0 && (
                <div className="flex justify-between">
                  <span>Travel Insurance:</span>
                  <span className="font-semibold text-slate-900">₹{booking.fareBreakdown.insurance}</span>
                </div>
              )}
              {booking.fareBreakdown.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Special Discount:</span>
                  <span>-₹{booking.fareBreakdown.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-300">
                <span>Total Amount Paid:</span>
                <span className="text-red-600 text-base">₹{booking.fareBreakdown.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Terms & Important Notes */}
          <div className="text-[10px] text-slate-400 space-y-1 border-t border-slate-200 pt-4">
            <p>1. This is a computer-generated tax invoice and valid transit boarding document under Indian Motor Vehicles Act.</p>
            <p>2. Please carry a valid original government photo identity card (Aadhaar, Passport, Driving License).</p>
            <p>3. Cancellation policy: 100% refund before 24 hrs, 90% refund within 12-24 hrs of scheduled departure.</p>
          </div>
        </div>

        {/* Footer Actions (Hidden when printing) */}
        <div className="no-print bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onViewMyBookings}
            className="text-xs font-bold text-slate-700 hover:text-red-600 underline flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>View All Past Receipts in "My Bookings"</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-red-200 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Bill / Ticket</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
