import React from 'react';
import { Bus, Ticket, ShieldCheck, User, LogOut, Phone, Shield } from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  currentTab: 'book' | 'my-bookings' | 'admin' | 'fleets';
  setCurrentTab: (tab: 'book' | 'my-bookings' | 'admin' | 'fleets') => void;
  user: UserSession | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  bookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onOpenAuth,
  onLogout,
  bookingsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-red-100 shadow-xs no-print">
      {/* Top Banner Notice */}
      <div className="bg-red-700 text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Unified All-India Transit: Official RTCs (KSRTC, TSRTC, APSRTC, MSRTC, Kerala RTC) & Verified Private Fleets</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            id="brand-logo"
            onClick={() => setCurrentTab('book')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-200 group-hover:scale-105 transition-transform duration-200">
              <Bus className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-red-600">bus<span className="text-slate-900">go</span></span>
                <span className="text-[10px] uppercase font-bold bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-sm">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Interstate & RTC Bus Booking
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-tab-book"
              onClick={() => setCurrentTab('book')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                currentTab === 'book'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>Book Bus</span>
            </button>

            <button
              id="nav-tab-bookings"
              onClick={() => setCurrentTab('my-bookings')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 relative ${
                currentTab === 'my-bookings'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>My Bookings & Receipts</span>
              {bookingsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-red-600 text-white">
                  {bookingsCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-fleets"
              onClick={() => setCurrentTab('fleets')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                currentTab === 'fleets'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>State RTCs</span>
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => setCurrentTab('admin')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                currentTab === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Portal</span>
            </button>
          </nav>

          {/* Right Action: Auth / User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full py-1 px-2.5 sm:px-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-red-300"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight max-w-[120px] truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {user.phone || user.email || 'Verified'}
                    </p>
                  </div>
                </div>

                <button
                  id="btn-logout"
                  onClick={onLogout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-login-signup"
                onClick={onOpenAuth}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold tracking-wide shadow-sm shadow-red-200 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Phone className="w-4 h-4" />
                <span>Login / Sign Up</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setCurrentTab('book')}
            className={`py-1.5 px-3 rounded-md font-semibold flex items-center gap-1 ${
              currentTab === 'book' ? 'text-red-600 bg-red-50' : 'text-slate-600'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
          <button
            onClick={() => setCurrentTab('my-bookings')}
            className={`py-1.5 px-3 rounded-md font-semibold flex items-center gap-1 ${
              currentTab === 'my-bookings' ? 'text-red-600 bg-red-50' : 'text-slate-600'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Tickets ({bookingsCount})</span>
          </button>
          <button
            onClick={() => setCurrentTab('fleets')}
            className={`py-1.5 px-3 rounded-md font-semibold flex items-center gap-1 ${
              currentTab === 'fleets' ? 'text-red-600 bg-red-50' : 'text-slate-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>RTCs</span>
          </button>
          <button
            onClick={() => setCurrentTab('admin')}
            className={`py-1.5 px-3 rounded-md font-semibold flex items-center gap-1 ${
              currentTab === 'admin' ? 'text-white bg-slate-900' : 'text-slate-600'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
