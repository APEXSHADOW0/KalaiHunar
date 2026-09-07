import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Camera,
  Package,
  MessageSquare,
  HelpCircle,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Wifi,
  WifiOff,
  Volume2,
} from 'lucide-react';

export const ArtisanHome: React.FC = () => {
  const { setArtisanView, products, rfqs, isOnline } = useDemo();
  const { t, speakText, isSpeaking, stopSpeaking } = useLanguage();
  const [showVoiceHelpModal, setShowVoiceHelpModal] = useState(false);

  const pendingRfqs = rfqs.filter((r) => r.status === 'pending');

  const handleReadVoiceInstructions = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const guideText = `${t('welcomeArtisan')}. ${t('addProductSub')}. ${t('businessOverview')}: ${products.length} ${t('productsCount')}, ${rfqs.length} ${t('requestsCount')}.`;
      speakText(guideText);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12 animate-fade-in">
      {/* Artisan Greeting & Location */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-900 to-amber-800 text-amber-50 p-4 rounded-3xl shadow-md border border-amber-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-300 block">{t('welcomeArtisan')}</span>
            <button
              onClick={handleReadVoiceInstructions}
              className={`p-1 rounded-full ${
                isSpeaking ? 'bg-rose-500 text-white animate-bounce' : 'bg-amber-800/80 text-amber-200 hover:text-white'
              }`}
              title="Listen in your language"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight m-0">Lakshmi Pottery</h2>
          <p className="text-xs text-amber-200/90 font-medium m-0">Madurai, Tamil Nadu • Terracotta Clay Cluster</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-700/80 border-2 border-amber-400 flex items-center justify-center text-xl font-bold text-white shadow-inner">
          L
        </div>
      </div>

      {/* Digital Business Progress Card */}
      <div className="bg-white p-4 rounded-3xl border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-amber-100 pb-2">
          <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>{t('businessOverview')}</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? t('activeStatus') : t('offlineStatus')}</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div
            onClick={() => setArtisanView('my-products')}
            className="cursor-pointer bg-amber-50/60 hover:bg-amber-100/60 p-2.5 rounded-2xl border border-amber-200/60 transition-colors"
          >
            <span className="block text-2xl font-extrabold text-amber-950">{products.length}</span>
            <span className="text-[11px] text-amber-800 font-semibold">{t('productsCount')}</span>
          </div>

          <div
            onClick={() => setArtisanView('buyer-requests')}
            className="cursor-pointer bg-amber-50/60 hover:bg-amber-100/60 p-2.5 rounded-2xl border border-amber-200/60 relative transition-colors"
          >
            {pendingRfqs.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full animate-bounce">
                {pendingRfqs.length} new
              </span>
            )}
            <span className="block text-2xl font-extrabold text-amber-950">{rfqs.length}</span>
            <span className="text-[11px] text-amber-800 font-semibold">{t('requestsCount')}</span>
          </div>

          <div className="bg-amber-50/60 p-2.5 rounded-2xl border border-amber-200/60">
            <span className="block text-2xl font-extrabold text-emerald-700">₹42.5k</span>
            <span className="text-[11px] text-amber-800 font-semibold">{t('potentialSales')}</span>
          </div>
        </div>
      </div>

      {/* PRIMARY HERO ACTION: ADD PRODUCT */}
      <div className="space-y-3">
        <button
          onClick={() => setArtisanView('camera')}
          className="w-full p-5 rounded-3xl bg-gradient-to-r from-amber-600 to-terracotta-600 hover:from-amber-500 hover:to-terracotta-500 text-white font-extrabold text-xl shadow-lg border border-amber-500 flex items-center justify-between touch-btn group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <span className="block leading-tight text-xl font-bold">{t('addProduct')}</span>
              <span className="text-xs text-amber-100 font-normal">{t('addProductSub')}</span>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* SECONDARY ACTIONS GRID */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setArtisanView('my-products')}
            className="p-4 rounded-2xl bg-white hover:bg-amber-50 border border-amber-200 text-amber-950 font-bold flex flex-col items-center text-center shadow-xs touch-btn"
          >
            <Package className="w-7 h-7 text-amber-700 mb-2" />
            <span className="text-sm font-bold">{t('myProducts')}</span>
            <span className="text-[11px] text-amber-700/80 font-normal">
              {products.length} {t('digitized')}
            </span>
          </button>

          <button
            onClick={() => setArtisanView('buyer-requests')}
            className="p-4 rounded-2xl bg-white hover:bg-amber-50 border border-amber-200 text-amber-950 font-bold flex flex-col items-center text-center shadow-xs touch-btn relative"
          >
            {pendingRfqs.length > 0 && (
              <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
            <MessageSquare className="w-7 h-7 text-amber-700 mb-2" />
            <span className="text-sm font-bold">{t('buyerRequests')}</span>
            <span className="text-[11px] text-amber-700/80 font-normal">
              {pendingRfqs.length} {t('pendingInquiries')}
            </span>
          </button>
        </div>

        {/* VOICE HELP ACTION */}
        <button
          onClick={() => setShowVoiceHelpModal(true)}
          className="w-full p-3.5 rounded-2xl bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300 text-amber-950 font-bold text-sm flex items-center justify-between shadow-xs touch-btn"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-800" />
            <span>🎤 {t('askAiHelp')}</span>
          </div>
          <span className="text-xs bg-amber-200 text-amber-900 font-semibold px-2 py-0.5 rounded-md">
            {t('voiceHelp')}
          </span>
        </button>
      </div>

      {/* TODAY'S MARKET INSIGHT CARD */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-3xl border border-amber-200 shadow-xs flex items-start gap-3">
        <div className="w-9 h-9 rounded-2xl bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 m-0">
            {t('marketInsightTitle')}
          </h4>
          <p className="text-xs text-amber-950 mt-1 leading-relaxed font-medium">
            {t('marketInsightText')}
          </p>
        </div>
      </div>

      {/* VOICE HELP MODAL */}
      {showVoiceHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border-2 border-amber-300 shadow-2xl space-y-4 animate-scale-up">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-600 text-white mx-auto flex items-center justify-center mb-3 shadow-lg">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-amber-950 m-0">KALAIHUNAR Voice Assistant</h3>
              <p className="text-xs text-amber-800 mt-1">Speak any question about digitizing your craft</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <p className="font-bold text-amber-950">Common questions:</p>
              <button
                onClick={() => speakText("You can take a photo of your terracotta doll, speak in your mother tongue, and the AI will create a catalog.")}
                className="w-full text-left bg-white p-2.5 rounded-xl border border-amber-200 hover:border-amber-400 text-xs text-amber-900 flex items-center justify-between"
              >
                <span>"How do I add a new craft item?"</span>
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              </button>
              <button
                onClick={() => speakText("Your fair price is calculated transparently from clay material, artisan labour, packaging, and logistics.")}
                className="w-full text-left bg-white p-2.5 rounded-xl border border-amber-200 hover:border-amber-400 text-xs text-amber-900 flex items-center justify-between"
              >
                <span>"How does pricing work?"</span>
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              </button>
            </div>

            <button
              onClick={() => {
                setShowVoiceHelpModal(false);
                setArtisanView('camera');
              }}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-md"
            >
              Start "Add Product" Flow Now
            </button>
            <button
              onClick={() => setShowVoiceHelpModal(false)}
              className="w-full py-2 text-xs font-semibold text-amber-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
