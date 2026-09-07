import React, { useEffect, useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Share2,
  Eye,
  Home,
  QrCode,
  Sparkles,
  Wifi,
  WifiOff,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { AudioCatalogPlayer } from '../common/AudioCatalogPlayer';
import { ImageSlider } from '../common/ImageSlider';

export const PublishSuccess: React.FC = () => {
  const { setArtisanView, setRole, productDraft, isOnline } = useDemo();
  const { language, supportedLanguages } = useLanguage();
  const [activePreviewLang, setActivePreviewLang] = useState(language || 'ta');
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 },
    });
  }, []);

  const desc =
    productDraft.descriptions?.[activePreviewLang] ||
    productDraft.descriptions?.en || {
      title: 'Handmade Terracotta Decorative Doll',
      shortDescription: 'Handcrafted craft item',
      longDescription: 'Traditional handcrafted piece',
      craftDetails: 'Authentic artisan craft',
    };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4 sm:p-5 bg-white rounded-3xl border-2 border-emerald-400 shadow-2xl animate-fade-in pb-12">
      {/* Top Celebration Badge */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-extrabold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI ZERO-TOUCH PUBLISHED</span>
          </span>
          <h2 className="text-2xl font-black text-amber-950 m-0">Live in B2B Marketplace!</h2>
          <p className="text-xs text-amber-800 font-medium mt-0.5">
            AI enhanced your photo, generated all 12 language catalogs & audio narrations automatically.
          </p>
        </div>
      </div>

      {/* Product Image & Before/After Toggle */}
      <div className="space-y-1.5 bg-stone-50 p-3 rounded-2xl border border-amber-200">
        <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
          <span>AI-Enhanced Studio Visual:</span>
          <button
            onClick={() => setShowBeforeAfter(!showBeforeAfter)}
            className="text-amber-700 hover:text-amber-950 underline flex items-center gap-1"
          >
            <span>{showBeforeAfter ? 'Hide Comparison' : 'Compare Original vs AI Studio'}</span>
          </button>
        </div>

        {showBeforeAfter ? (
          <ImageSlider
            originalSrc={productDraft.originalImage || ''}
            enhancedSrc={productDraft.enhancedImage || ''}
          />
        ) : (
          <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-amber-300 shadow-sm bg-stone-100">
            <img
              src={productDraft.enhancedImage || productDraft.originalImage}
              alt={desc.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 bg-slate-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
              AI Studio HD • 100% Authentic Handcraft
            </span>
          </div>
        )}
      </div>

      {/* Real-time Spoken Audio Narration for Every Language */}
      <div className="space-y-1">
        <AudioCatalogPlayer
          product={productDraft}
          defaultLanguage={activePreviewLang}
          showLanguageSelector={true}
        />
      </div>

      {/* Multilingual Catalog Language Tabs */}
      <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 space-y-2 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider">
            Live in 12 Regional Languages:
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            ✓ Auto-Translated
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {supportedLanguages.map((l) => (
            <button
              key={l.code}
              onClick={() => setActivePreviewLang(l.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activePreviewLang === l.code
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              {l.nativeName}
            </button>
          ))}
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-amber-200 space-y-1">
          <h4 className="font-bold text-amber-950 text-sm m-0">{desc.title}</h4>
          <p className="text-xs text-amber-900 leading-relaxed m-0 font-medium">{desc.shortDescription}</p>
        </div>
      </div>

      {/* Commercial & Fair Price Breakdown */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-2xl border border-amber-200 flex items-center justify-between text-left text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase text-amber-700 block">Suggested Retail Price</span>
          <span className="text-2xl font-black text-amber-950">₹{productDraft.priceBreakdown?.suggestedPrice || 520}</span>
          <span className="text-[10px] text-amber-800 block">MOQ: {productDraft.moq || 10} units</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase text-emerald-700 block">B2B Wholesale Price</span>
          <span className="text-xl font-black text-emerald-800">₹{productDraft.priceBreakdown?.b2bUnitPrice || 440} / unit</span>
          <span className="text-[10px] text-emerald-700 block font-semibold">✓ 100% Direct to Artisan</span>
        </div>
      </div>

      {/* Sync Status Badge */}
      <div
        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
          isOnline
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}
      >
        {isOnline ? <Wifi className="w-4 h-4 text-emerald-600" /> : <WifiOff className="w-4 h-4 text-rose-600" />}
        <span>
          {isOnline
            ? '✓ Synchronized with live B2B marketplace search index'
            : 'ℹ Saved securely on device. Outbox queue will sync when online.'}
        </span>
      </div>

      {/* Shareable QR Card */}
      <div className="p-3 bg-stone-50 rounded-2xl border border-amber-200 flex items-center justify-between text-left text-xs shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white rounded-xl border border-stone-300 flex items-center justify-center shadow-xs">
            <QrCode className="w-6 h-6 text-amber-900" />
          </div>
          <div>
            <span className="font-bold text-amber-950 block">Direct Catalog Link & QR</span>
            <span className="text-amber-800 text-[11px]">Ready for WhatsApp & B2B buyers</span>
          </div>
        </div>
        <button
          onClick={() => alert('Catalog share link copied to clipboard!')}
          className="p-2 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 flex items-center gap-1 shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={() => setRole('buyer')}
          className="w-full py-4 px-4 bg-gradient-to-r from-amber-600 to-terracotta-600 hover:from-amber-500 hover:to-terracotta-500 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base touch-btn transition-transform hover:scale-[1.01]"
        >
          <Eye className="w-5 h-5" />
          <span>View Live in Buyer Marketplace</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => setArtisanView('camera')}
          className="w-full py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Craft Item (Photo + Voice)</span>
        </button>

        <button
          onClick={() => setArtisanView('home')}
          className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Artisan Home</span>
        </button>
      </div>
    </div>
  );
};
