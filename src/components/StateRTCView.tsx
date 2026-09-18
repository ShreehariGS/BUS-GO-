import React from 'react';
import { StateRTC } from '../types';
import { ShieldCheck, Bus, Award, CheckCircle2, ArrowRight } from 'lucide-react';

interface StateRTCViewProps {
  onSelectRTC: (rtc: StateRTC) => void;
}

export const StateRTCView: React.FC<StateRTCViewProps> = ({ onSelectRTC }) => {
  const rtcList = [
    {
      code: 'KSRTC' as StateRTC,
      name: 'Karnataka State Road Transport Corp',
      fleet: 'Airavat Club Class, Flybus, Ambari Dream Class, Corona',
      routes: 'Bengaluru, Mysuru, Hubli, Mangaluru, Hyderabad, Chennai, Goa',
      rating: 4.85,
      busesCount: '8,400+',
      accentColor: 'border-red-500 bg-red-50/50',
    },
    {
      code: 'TSRTC' as StateRTC,
      name: 'Telangana State Road Transport Corp',
      fleet: 'Garuda Plus, Rajadhani, Lahari Sleeper, Super Luxury',
      routes: 'Hyderabad, Warangal, Nizamabad, Bengaluru, Vijayawada, Tirupati',
      rating: 4.8,
      busesCount: '9,200+',
      accentColor: 'border-red-400 bg-white',
    },
    {
      code: 'APSRTC' as StateRTC,
      name: 'Andhra Pradesh State Road Transport Corp',
      fleet: 'Amaravathi Scania, Dolphin Cruise, Vennela Sleeper',
      routes: 'Vijayawada, Visakhapatnam, Tirupati, Guntur, Hyderabad, Chennai',
      rating: 4.78,
      busesCount: '11,000+',
      accentColor: 'border-slate-300 bg-white',
    },
    {
      code: 'MSRTC' as StateRTC,
      name: 'Maharashtra State Road Transport Corp',
      fleet: 'Shivneri Volvo AC, Shivshahi AC Seater & Sleeper, Asiad',
      routes: 'Mumbai, Pune, Nagpur, Nashik, Shirdi, Kolhapur, Aurangabad',
      rating: 4.75,
      busesCount: '14,500+',
      accentColor: 'border-slate-300 bg-white',
    },
    {
      code: 'Kerala RTC' as StateRTC,
      name: 'Kerala State Road Transport Corp (SWIFT)',
      fleet: 'K-SWIFT Gajaraj AC Sleeper, Garuda Maharaja, Minnal Express',
      routes: 'Thiruvananthapuram, Kochi, Kozhikode, Bengaluru, Coimbatore',
      rating: 4.88,
      busesCount: '5,800+',
      accentColor: 'border-slate-300 bg-white',
    },
    {
      code: 'UPSRTC' as StateRTC,
      name: 'Uttar Pradesh State Road Transport Corp',
      fleet: 'Jan Rath AC, Shatabdi Volvo, Goldline Express',
      routes: 'Lucknow, Kanpur, Varanasi, Agra, Delhi NCR, Gorakhpur',
      rating: 4.65,
      busesCount: '12,000+',
      accentColor: 'border-slate-300 bg-white',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Intro Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-red-600" />
          <span className="text-xs uppercase font-extrabold text-red-600 tracking-wider">
            All-India Public Transit Gateway
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Unified State Road Transport Corporations (RTCs)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">
          BusGo unifies India's government state transport undertakings under a single high-speed booking API. 
          Enjoy official state fares, zero booking surcharges, verified government drivers, and GPS tracking.
        </p>
      </div>

      {/* RTC Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rtcList.map((rtc) => (
          <div
            key={rtc.code}
            className={`rounded-2xl p-6 border transition-all hover:shadow-md ${rtc.accentColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-black text-red-600 tracking-tight">{rtc.code}</span>
              <span className="text-xs font-bold bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                ★ {rtc.rating}
              </span>
            </div>

            <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{rtc.name}</h3>
            <p className="text-xs text-slate-500 mt-2">
              <strong>Fleet:</strong> {rtc.fleet}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              <strong>Major Hubs:</strong> {rtc.routes}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">{rtc.busesCount} Daily Buses</span>
              <button
                type="button"
                onClick={() => onSelectRTC(rtc.code)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View Buses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
