import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useDemo } from '../../context/DemoContext';
import {
  ALL_SUPPORTED_LANGUAGES,
  ExtendedLanguage,
  TranslationService,
} from '../../services/translationService';
import {
  Globe,
  Mic,
  Volume2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  X,
  Square,
} from 'lucide-react';

interface RealtimeTranslatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_QUICK_PHRASES = [
  'Handcrafted terracotta decorative doll made from natural river clay.',
  'Pure handloom silk saree with gold zari border, takes 4 days to weave.',
  'Hand-carved solid teak wood traditional decor piece.',
  'Traditional brass diya lamp for puja and festival lighting.',
  'Handcrafted eco-friendly kora grass basket for storage.',
];

export const RealtimeTranslatorModal: React.FC<RealtimeTranslatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { speakText, isSpeaking, stopSpeaking } = useLanguage();
  const { setProductDraft } = useDemo();

  const [sourceLang, setSourceLang] = useState<ExtendedLanguage>('ta');
  const [targetLang, setTargetLang] = useState<ExtendedLanguage>('en');
  const [inputText, setInputText] = useState('இது மதுரையில் களிமண்ணால் செய்யப்பட்ட பாரம்பரிய பொம்மை.');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'all'>('single');
  const [allTranslations, setAllTranslations] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);

  const speechRecognizerRef = useRef<any>(null);

  // Initialize Speech Recognition for live microphone input
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognizer = new SpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = true;

        recognizer.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          if (current.trim()) {
            setInputText(current);
          }
        };

        recognizer.onerror = () => {
          setIsRecording(false);
        };

        speechRecognizerRef.current = recognizer;
      } catch {
        // Recognition unavailable
      }
    }
  }, []);

  // Update speech recognizer language whenever source language changes
  useEffect(() => {
    if (speechRecognizerRef.current) {
      const meta = ALL_SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang);
      speechRecognizerRef.current.lang = meta?.bcp47 || 'ta-IN';
    }
  }, [sourceLang]);

  // Real-time Translation effect on input or language changes
  useEffect(() => {
    let isCurrent = true;
    if (!inputText.trim()) {
      setTranslatedText('');
      setAllTranslations({});
      return;
    }

    setIsTranslating(true);
    const timer = setTimeout(async () => {
      if (activeTab === 'single') {
        const res = await TranslationService.translateText(inputText, sourceLang, targetLang);
        if (isCurrent) {
          setTranslatedText(res);
          setIsTranslating(false);
        }
      } else {
        const allRes = await TranslationService.translateToAllLanguages(inputText, sourceLang);
        if (isCurrent) {
          setAllTranslations(allRes);
          setTranslatedText(allRes[targetLang] || '');
          setIsTranslating(false);
        }
      }
    }, 150);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [inputText, sourceLang, targetLang, activeTab]);

  const handleSwapLanguages = () => {
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    setSourceLang(prevTarget);
    setTargetLang(prevSource);
    setInputText(translatedText || inputText);
  };

  const handleToggleVoiceInput = () => {
    if (isRecording) {
      speechRecognizerRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        speechRecognizerRef.current?.start();
        setIsRecording(true);
      } catch {
        setIsRecording(false);
      }
    }
  };

  const handleCopy = () => {
    if (translatedText && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleSpeakTranslation = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (translatedText) {
      speakText(translatedText, targetLang as any);
    }
  };

  const handleApplyToDraft = () => {
    setProductDraft((prev) => {
      const descriptions = (prev.descriptions || {}) as any;
      const targetObj = descriptions[targetLang] || descriptions.en || {};
      return {
        ...prev,
        transcript: inputText,
        descriptions: {
          ...descriptions,
          [targetLang]: {
            ...targetObj,
            title: translatedText,
          },
        },
      };
    });
    onClose();
  };

  if (!isOpen) return null;

  const sourceMeta = ALL_SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang) || ALL_SUPPORTED_LANGUAGES[0];
  const targetMeta = ALL_SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || ALL_SUPPORTED_LANGUAGES[1];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col border-2 border-amber-300 shadow-2xl overflow-hidden animate-scale-up">
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-amber-900 to-amber-800 text-white flex items-center justify-between border-b border-amber-700 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <Globe className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white m-0">Universal Real-Time Translator</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold uppercase">
                  Live AI
                </span>
              </div>
              <p className="text-[11px] text-amber-200 m-0">
                12 Indian regional languages + Global B2B buyer translation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Toggle Tabs */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1 border-b border-amber-100 bg-amber-50/50">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'single'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Direct Live Pair
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>All 12 Languages Simultaneously</span>
            </button>
          </div>

          <span className="text-[11px] text-amber-800 font-semibold hidden sm:inline">
            Real-Time Translation
          </span>
        </div>

        {/* Main Content Area */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
          {/* Language Pair Selectors & Swap Bar */}
          <div className="flex items-center justify-between gap-2 bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
            {/* Source Selector */}
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-bold text-amber-800 uppercase block">
                Translate From:
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value as ExtendedLanguage)}
                className="w-full p-2 bg-white rounded-xl border border-amber-300 text-xs font-bold text-amber-950 focus:ring-2 focus:ring-amber-500"
              >
                {ALL_SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwapLanguages}
              className="mt-4 p-2.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 shadow-xs transition-transform active:scale-90"
              title="Swap languages"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            {/* Target Selector */}
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-bold text-amber-800 uppercase block">
                Translate To:
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as ExtendedLanguage)}
                className="w-full p-2 bg-white rounded-xl border border-amber-300 text-xs font-bold text-amber-950 focus:ring-2 focus:ring-amber-500"
              >
                {ALL_SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Craft Sample Buttons */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-900 block">
              Quick Craft Examples:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {SAMPLE_QUICK_PHRASES.map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(phrase)}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-[11px] font-semibold border border-amber-200 shrink-0 whitespace-nowrap"
                >
                  {phrase.slice(0, 30)}...
                </button>
              ))}
            </div>
          </div>

          {/* Input Box with Voice Trigger */}
          <div className="relative bg-white rounded-2xl border-2 border-amber-300 p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <span>{sourceMeta.flag}</span>
                <span>{sourceMeta.nativeName} Input</span>
              </span>

              <button
                onClick={handleToggleVoiceInput}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                }`}
                title="Toggle microphone"
              >
                {isRecording ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-amber-700" />}
                <span>{isRecording ? 'Listening...' : 'Speak'}</span>
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              placeholder={`Type or speak in ${sourceMeta.name}...`}
              className="w-full text-sm font-semibold text-amber-950 bg-transparent resize-none focus:outline-none placeholder-amber-800/40"
            />
          </div>

          {/* Output Mode: Single Pair View */}
          {activeTab === 'single' ? (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border-2 border-amber-300 p-3 shadow-xs space-y-2 relative">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-1.5">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span>{targetMeta.flag}</span>
                  <span>{targetMeta.nativeName} Translation</span>
                  {isTranslating && (
                    <span className="text-[10px] text-amber-600 font-mono animate-pulse">
                      Translating...
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSpeakTranslation}
                    className="p-1.5 rounded-lg bg-white border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors"
                    title="Listen to audio pronunciation"
                  >
                    <Volume2
                      className={`w-3.5 h-3.5 ${
                        isSpeaking ? 'text-rose-600 animate-bounce' : 'text-amber-600'
                      }`}
                    />
                  </button>

                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors"
                    title="Copy translation"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-amber-700" />
                    )}
                  </button>
                </div>
              </div>

              <div className="min-h-[70px] text-sm font-bold text-amber-950 leading-relaxed">
                {translatedText || (
                  <span className="text-stone-400 italic text-xs font-normal">
                    Real-time translation will appear here...
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Output Mode: All 12 Languages Grid View */
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-950 block">
                Simultaneous Live Translations Across All 12 Regional Languages:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {ALL_SUPPORTED_LANGUAGES.filter((l) => l.isRegional).map((lang) => {
                  const val = allTranslations[lang.code] || translatedText;
                  return (
                    <div
                      key={lang.code}
                      className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-amber-800 border-b border-amber-200/60 pb-0.5">
                        <span className="flex items-center gap-1">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName} ({lang.name})</span>
                        </span>
                        <button
                          onClick={() => speakText(val, lang.code as any)}
                          className="hover:text-amber-950"
                          title="Listen"
                        >
                          <Volume2 className="w-3 h-3 text-amber-600" />
                        </button>
                      </div>
                      <p className="font-semibold text-amber-950 m-0 leading-relaxed">
                        {val || '...'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-amber-100 bg-stone-50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100"
          >
            Close
          </button>

          <button
            onClick={handleApplyToDraft}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-transform hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply To Active Product Draft</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
