import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { VoiceWaveform } from '../common/VoiceWaveform';
import { Volume2, ArrowRight, Check, Sparkles, Mic, ChevronLeft } from 'lucide-react';
import { SpeechService, SpeechRecognitionResult } from '../../services/aiServices';

export const VoiceDescription: React.FC = () => {
  const { setArtisanView, setProductDraft } = useDemo();
  const { language, t, speakText, isSpeaking, stopSpeaking, supportedLanguages } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<SpeechRecognitionResult | null>(null);

  const activeLangMeta = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  const handleRecord = async () => {
    setIsRecording(true);
    // Simulate recording delay or capture real audio
    setTimeout(async () => {
      setIsRecording(false);
      const res = await SpeechService.processVoiceDescription(language);
      setResult(res);
      // Update draft with voice transcript
      setProductDraft((prev) => ({
        ...prev,
        origin: 'Madurai, Tamil Nadu',
      }));
    }, 1800);
  };

  const handleListenAudio = () => {
    if (!result) return;
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(result.transcript, language);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4 bg-white rounded-3xl border border-amber-200 shadow-md animate-fade-in">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-3">
        <button
          onClick={() => setArtisanView('image-review')}
          className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold hover:bg-amber-200 flex items-center gap-1 text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('back')}</span>
        </button>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
          <Mic className="w-3.5 h-3.5 text-amber-600" />
          <span>{activeLangMeta.nativeName} VOICE</span>
        </span>
      </div>

      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-amber-950 m-0">{t('voiceDescTitle')}</h2>
        <p className="text-xs text-amber-800 font-medium">
          {t('voiceDescSub')} ({activeLangMeta.name})
        </p>
      </div>

      {!result ? (
        <div className="space-y-4">
          <VoiceWaveform
            isRecording={isRecording}
            label={isRecording ? `${t('listening')}` : t('tapToSpeak')}
            sublabel={t('speakGuidelines')}
            onStartRecording={handleRecord}
            onStopRecording={() => setIsRecording(false)}
          />

          {/* Preset Demo Speech Trigger for Quick Demonstration */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center space-y-2">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              {activeLangMeta.nativeName} Speech Demonstration
            </span>
            <button
              onClick={handleRecord}
              className="w-full py-3 px-3 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-xl border border-amber-300 flex items-center justify-center gap-2 shadow-xs"
            >
              <Volume2 className="w-4 h-4 text-amber-700 animate-pulse" />
              <span>{t('simVoiceNarration')} ({activeLangMeta.name})</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {/* Audio Transcript Card */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{t('audioRecognized')} ({activeLangMeta.nativeName})</span>
              </span>
              <button
                onClick={handleListenAudio}
                className="text-xs text-amber-700 hover:text-amber-950 font-bold flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-amber-200 shadow-xs"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-rose-600 animate-bounce' : ''}`} />
                <span>{isSpeaking ? t('playingAudio') : t('listenAudio')}</span>
              </button>
            </div>

            {/* Regional Text Transcript */}
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-amber-950 text-sm font-semibold leading-relaxed shadow-xs">
              "{result.transcript}"
            </div>

            {/* English AI Translation Meaning */}
            <div>
              <span className="text-[10px] text-amber-700 font-bold block uppercase tracking-wider mb-1">
                AI Cross-Language Translation Meaning:
              </span>
              <p className="text-xs text-amber-900 bg-amber-100/60 p-2.5 rounded-xl border border-amber-200/80 m-0">
                "{result.translatedEnglish}"
              </p>
            </div>
          </div>

          <button
            onClick={() => setArtisanView('ai-processing')}
            className="w-full py-4 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base touch-btn transition-transform hover:scale-[1.01]"
          >
            <Sparkles className="w-5 h-5" />
            <span>{t('generateCatalog')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
