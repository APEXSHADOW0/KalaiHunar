import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { SupportedLanguage } from '../../i18n/translations';
import { VoiceWaveform } from '../common/VoiceWaveform';
import { Check, Mic, ArrowRight, Volume2, Globe } from 'lucide-react';
import { SpeechService } from '../../services/aiServices';

export const ArtisanOnboarding: React.FC = () => {
  const { setArtisanView } = useDemo();
  const { language, setLanguage, supportedLanguages, speakText, isSpeaking, stopSpeaking } = useLanguage();
  const [step, setStep] = useState<'language' | 'voice'>('language');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [aiUnderstood, setAiUnderstood] = useState<{
    transcript: string;
    translated: string;
    location: string;
    craft: string;
  } | null>(null);

  const activeLangMeta = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  const handleSelectLanguage = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    setStep('voice');
  };

  const handleStartVoiceOnboarding = async () => {
    setIsRecording(true);
    setIsProcessed(false);

    setTimeout(async () => {
      setIsRecording(false);
      const res = await SpeechService.processVoiceOnboarding(language);
      setAiUnderstood(res);
      setIsProcessed(true);
    }, 1800);
  };

  const handleListenResult = () => {
    if (!aiUnderstood) return;
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(`${aiUnderstood.transcript}. ${aiUnderstood.translated}`, language);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-[80vh] flex flex-col justify-between p-5 bg-amber-50/60 rounded-3xl shadow-md border border-amber-200 animate-fade-in">
      {step === 'language' ? (
        <div className="flex-1 flex flex-col justify-center py-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg">
            <Globe className="w-8 h-8 text-amber-100" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-amber-950 m-0">Select Your Regional Language</h2>
            <p className="text-xs text-amber-800 font-medium mt-1">
              KALAIHUNAR listens, processes, and speaks in your mother tongue
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1 scrollbar-thin">
            {supportedLanguages.map((l) => (
              <button
                key={l.code}
                onClick={() => handleSelectLanguage(l.code)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  language === l.code
                    ? 'bg-amber-600 text-white font-bold border-amber-600 shadow-sm'
                    : 'bg-white text-amber-950 border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                <div>
                  <span className="text-sm font-bold block leading-tight">{l.nativeName}</span>
                  <span className={`text-[10px] ${language === l.code ? 'text-amber-100' : 'text-amber-700'}`}>
                    {l.name}
                  </span>
                </div>
                {language === l.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between py-2 space-y-4">
          <div>
            <div className="text-center mb-4 space-y-1">
              <span className="inline-block px-3 py-1 bg-amber-200/80 text-amber-900 rounded-full text-xs font-bold">
                STEP 2 OF 2 — VOICE ONBOARDING ({activeLangMeta.nativeName})
              </span>
              <h2 className="text-2xl font-bold text-amber-950 m-0">Tell us about yourself</h2>
              <p className="text-xs text-amber-800 font-medium">
                Example: "{activeLangMeta.samplePhrase}"
              </p>
            </div>

            {!isProcessed ? (
              <div className="space-y-4">
                <VoiceWaveform
                  isRecording={isRecording}
                  label={isRecording ? `Listening in ${activeLangMeta.name}...` : 'Tap microphone & speak'}
                  sublabel="Say your name, location cluster, and primary craft"
                  onStartRecording={handleStartVoiceOnboarding}
                  onStopRecording={() => setIsRecording(false)}
                />

                <div className="text-center">
                  <button
                    onClick={handleStartVoiceOnboarding}
                    className="py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-xs font-bold border border-amber-300"
                  >
                    Quick-Play {activeLangMeta.nativeName} Demo Narration
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-md mb-4 animate-fade-in space-y-3">
                <div className="flex items-center justify-between text-emerald-700 text-sm font-bold">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-5 h-5 bg-emerald-100 rounded-full p-0.5" />
                    <span>AI Understood:</span>
                  </div>
                  <button
                    onClick={handleListenResult}
                    className="text-xs text-amber-700 hover:text-amber-950 font-bold flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>
                </div>

                <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 font-semibold text-amber-950 text-sm">
                  "{aiUnderstood?.transcript}"
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-amber-900">
                  <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
                    <span className="text-amber-700 block text-[10px]">Location Cluster:</span>
                    <span className="font-bold">{aiUnderstood?.location}</span>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
                    <span className="text-amber-700 block text-[10px]">Identified Craft:</span>
                    <span className="font-bold">{aiUnderstood?.craft}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setArtisanView('home')}
                    className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md touch-btn"
                  >
                    <span>✓ Confirm & Start</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleStartVoiceOnboarding}
                    className="py-3 px-3 border border-amber-300 text-amber-900 font-semibold rounded-xl hover:bg-amber-100 text-xs flex items-center gap-1"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Re-speak</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center pt-2 border-t border-amber-200/60">
            <button
              onClick={() => setArtisanView('home')}
              className="text-xs text-amber-800 underline font-semibold hover:text-amber-950"
            >
              Skip onboarding & go to Artisan Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
