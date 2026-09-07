import React, { useState, useEffect } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { Product } from '../../types';
import { AudioCatalogService, CatalogAudioScript } from '../../services/audioCatalogService';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Gauge, Globe } from 'lucide-react';

interface AudioCatalogPlayerProps {
  product: Partial<Product>;
  defaultLanguage?: SupportedLanguage;
  compact?: boolean;
  showLanguageSelector?: boolean;
}

export const AudioCatalogPlayer: React.FC<AudioCatalogPlayerProps> = ({
  product,
  defaultLanguage = 'ta',
  compact = false,
  showLanguageSelector = true,
}) => {
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(defaultLanguage);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number>(-1);
  const [speed, setSpeed] = useState<number>(0.95);
  const script: CatalogAudioScript = React.useMemo(
    () => AudioCatalogService.generateNarrationScript(product, activeLang),
    [product, activeLang]
  );

  // Clean up playback on unmount
  useEffect(() => {
    return () => {
      AudioCatalogService.stop();
    };
  }, []);

  const handlePlayToggle = () => {
    if (isPlaying) {
      AudioCatalogService.stop();
      setIsPlaying(false);
      setActiveSentenceIdx(-1);
    } else {
      setIsPlaying(true);
      AudioCatalogService.playCatalogNarration(
        script.sentences,
        activeLang,
        speed,
        (idx) => {
          setActiveSentenceIdx(idx);
          if (idx === -1) {
            setIsPlaying(false);
          }
        },
        () => {
          setIsPlaying(false);
          setActiveSentenceIdx(-1);
        }
      );
    }
  };

  const handleReplay = () => {
    AudioCatalogService.stop();
    setIsPlaying(true);
    AudioCatalogService.playCatalogNarration(
      script.sentences,
      activeLang,
      speed,
      (idx) => {
        setActiveSentenceIdx(idx);
        if (idx === -1) {
          setIsPlaying(false);
        }
      },
      () => {
        setIsPlaying(false);
        setActiveSentenceIdx(-1);
      }
    );
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying) {
      // Re-trigger with new speed
      AudioCatalogService.playCatalogNarration(
        script.sentences,
        activeLang,
        newSpeed,
        (idx) => {
          setActiveSentenceIdx(idx);
          if (idx === -1) setIsPlaying(false);
        },
        () => {
          setIsPlaying(false);
          setActiveSentenceIdx(-1);
        }
      );
    }
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setActiveLang(lang);
    if (isPlaying) {
      AudioCatalogService.stop();
      setIsPlaying(false);
      setActiveSentenceIdx(-1);
    }
  };

  const activeLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === activeLang) || SUPPORTED_LANGUAGES[0];

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200">
        <button
          onClick={handlePlayToggle}
          className={`p-1.5 rounded-lg font-bold flex items-center gap-1 text-xs transition-colors ${
            isPlaying
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
          title="Play Audio Catalog Narration"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'Pause' : `Listen (${activeLangMeta.nativeName})`}</span>
        </button>

        {isPlaying && (
          <div className="flex items-end gap-0.5 h-4">
            <span className="w-1 bg-amber-600 rounded-full animate-bounce h-3"></span>
            <span className="w-1 bg-amber-600 rounded-full animate-bounce h-4 delay-75"></span>
            <span className="w-1 bg-amber-600 rounded-full animate-bounce h-2 delay-150"></span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50/40 p-4 rounded-2xl border-2 border-amber-300 shadow-sm space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Real-Time Audio Catalog
              </span>
              <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded text-[10px] font-bold">
                AI Voice
              </span>
            </div>
            <p className="text-[11px] text-amber-800 font-medium m-0">
              Spoken narration in {activeLangMeta.name} ({activeLangMeta.nativeName})
            </p>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200 text-[10px] font-bold">
          <Gauge className="w-3 h-3 text-amber-700 ml-1" />
          <button
            onClick={() => handleSpeedChange(0.8)}
            className={`px-1.5 py-0.5 rounded-lg transition-colors ${
              speed === 0.8 ? 'bg-amber-600 text-white' : 'text-amber-900 hover:bg-amber-100'
            }`}
            title="Slower pace for maximum speech clarity"
          >
            0.8x
          </button>
          <button
            onClick={() => handleSpeedChange(0.95)}
            className={`px-1.5 py-0.5 rounded-lg transition-colors ${
              speed === 0.95 ? 'bg-amber-600 text-white' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            1.0x
          </button>
          <button
            onClick={() => handleSpeedChange(1.2)}
            className={`px-1.5 py-0.5 rounded-lg transition-colors ${
              speed === 1.2 ? 'bg-amber-600 text-white' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            1.2x
          </button>
        </div>
      </div>

      {/* Language Selector Tabs */}
      {showLanguageSelector && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-600" />
              <span>Select Audio Language (12):</span>
            </span>
            <span className="text-[10px] text-amber-700">Real-Time Sync</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => handleLanguageChange(l.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
                  activeLang === l.code
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {l.nativeName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Animated Frequency Waveform */}
      <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayToggle}
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md transition-transform active:scale-95 ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-300'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={handleReplay}
            className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition-colors"
            title="Replay from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div>
            <span className="text-xs font-bold text-amber-950 block">
              {isPlaying ? 'Playing Audio Narration...' : 'Listen in ' + activeLangMeta.name}
            </span>
            <span className="text-[10px] text-amber-700 font-medium">
              {isPlaying ? `Sentence ${(activeSentenceIdx >= 0 ? activeSentenceIdx : 0) + 1} of ${script.sentences.length}` : `${script.sentences.length} audio chapters`}
            </span>
          </div>
        </div>

        {/* Visual Frequency Bars */}
        <div className="flex items-end gap-1 h-7 pr-2">
          {[40, 75, 55, 90, 65, 80, 45, 95, 60, 70].map((h, i) => (
            <span
              key={i}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-amber-600 animate-pulse' : 'bg-amber-200'
              }`}
              style={{
                height: isPlaying ? `${Math.max(20, (h * ((i % 3) + 1)) % 100)}%` : '25%',
                animationDelay: `${i * 90}ms`,
              }}
            ></span>
          ))}
        </div>
      </div>

      {/* Real-time Sentence-by-Sentence Read-Along / Karaoke Highlighting */}
      <div className="space-y-1.5 bg-white/80 p-3 rounded-xl border border-amber-200/80">
        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>Real-Time Read-Along Script:</span>
        </div>

        <div className="space-y-1.5 text-xs">
          {script.sentences.map((sent, idx) => {
            const isCurrent = isPlaying && activeSentenceIdx === idx;
            return (
              <p
                key={idx}
                className={`p-2 rounded-lg transition-all leading-relaxed m-0 font-medium ${
                  isCurrent
                    ? 'bg-amber-100 text-amber-950 font-bold border-l-4 border-amber-600 shadow-2xs'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {sent}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};
