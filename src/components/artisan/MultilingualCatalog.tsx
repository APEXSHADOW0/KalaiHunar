import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Language } from '../../types';
import {
  Check,
  Edit,
  Info,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { AudioCatalogPlayer } from '../common/AudioCatalogPlayer';
import { TranslationService } from '../../services/translationService';
import { RealtimeTranslatorModal } from '../common/RealtimeTranslatorModal';

export const MultilingualCatalog: React.FC = () => {
  const { setArtisanView, productDraft, setProductDraft } = useDemo();
  const { language, t, supportedLanguages } = useLanguage();
  const [activeLang, setActiveLang] = useState<Language>(language || 'ta');
  const [showAiRationale, setShowAiRationale] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAutoTranslating, setIsAutoTranslating] = useState(false);
  const [translateSuccess, setTranslateSuccess] = useState(false);
  const [showLiveTranslator, setShowLiveTranslator] = useState(false);

  const currentDesc =
    productDraft.descriptions?.[activeLang] ||
    productDraft.descriptions?.en || {
      title: 'Handmade Terracotta Decorative Doll',
      shortDescription: 'Handcrafted terracotta decorative doll made from natural clay.',
      longDescription: 'Sourced directly from Madurai clay artisan clusters.',
      craftDetails: '100% Biodegradable • Hand-painted',
    };

  const [editableTitle, setEditableTitle] = useState(currentDesc.title);
  const [editableShort, setEditableShort] = useState(currentDesc.shortDescription);

  const handleLanguageTabClick = (langCode: Language) => {
    setActiveLang(langCode);
    const newDesc = productDraft.descriptions?.[langCode] || productDraft.descriptions?.en;
    if (newDesc) {
      setEditableTitle(newDesc.title);
      setEditableShort(newDesc.shortDescription);
    }
  };

  const handleSaveEdits = () => {
    setProductDraft((prev) => {
      const descriptions = prev.descriptions || ({} as any);
      return {
        ...prev,
        descriptions: {
          ...descriptions,
          [activeLang]: {
            ...(descriptions[activeLang] || descriptions.en || currentDesc),
            title: editableTitle,
            shortDescription: editableShort,
          },
        },
      };
    });
    setIsEditing(false);
  };

  // Real-time automatic translation across all 12 regional languages
  const handleAutoTranslateAll = async () => {
    if (!productDraft.descriptions) return;
    setIsAutoTranslating(true);
    setTranslateSuccess(false);

    try {
      const updatedDescriptions = await TranslationService.translateProductCatalog(
        productDraft.descriptions,
        activeLang
      );

      setProductDraft((prev) => ({
        ...prev,
        descriptions: updatedDescriptions,
      }));

      setTranslateSuccess(true);
      setTimeout(() => setTranslateSuccess(false), 3000);
    } catch {
      // ignore
    } finally {
      setIsAutoTranslating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4 bg-white rounded-3xl border border-amber-200 shadow-md animate-fade-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-2">
        <button
          onClick={() => setArtisanView('ai-processing')}
          className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold hover:bg-amber-200 flex items-center gap-1 text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('back')}</span>
        </button>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>SMART MULTILINGUAL CATALOG</span>
        </span>
      </div>

      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-amber-950 m-0">{t('catalogReviewTitle')}</h2>
        <p className="text-xs text-amber-800 font-medium">{t('catalogReviewSub')}</p>
      </div>

      {/* Regional Language Tabs (horizontal scroll for 12 languages) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
          <span className="uppercase tracking-wider">Select Regional Language View:</span>
          <button
            onClick={() => setShowLiveTranslator(true)}
            className="text-amber-700 hover:text-amber-950 flex items-center gap-1 text-[11px] underline"
          >
            <Globe className="w-3 h-3" />
            <span>Open Real-Time Translator</span>
          </button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {supportedLanguages.map((l) => (
            <button
              key={l.code}
              onClick={() => handleLanguageTabClick(l.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeLang === l.code
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-100/70 text-amber-900 hover:bg-amber-200'
              }`}
            >
              {l.nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* 1-Click Real-Time Auto-Translate All Bar */}
      <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-300 shadow-2xs">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Real-Time Multi-Language Sync</span>
          </span>
          <span className="text-[10px] text-amber-800 block">
            Translate active edits into all 12 regional languages
          </span>
        </div>

        <button
          onClick={handleAutoTranslateAll}
          disabled={isAutoTranslating}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all ${
            translateSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAutoTranslating ? 'animate-spin' : ''}`} />
          <span>
            {isAutoTranslating
              ? 'Translating 12 Langs...'
              : translateSuccess
              ? '✓ All 12 Synced'
              : 'Translate to All'}
          </span>
        </button>
      </div>

      {/* Embedded Real-Time Audio Enhanced Catalog Player */}
      <AudioCatalogPlayer
        product={productDraft}
        defaultLanguage={activeLang}
        showLanguageSelector={false}
      />

      {/* Catalog Preview Card */}
      <div className="bg-stone-50 p-4 rounded-2xl border border-amber-200 space-y-3 relative shadow-xs">
        <div className="flex items-center justify-between">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
            AI-Suggested • Authenticity Preserved
          </span>
          <span className="text-[10px] font-bold text-amber-800">
            Language: {supportedLanguages.find((l) => l.code === activeLang)?.name}
          </span>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-bold text-amber-800 uppercase block mb-1">Title</label>
              <input
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="w-full p-2 text-sm font-bold bg-white rounded-xl border border-amber-300"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-amber-800 uppercase block mb-1">Short Description</label>
              <textarea
                value={editableShort}
                onChange={(e) => setEditableShort(e.target.value)}
                rows={3}
                className="w-full p-2 text-xs font-medium bg-white rounded-xl border border-amber-300"
              />
            </div>
            <button
              onClick={handleSaveEdits}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
            >
              ✓ Save Changes in {supportedLanguages.find((l) => l.code === activeLang)?.nativeName}
            </button>
          </div>
        ) : (
          <>
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Product Title</span>
              <h3 className="text-lg font-bold text-amber-950 leading-snug m-0">{currentDesc.title}</h3>
            </div>

            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Short Summary</span>
              <p className="text-xs text-amber-900 font-medium leading-relaxed m-0">{currentDesc.shortDescription}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Craft Story & Technique</span>
              <p className="text-xs text-amber-800 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200 m-0">
                {currentDesc.longDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] text-amber-900 font-semibold pt-1 border-t border-stone-200">
              <span className="bg-amber-100 px-2 py-0.5 rounded font-bold">Material: {productDraft.material}</span>
              <span className="bg-amber-100 px-2 py-0.5 rounded font-bold">Origin: {productDraft.origin}</span>
              <span className="bg-amber-100 px-2 py-0.5 rounded font-bold">MOQ: {productDraft.moq} pcs</span>
            </div>
          </>
        )}
      </div>

      {/* Expandable AI Explanation Rationale */}
      <div className="border border-amber-200 rounded-xl overflow-hidden text-xs">
        <button
          onClick={() => setShowAiRationale(!showAiRationale)}
          className="w-full p-3 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-700" />
            <span>How did AI create this description without hallucinating?</span>
          </div>
          {showAiRationale ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAiRationale && (
          <div className="p-3 bg-white space-y-1.5 text-amber-900 font-medium border-t border-amber-200">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Extracted directly from your regional voice narration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified material: Natural craft raw materials</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Only user-confirmed facts used — zero fictional details</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => setArtisanView('pricing')}
          className="w-full py-4 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base touch-btn transition-transform hover:scale-[1.01]"
        >
          <span>✓ Approve Catalog & View Fair Pricing</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex gap-2 text-xs font-bold text-amber-900">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 rounded-xl border border-stone-300 flex items-center justify-center gap-1"
          >
            <Edit className="w-3.5 h-3.5 text-amber-700" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Text'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Translator Modal */}
      <RealtimeTranslatorModal
        isOpen={showLiveTranslator}
        onClose={() => setShowLiveTranslator(false)}
      />
    </div>
  );
};
