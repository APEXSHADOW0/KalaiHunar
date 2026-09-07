import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Building2,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  ChevronLeft,
  XCircle,
  Volume2,
  Send,
} from 'lucide-react';

export const BuyerRequestsList: React.FC = () => {
  const { rfqs, respondToRFQ, setArtisanView } = useDemo();
  const { t, speakText, isSpeaking, stopSpeaking } = useLanguage();
  const [activeCounterRfqId, setActiveCounterRfqId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(900);
  const [counterDays, setCounterDays] = useState<number>(14);
  const [counterNotes, setCounterNotes] = useState<string>('Authentic handcrafting with natural sun drying.');

  const handleOpenCounterModal = (rfqId: string, currentTarget: number, currentDays: number) => {
    setActiveCounterRfqId(rfqId);
    setCounterPrice(Math.round(currentTarget * 1.05));
    setCounterDays(currentDays);
  };

  const handleSubmitCounter = (rfqId: string) => {
    respondToRFQ(rfqId, 'counter', {
      price: counterPrice,
      notes: counterNotes,
      days: counterDays,
    });
    setActiveCounterRfqId(null);
  };

  const handleListenRFQ = (rfq: any) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(
        `Buyer ${rfq.companyName} wants ${rfq.quantity} units of ${rfq.productTitle} at ₹${rfq.targetBudgetPerUnit} per unit. Required within ${rfq.deliveryDays} days.`
      );
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4 bg-white rounded-3xl border border-amber-200 shadow-md animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-3">
        <button
          onClick={() => setArtisanView('home')}
          className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold hover:bg-amber-200 flex items-center gap-1 text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('back')}</span>
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-amber-950 m-0">{t('buyerRequests')}</h2>
          <span className="text-[11px] text-amber-800 font-medium">B2B Quotation Inquiries & RFQs</span>
        </div>
        <div className="w-10"></div>
      </div>

      {rfqs.length === 0 ? (
        <div className="p-8 text-center text-amber-800 bg-amber-50 rounded-2xl border border-amber-200">
          <p className="m-0 text-xs font-semibold">No buyer requests yet. Digitized products will receive RFQs automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rfqs.map((rfq) => (
            <div
              key={rfq.id}
              className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                rfq.status === 'accepted'
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : rfq.status === 'quoted'
                  ? 'bg-blue-50/70 border-blue-300'
                  : rfq.status === 'declined'
                  ? 'bg-stone-100 border-stone-300 opacity-60'
                  : 'bg-amber-50/70 border-amber-300 shadow-sm'
              }`}
            >
              {/* Buyer & Matching Header */}
              <div className="flex items-start justify-between border-b border-amber-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-950 text-sm m-0">{rfq.companyName}</h4>
                    <span className="text-xs text-amber-800 font-medium">{rfq.buyerName}</span>
                  </div>
                </div>

                {/* AI Matching Score Badge */}
                <div className="text-right flex items-center gap-1.5">
                  <button
                    onClick={() => handleListenRFQ(rfq)}
                    className="p-1 rounded-lg bg-white border border-amber-200 text-amber-800 hover:text-amber-950"
                    title="Listen to this request"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <Sparkles className="w-3 h-3" />
                    <span>{rfq.matchScore}% MATCH</span>
                  </span>
                </div>
              </div>

              {/* Product & Order Details */}
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs space-y-1.5 text-amber-950 font-semibold shadow-xs">
                <div className="flex justify-between">
                  <span className="text-amber-700">Requested Product:</span>
                  <span className="font-bold text-amber-950">{rfq.productTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Quantity Needed:</span>
                  <span className="font-extrabold text-amber-950">{rfq.quantity} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Target Budget / Unit:</span>
                  <span className="font-extrabold text-emerald-700">₹{rfq.targetBudgetPerUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Total Order Value:</span>
                  <span className="font-extrabold text-emerald-700">₹{rfq.totalBudget || rfq.quantity * rfq.targetBudgetPerUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Required Delivery:</span>
                  <span>{rfq.deliveryDays} days</span>
                </div>
                {rfq.additionalNotes && (
                  <div className="pt-1 border-t border-stone-200 text-amber-900 font-normal italic">
                    "{rfq.additionalNotes}"
                  </div>
                )}

                {rfq.counterUnitPrice && (
                  <div className="pt-2 border-t border-blue-200 text-blue-900 font-bold flex justify-between">
                    <span>Your Counter Quote:</span>
                    <span>₹{rfq.counterUnitPrice} / unit ({rfq.counterDeliveryDays} days)</span>
                  </div>
                )}
              </div>

              {/* Action Buttons & Transitions */}
              {rfq.status === 'accepted' ? (
                <div className="p-2.5 bg-emerald-600 text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>RFQ Accepted — Verified Buyer Connected</span>
                </div>
              ) : rfq.status === 'quoted' ? (
                <div className="p-2.5 bg-blue-600 text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Counter Offer Sent — Waiting for Buyer Confirmation</span>
                </div>
              ) : rfq.status === 'declined' ? (
                <div className="p-2.5 bg-stone-300 text-stone-700 font-bold rounded-xl text-center text-xs">
                  Request Declined
                </div>
              ) : (
                <div className="flex gap-2 text-xs font-bold">
                  <button
                    onClick={() => respondToRFQ(rfq.id, 'accept')}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept</span>
                  </button>

                  <button
                    onClick={() => handleOpenCounterModal(rfq.id, rfq.targetBudgetPerUnit, rfq.deliveryDays)}
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Counter Quote</span>
                  </button>

                  <button
                    onClick={() => respondToRFQ(rfq.id, 'decline')}
                    className="p-2.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl"
                    title="Decline request"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* In-Place Counter Quote Drawer */}
              {activeCounterRfqId === rfq.id && (
                <div className="p-3 bg-white rounded-2xl border-2 border-amber-400 space-y-2.5 animate-scale-up">
                  <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                    Submit Counter Quote:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <div>
                      <label className="block text-[10px] text-amber-800">Your Unit Price (₹):</label>
                      <input
                        type="number"
                        value={counterPrice}
                        onChange={(e) => setCounterPrice(Number(e.target.value))}
                        className="w-full p-2 border border-amber-300 rounded-lg text-xs font-bold bg-amber-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-amber-800">Delivery Days:</label>
                      <input
                        type="number"
                        value={counterDays}
                        onChange={(e) => setCounterDays(Number(e.target.value))}
                        className="w-full p-2 border border-amber-300 rounded-lg text-xs font-bold bg-amber-50/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-amber-800">Artisan Notes / Material Guarantee:</label>
                    <input
                      type="text"
                      value={counterNotes}
                      onChange={(e) => setCounterNotes(e.target.value)}
                      className="w-full p-2 border border-amber-300 rounded-lg text-xs font-medium bg-amber-50/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubmitCounter(rfq.id)}
                      className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow"
                    >
                      Send Counter Offer to Buyer
                    </button>
                    <button
                      onClick={() => setActiveCounterRfqId(null)}
                      className="px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
