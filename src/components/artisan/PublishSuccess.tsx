import React, { useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import confetti from 'canvas-confetti';
import { CheckCircle2, Share2, Eye, Home, QrCode, Sparkles, Wifi, WifiOff } from 'lucide-react';

export const PublishSuccess: React.FC = () => {
  const { setArtisanView, setRole, publishCurrentDraft, isOnline } = useDemo();
  const { t, supportedLanguages } = useLanguage();

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    publishCurrentDraft();
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-5 p-6 bg-white rounded-3xl border border-amber-200 shadow-xl text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{isOnline ? 'PUBLISHED & SYNCED' : 'SAVED OFFLINE AS DRAFT'}</span>
        </span>
        <h2 className="text-2xl font-bold text-amber-950 m-0">{t('productPublished')}</h2>
        <p className="text-xs text-amber-800 font-medium mt-1">
          {t('congratsArtisan')}
        </p>
      </div>

      {/* Sync Status Badge */}
      <div
        className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 ${
          isOnline
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}
      >
        {isOnline ? <Wifi className="w-4 h-4 text-emerald-600" /> : <WifiOff className="w-4 h-4 text-rose-600" />}
        <span>
          {isOnline
            ? '✓ Synchronized with national cloud database & search index'
            : 'ℹ Saved securely on device. Outbox queue will sync when online.'}
        </span>
      </div>

      {/* Multilingual Support Pill Bar */}
      <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 space-y-2">
        <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
          Available across 12 Regional Indian Languages:
        </span>
        <div className="flex flex-wrap justify-center gap-1.5 text-[11px] font-bold text-amber-950">
          {supportedLanguages.map((l) => (
            <span key={l.code} className="bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
              ✓ {l.nativeName}
            </span>
          ))}
        </div>
      </div>

      {/* Shareable QR Card */}
      <div className="p-3.5 bg-stone-50 rounded-2xl border border-amber-200 flex items-center justify-between text-left text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-xl border border-stone-300 flex items-center justify-center shadow-xs">
            <QrCode className="w-7 h-7 text-amber-900" />
          </div>
          <div>
            <span className="font-bold text-amber-950 block">Direct Catalog Link & QR</span>
            <span className="text-amber-800 text-[11px]">Ready for WhatsApp & B2B buyers</span>
          </div>
        </div>
        <button
          onClick={() => alert('Catalog share link copied to clipboard!')}
          className="p-2.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 flex items-center gap-1 shadow-xs"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => setRole('buyer')}
          className="w-full py-4 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base touch-btn transition-transform hover:scale-[1.01]"
        >
          <Eye className="w-5 h-5" />
          <span>View in Buyer Marketplace</span>
        </button>

        <button
          onClick={() => setArtisanView('home')}
          className="w-full py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Return to Artisan Home</span>
        </button>
      </div>
    </div>
  );
};
