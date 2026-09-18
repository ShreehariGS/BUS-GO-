import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Wallet, 
  Building2, 
  CheckCircle2, 
  RefreshCw, 
  Lock, 
  QrCode, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PaymentMethod, PaymentDetails } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  totalAmount: number;
  onClose: () => void;
  onPaymentSuccess: (payment: PaymentDetails) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  totalAmount,
  onClose,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [upiSubOption, setUpiSubOption] = useState<'qr' | 'id' | 'apps'>('qr');
  const [upiId, setUpiId] = useState('shreehari@okhdfcbank');

  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 8921 4410 7789');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('842');
  const [cardName, setCardName] = useState('SHREEHARI G S');

  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState('Paytm Wallet');

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<'idle' | 'authorizing' | 'securing' | 'confirmed'>('idle');

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setProcessStep('authorizing');

    setTimeout(() => {
      setProcessStep('securing');
      setTimeout(() => {
        setProcessStep('confirmed');
        setTimeout(() => {
          setIsProcessing(false);
          const txId = `${method}-${Date.now().toString().slice(-8)}`;
          const paymentResult: PaymentDetails = {
            method,
            transactionId: txId,
            status: 'SUCCESS',
            paidAt: new Date().toISOString(),
            upiId: method === 'UPI' ? upiId : undefined,
            cardLast4: method === 'CARD' ? cardNumber.slice(-4) : undefined,
            walletProvider: method === 'WALLET' ? selectedWallet : undefined,
          };
          onPaymentSuccess(paymentResult);
        }, 800);
      }, 900);
    }, 1000);
  };

  const autoFillTestCard = () => {
    setCardNumber('4532 8921 4410 7789');
    setCardExpiry('08/29');
    setCardCvv('842');
    setCardName('SHREEHARI G S');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">BusGo Secure Payment Gateway</h3>
                <span className="text-[10px] uppercase font-bold bg-white/20 px-1.5 py-0.5 rounded">256-bit Encrypted</span>
              </div>
              <p className="text-xs text-red-100">Integrated with NPCI UPI, RBI-Compliant Banks & Wallets</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Ribbon */}
        <div className="bg-red-50 border-b border-red-100 px-6 py-3 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Total Amount to Pay
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-red-600">INR</span>
            <span className="text-2xl font-black text-red-600">₹{totalAmount}</span>
          </div>
        </div>

        {/* Main Grid: Payment Method Tabs (Left) + Method Details (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
          {/* Method Tabs */}
          <div className="md:col-span-4 bg-slate-50 border-r border-slate-100 p-3 space-y-1.5">
            {[
              { id: 'UPI' as const, label: 'UPI (GPay / PhonePe)', icon: Smartphone, badge: 'Instant' },
              { id: 'CARD' as const, label: 'Credit / Debit Cards', icon: CreditCard, badge: 'Visa / RuPay' },
              { id: 'WALLET' as const, label: 'Digital Wallets', icon: Wallet, badge: 'Paytm / Amazon' },
              { id: 'NETBANKING' as const, label: 'Net Banking', icon: Building2, badge: 'All Banks' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = method === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setMethod(tab.id)}
                  className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-white text-red-600 shadow-sm border border-red-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}

            <div className="pt-4 px-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>PCI-DSS Level 1 Certified Transaction Guarantee</span>
            </div>
          </div>

          {/* Method Form Area */}
          <div className="md:col-span-8 p-6 flex flex-col justify-between">
            {/* UPI Option */}
            {method === 'UPI' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setUpiSubOption('qr')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      upiSubOption === 'qr' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Scan QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiSubOption('id')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      upiSubOption === 'id' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Enter UPI ID / VPA
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiSubOption('apps')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      upiSubOption === 'apps' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    App Quick Pay
                  </button>
                </div>

                {upiSubOption === 'qr' && (
                  <div className="text-center py-2 space-y-3">
                    <div className="inline-block p-3 rounded-2xl bg-white border-2 border-slate-800 shadow-md">
                      {/* Realistic simulated UPI QR code */}
                      <div className="w-36 h-36 bg-slate-900 p-2 rounded-xl flex items-center justify-center text-white relative">
                        <QrCode className="w-32 h-32 text-white" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                            UPI
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Scan with any UPI app</p>
                      <p className="text-[11px] text-slate-500">
                        Google Pay • PhonePe • Paytm • Cred • BHIM
                      </p>
                    </div>
                  </div>
                )}

                {upiSubOption === 'id' && (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Enter UPI ID / Virtual Payment Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. mobileNumber@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:border-red-600"
                    />
                    <div className="flex flex-wrap gap-2 text-xs">
                      {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map((handle) => (
                        <button
                          key={handle}
                          type="button"
                          onClick={() => setUpiId(upiId.split('@')[0] + handle)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-mono text-[11px]"
                        >
                          {handle}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {upiSubOption === 'apps' && (
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {[
                      { name: 'Google Pay', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                      { name: 'PhonePe', color: 'bg-purple-50 text-purple-800 border-purple-200' },
                      { name: 'Paytm UPI', color: 'bg-sky-50 text-sky-800 border-sky-200' },
                      { name: 'BHIM UPI', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                    ].map((app) => (
                      <div
                        key={app.name}
                        onClick={() => setUpiId(`user@${app.name.toLowerCase().replace(' ', '')}`)}
                        className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-between cursor-pointer ${app.color}`}
                      >
                        <span>{app.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Credit / Debit Card Option */}
            {method === 'CARD' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">Card Details</span>
                  <button
                    type="button"
                    onClick={autoFillTestCard}
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    Auto-fill Test Card
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 font-mono text-sm font-bold tracking-wider"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 font-mono text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 font-mono text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-semibold uppercase"
                  />
                </div>
              </div>
            )}

            {/* Digital Wallets */}
            {method === 'WALLET' && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase">Select Wallet Provider</span>
                <div className="space-y-2">
                  {[
                    { name: 'Paytm Wallet', balance: '₹3,450' },
                    { name: 'Amazon Pay Balance', balance: '₹1,200' },
                    { name: 'MobiKwik Wallet', balance: '₹890' },
                    { name: 'PhonePe Wallet', balance: '₹2,100' },
                  ].map((w) => (
                    <label
                      key={w.name}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                        selectedWallet === w.name
                          ? 'border-red-600 bg-red-50/50 font-bold text-red-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="wallet"
                          checked={selectedWallet === w.name}
                          onChange={() => setSelectedWallet(w.name)}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span>{w.name}</span>
                      </div>
                      <span className="text-slate-500 font-medium">Available: {w.balance}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Net Banking */}
            {method === 'NETBANKING' && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase">Select Indian Bank</span>
                <div className="grid grid-cols-2 gap-2">
                  {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(
                    (bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          selectedBank === bank
                            ? 'bg-red-50 border-red-600 text-red-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {bank}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Bottom Pay Action */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              {isProcessing ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center gap-3 text-red-700 font-bold text-sm">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>
                    {processStep === 'authorizing' && 'Connecting to Payment Gateway...'}
                    {processStep === 'securing' && 'Verifying 2FA Security Token...'}
                    {processStep === 'confirmed' && 'Payment Verified! Generating PNR & Invoice...'}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handlePay}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 px-4 rounded-xl text-sm shadow-md shadow-red-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{totalAmount} & Confirm Ticket</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
