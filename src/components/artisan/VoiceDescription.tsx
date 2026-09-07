import React, { useState, useRef, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { VoiceWaveform } from '../common/VoiceWaveform';
import { Volume2, ArrowRight, Check, Sparkles, Mic, ChevronLeft, Play, Square, RefreshCw, Edit3 } from 'lucide-react';
import { SpeechService, SpeechRecognitionResult } from '../../services/aiServices';

// Craft-specific voice prompt samples to assist artisans
const CRAFT_SAMPLE_PROMPTS = [
  {
    label: 'Terracotta / Clay',
    tamil: 'இது மதுரையில் களிமண்ணால் கையால் செய்யப்பட்ட பாரம்பரிய குதிரை பொம்மை. 20 செமீ உயரம். செய்ய 2 நாட்கள் ஆகும்.',
    english: 'Handcrafted traditional terracotta horse made with natural clay from Madurai. 20cm height. Takes 2 days to create.',
  },
  {
    label: 'Handloom Silk Saree',
    tamil: 'இது காஞ்சிபுரம் தூய பட்டு மற்றும் ஜரிகை நெசவு சேலை. 6.3 மீட்டர் நீளம். நெசவு செய்ய 4 நாட்கள் ஆகும்.',
    english: 'Pure Kanchipuram silk handloom saree with golden zari border. 6.3m length. Takes 4 days to weave.',
  },
  {
    label: 'Brass Diya / Metalware',
    tamil: 'இது பித்தளையால் வார்க்கப்பட்டு கையால் செதுக்கப்பட்ட பாரம்பரிய நந்தி விளக்கு. பூஜை மற்றும் அலங்காரத்திற்கு சிறந்தது.',
    english: 'Traditional solid brass handmade diya lamp with intricate carvings. Ideal for puja and festival decor.',
  },
  {
    label: 'Teak Wood Carving',
    tamil: 'இது தேக்கு மரத்தில் கை உளியால் செதுக்கப்பட்ட பாரம்பரிய கலைப் பொருள். 25 செமீ உயரம்.',
    english: 'Hand-carved solid teak wood traditional decor piece. Sculpted with chisel. 25cm height.',
  },
];

export const VoiceDescription: React.FC = () => {
  const { setArtisanView, setProductDraft, productDraft } = useDemo();
  const { language, t, speakText, isSpeaking, stopSpeaking, supportedLanguages } = useLanguage();

  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<SpeechRecognitionResult | null>(() => {
    if (productDraft.transcript) {
      return {
        language: language,
        transcript: productDraft.transcript,
        translatedEnglish: productDraft.transcript,
        confidence: 0.95,
      };
    }
    return null;
  });

  const [editableTranscript, setEditableTranscript] = useState('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(productDraft.audioUrl || null);
  const [isPlayingRecordedAudio, setIsPlayingRecordedAudio] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const speechRecognizerRef = useRef<any>(null);

  const activeLangMeta = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  // Initialize Speech Recognition if supported by browser
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognizer = new SpeechRecognition();
        recognizer.continuous = false;
        recognizer.interimResults = true;
        // Map language code to BCP 47 locale
        const localeMap: Record<string, string> = {
          ta: 'ta-IN',
          hi: 'hi-IN',
          en: 'en-IN',
          te: 'te-IN',
          kn: 'kn-IN',
          ml: 'ml-IN',
          bn: 'bn-IN',
          mr: 'mr-IN',
          gu: 'gu-IN',
          pa: 'pa-IN',
          or: 'or-IN',
          as: 'as-IN',
        };
        recognizer.lang = localeMap[language] || 'en-IN';

        recognizer.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setEditableTranscript(currentTranscript);
          }
        };

        recognizer.onerror = () => {
          // Fall back gracefully to simulation or manual typing
        };

        speechRecognizerRef.current = recognizer;
      } catch {
        // Recognition not supported
      }
    }
  }, [language]);

  const handleStartRealRecording = async () => {
    setRecordingError(null);
    setIsRecording(true);
    setEditableTranscript('');
    audioChunksRef.current = [];

    // 1. Try Browser MediaRecorder for real audio capture
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setRecordedAudioUrl(audioUrl);
            setProductDraft((prev) => ({
              ...prev,
              audioUrl,
            }));
          }
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
      } catch {
        setRecordingError('Microphone access not granted. Using simulated voice recognition.');
      }
    }

    // 2. Start Web Speech recognition if available
    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.start();
      } catch {
        // already started
      }
    }

    // 3. Auto-stop after 4.5 seconds if user doesn't stop manually
    setTimeout(() => {
      handleStopRealRecording();
    }, 4500);
  };

  const handleStopRealRecording = async () => {
    if (!isRecording) return;
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.stop();
      } catch {
        // ignore
      }
    }

    // Determine final transcript
    const userSpokenText = editableTranscript.trim();
    const res = await SpeechService.processVoiceDescription(language, userSpokenText || undefined);
    setResult(res);
    setEditableTranscript(res.transcript);

    // Update product draft with transcript
    setProductDraft((prev) => ({
      ...prev,
      transcript: res.transcript,
      origin: prev.origin || 'Madurai, Tamil Nadu',
    }));
  };

  const handleSelectCraftPrompt = async (tamilText: string, englishText: string) => {
    const textToUse = language === 'en' ? englishText : tamilText;
    const res: SpeechRecognitionResult = {
      language,
      transcript: textToUse,
      translatedEnglish: englishText,
      confidence: 0.96,
    };
    setResult(res);
    setEditableTranscript(textToUse);
    setProductDraft((prev) => ({
      ...prev,
      transcript: textToUse,
      origin: prev.origin || 'Madurai, Tamil Nadu',
    }));
  };

  const handleSaveEditedTranscript = () => {
    if (!result) return;
    const updated: SpeechRecognitionResult = {
      ...result,
      transcript: editableTranscript,
      translatedEnglish: editableTranscript,
    };
    setResult(updated);
    setIsEditingTranscript(false);
    setProductDraft((prev) => ({
      ...prev,
      transcript: editableTranscript,
    }));
  };

  const handleToggleRecordedAudio = () => {
    if (!recordedAudioUrl) {
      // If no mic recording was saved, use Web Speech Synthesis (TTS)
      if (isSpeaking) {
        stopSpeaking();
      } else if (result) {
        speakText(result.transcript, language);
      }
      return;
    }

    if (isPlayingRecordedAudio && audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlayingRecordedAudio(false);
    } else {
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio(recordedAudioUrl);
        audioElementRef.current.onended = () => setIsPlayingRecordedAudio(false);
      }
      audioElementRef.current.play();
      setIsPlayingRecordedAudio(true);
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

      {recordingError && (
        <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 font-medium">
          {recordingError}
        </div>
      )}

      {!result ? (
        <div className="space-y-4">
          <VoiceWaveform
            isRecording={isRecording}
            label={isRecording ? 'Listening... Speak your craft details' : t('tapToSpeak')}
            sublabel="Speak naturally in your mother tongue: material, craft method, size, days to make."
            onStartRecording={handleStartRealRecording}
            onStopRecording={handleStopRealRecording}
          />

          {/* Real-time speech preview while recording */}
          {isRecording && editableTranscript && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-center animate-pulse">
              <span className="text-[10px] uppercase font-bold text-amber-800 block mb-1">Live Speech Transcribing</span>
              <p className="text-xs font-bold text-amber-950 italic">"{editableTranscript}"</p>
            </div>
          )}

          {/* Quick Craft Voice Presets for Testing / Quick Entry */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider block">
                Quick Craft Voice Samples:
              </span>
              <span className="text-[10px] text-amber-700 font-semibold">1-Click Test</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CRAFT_SAMPLE_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCraftPrompt(p.tamil, p.english)}
                  className="p-2 text-left bg-white hover:bg-amber-50 rounded-xl border border-amber-200 text-[11px] font-bold text-amber-950 transition-all hover:border-amber-400 shadow-2xs"
                >
                  <span className="block text-amber-800 font-extrabold">{p.label}</span>
                  <span className="text-[10px] text-stone-500 font-normal line-clamp-1">{p.english}</span>
                </button>
              ))}
            </div>
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

              <div className="flex items-center gap-1.5">
                {/* Audio Playback Toggle */}
                <button
                  onClick={handleToggleRecordedAudio}
                  className="text-xs text-amber-700 hover:text-amber-950 font-bold flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-amber-200 shadow-xs"
                >
                  {isPlayingRecordedAudio || isSpeaking ? (
                    <>
                      <Square className="w-3.5 h-3.5 text-rose-600" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      {recordedAudioUrl ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{recordedAudioUrl ? 'Play Mic Voice' : t('listenAudio')}</span>
                    </>
                  )}
                </button>

                {/* Edit Transcript Toggle */}
                <button
                  onClick={() => setIsEditingTranscript(!isEditingTranscript)}
                  className="p-1 rounded-lg bg-white border border-amber-200 text-amber-800 hover:text-amber-950"
                  title="Edit Transcript"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Editable or Static Text Transcript */}
            {isEditingTranscript ? (
              <div className="space-y-2">
                <textarea
                  value={editableTranscript}
                  onChange={(e) => setEditableTranscript(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 text-xs font-semibold bg-white rounded-xl border border-amber-400 text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter custom craft description..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingTranscript(false)}
                    className="px-2.5 py-1 text-xs text-stone-600 font-bold bg-white rounded-lg border border-stone-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEditedTranscript}
                    className="px-3 py-1 text-xs text-white font-bold bg-amber-600 rounded-lg shadow-xs hover:bg-amber-700"
                  >
                    ✓ Save Text
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-amber-950 text-sm font-semibold leading-relaxed shadow-xs">
                "{result.transcript}"
              </div>
            )}

            {/* English AI Translation Meaning */}
            <div>
              <span className="text-[10px] text-amber-700 font-bold block uppercase tracking-wider mb-1">
                AI Cross-Language Translation Meaning:
              </span>
              <p className="text-xs text-amber-900 bg-amber-100/60 p-2.5 rounded-xl border border-amber-200/80 m-0">
                "{result.translatedEnglish}"
              </p>
            </div>

            {/* Retake Voice Option */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  setResult(null);
                  setRecordedAudioUrl(null);
                }}
                className="text-xs text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-record Voice</span>
              </button>
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
