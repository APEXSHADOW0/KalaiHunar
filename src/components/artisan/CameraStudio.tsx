import React, { useState, useRef, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Camera,
  Flashlight,
  ArrowLeft,
  Sparkles,
  Upload,
  RefreshCw,
  Check,
  Wand2,
  Mic,
  Square,
} from 'lucide-react';

const CRAFT_PRESETS = [
  {
    name: 'Terracotta Pottery',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
    type: 'Clay',
    voiceSample: 'Handcrafted traditional terracotta decorative doll sculpted from natural river clay. Ideal for home decor. Takes 2 days to make.',
    voiceSampleNative: 'இது மதுரையில் களிமண்ணால் செய்யப்பட்ட பாரம்பரிய மண் பொம்மை. வீட்டை அலங்கரிக்க சிறந்தது. செய்ய 2 நாட்கள் ஆகும்.',
  },
  {
    name: 'Handloom Silk Saree',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    type: 'Silk',
    voiceSample: 'Pure handloom silk saree woven on traditional pit loom with golden zari border. Production requires 4 days.',
    voiceSampleNative: 'இது காஞ்சிபுரம் தூய பட்டு மற்றும் ஜரிகை நெசவு சேலை. நெசவு செய்ய 4 நாட்கள் ஆகும்.',
  },
  {
    name: 'Heritage Brass Diya',
    url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=800',
    type: 'Brass',
    voiceSample: 'Traditional solid brass handmade diya lamp with intricate engraving for puja and heritage decor.',
    voiceSampleNative: 'இது பித்தளையால் வார்க்கப்பட்டு கையால் செதுக்கப்பட்ட பாரம்பரிய விளக்கு.',
  },
  {
    name: 'Teak Wood Carving',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    type: 'Wood',
    voiceSample: 'Hand-carved solid teak wood traditional sculpture sculpted with chisel. 25cm height.',
    voiceSampleNative: 'இது தேக்கு மரத்தில் கை உளியால் செதுக்கப்பட்ட பாரம்பரிய கலைப் பொருள்.',
  },
  {
    name: 'Eco Fiber Basket',
    url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=800',
    type: 'Fiber',
    voiceSample: 'Handcrafted eco-friendly kora grass storage basket braided from natural river grass.',
    voiceSampleNative: 'இயற்கை கோரை புல் கொண்டு கையால் பின்னப்பட்ட சூழல்-நட்பு சேமிப்பு கூடை.',
  },
];

export const CameraStudio: React.FC = () => {
  const { setArtisanView, setProductDraft } = useDemo();
  const { language, supportedLanguages } = useLanguage();

  const [flashOn, setFlashOn] = useState(false);
  const [aiBoostMode, setAiBoostMode] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(CRAFT_PRESETS[0].url);
  const [shutterFlash, setShutterFlash] = useState(false);

  // 2-Step (Photo + Voice) Flow State
  const [showVoicePrompt, setShowVoicePrompt] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string>(CRAFT_PRESETS[0].url);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const speechRecognizerRef = useRef<any>(null);

  const activeLangMeta = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  // Initialize camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
            setCameraActive(true);
          }
        })
        .catch(() => {
          setCameraActive(false);
          setCameraError('Webcam unavailable. You can upload an image or choose a craft preset below.');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Initialize Speech Recognition for live microphone input
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognizer = new SpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = activeLangMeta.bcp47 || 'ta-IN';

        recognizer.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          if (current.trim()) {
            setLiveTranscript(current);
          }
        };

        recognizer.onerror = () => {
          setIsRecording(false);
        };

        speechRecognizerRef.current = recognizer;
      } catch {
        // Speech recognition not supported
      }
    }
  }, [activeLangMeta]);

  // Step 1: User takes Photo
  const handleSnapPhoto = () => {
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);

    let capturedUrl = previewImage;

    // Grab video frame if camera is live
    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
          capturedUrl = canvas.toDataURL('image/jpeg', 0.9);
        } catch {
          capturedUrl = previewImage;
        }
      }
    }

    setCapturedImageUrl(capturedUrl);
    setProductDraft((prev) => ({
      ...prev,
      originalImage: capturedUrl,
    }));

    // Step 2 Trigger: Instantly open voice prompt for description
    setShowVoicePrompt(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setPreviewImage(dataUrl);
          setCapturedImageUrl(dataUrl);
          setCameraActive(false);
          setProductDraft((prev) => ({
            ...prev,
            originalImage: dataUrl,
          }));
          setShowVoicePrompt(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof CRAFT_PRESETS[0]) => {
    setPreviewImage(preset.url);
    setCapturedImageUrl(preset.url);
    setCameraActive(false);
    setProductDraft((prev) => ({
      ...prev,
      originalImage: preset.url,
      transcript: language === 'en' ? preset.voiceSample : preset.voiceSampleNative,
    }));
  };

  // Step 2: User provides Audio Description -> AI DOES EVERYTHING ELSE!
  const handleStartVoiceRecording = () => {
    setLiveTranscript('');
    setIsRecording(true);
    try {
      speechRecognizerRef.current?.start();
    } catch {
      // already active
    }
  };

  const handleStopVoiceAndTriggerAI = (customText?: string) => {
    setIsRecording(false);
    try {
      speechRecognizerRef.current?.stop();
    } catch {
      // ignore
    }

    const finalTranscript =
      customText ||
      liveTranscript.trim() ||
      (language === 'en'
        ? CRAFT_PRESETS[0].voiceSample
        : CRAFT_PRESETS[0].voiceSampleNative);

    // Save final audio description
    setProductDraft((prev) => ({
      ...prev,
      originalImage: capturedImageUrl,
      transcript: finalTranscript,
    }));

    // IMMEDIATELY TRIGGER AUTONOMOUS AI PIPELINE (AI DOES EVERYTHING!)
    setShowVoicePrompt(false);
    setArtisanView('autonomous-processing');
  };

  return (
    <div className="max-w-md mx-auto min-h-[85vh] flex flex-col justify-between p-4 bg-slate-950 text-white rounded-3xl shadow-2xl relative overflow-hidden animate-fade-in">
      {/* Hidden file input & capture canvas */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Shutter Flash Overlay */}
      {shutterFlash && (
        <div className="absolute inset-0 bg-white z-50 animate-fade-out pointer-events-none"></div>
      )}

      {/* Top Controls Bar */}
      <div className="flex items-center justify-between z-10">
        <button
          onClick={() => setArtisanView('home')}
          className="p-2.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Live AI Boost Toggle */}
        <button
          onClick={() => setAiBoostMode(!aiBoostMode)}
          className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 transition-all ${
            aiBoostMode
              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg ring-2 ring-amber-400/50'
              : 'bg-slate-800/80 text-amber-200 border border-amber-500/30'
          }`}
        >
          <Wand2 className={`w-3.5 h-3.5 ${aiBoostMode ? 'animate-spin' : ''}`} />
          <span>{aiBoostMode ? 'AI Autopilot Ready' : 'AI Lens Normal'}</span>
        </button>

        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${
            flashOn ? 'bg-amber-500 text-slate-950' : 'bg-slate-800/80 text-white'
          }`}
        >
          <Flashlight className="w-5 h-5" />
        </button>
      </div>

      {/* Camera Viewfinder */}
      <div className="relative flex-1 my-3 rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-slate-900 flex items-center justify-center min-h-[360px]">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
              aiBoostMode ? 'contrast-105 saturate-110 brightness-105' : ''
            }`}
          />
        ) : (
          <img
            src={previewImage}
            alt="Product viewfinder preview"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
              aiBoostMode ? 'contrast-105 saturate-110 brightness-105' : ''
            }`}
          />
        )}

        {/* Framing Guide Box */}
        <div className="relative w-64 h-64 border-2 border-dashed border-amber-400 rounded-2xl flex flex-col items-center justify-between p-3 pointer-events-none shadow-2xl z-10">
          <div className="w-full flex justify-between">
            <span className="w-4 h-4 border-t-2 border-l-2 border-amber-400"></span>
            <span className="w-4 h-4 border-t-2 border-r-2 border-amber-400"></span>
          </div>
          <span className="text-[11px] font-bold text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Step 1: Snap Photo (AI will enhance)</span>
          </span>
          <div className="w-full flex justify-between">
            <span className="w-4 h-4 border-b-2 border-l-2 border-amber-400"></span>
            <span className="w-4 h-4 border-b-2 border-r-2 border-amber-400"></span>
          </div>
        </div>

        {/* Dynamic Tip */}
        <div className="absolute bottom-3 inset-x-3 bg-slate-950/90 border border-amber-400/40 rounded-xl p-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-amber-200 backdrop-blur-md z-10">
          <span>
            {cameraError
              ? `💡 ${cameraError}`
              : '💡 Snap photo & speak description — AI handles enhancement, 12 languages & publishing!'}
          </span>
        </div>
      </div>

      {/* Step 2: Instant Voice Prompt Overlay (User gives voice, AI does the rest!) */}
      {showVoicePrompt && (
        <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-5 animate-fade-in">
          <div className="text-center space-y-1.5 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 mx-auto flex items-center justify-center shadow-lg animate-bounce">
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-white m-0">Step 2: Speak Audio Description</h3>
            <p className="text-xs text-amber-300 font-medium">
              Speak naturally in {activeLangMeta.name} ({activeLangMeta.nativeName})
            </p>
          </div>

          {/* Microphone Recording Button */}
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <button
              onClick={isRecording ? () => handleStopVoiceAndTriggerAI() : handleStartVoiceRecording}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 ring-4 ring-rose-400 animate-pulse text-white'
                  : 'bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 hover:scale-105'
              }`}
            >
              {isRecording ? <Square className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
              <span className="text-[10px] font-black uppercase mt-1">
                {isRecording ? 'Done (Run AI)' : 'Tap to Speak'}
              </span>
            </button>

            {/* Live speech preview if recording */}
            {isRecording && (
              <div className="p-3 bg-amber-950/80 rounded-xl border border-amber-500/60 text-center max-w-xs animate-pulse">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                  Listening in {activeLangMeta.name}...
                </span>
                <p className="text-xs text-white font-semibold italic m-0">
                  "{liveTranscript || 'Describe material, time to make, or use...'}"
                </p>
              </div>
            )}
          </div>

          {/* Quick Craft Voice Samples (1-Tap Test) */}
          <div className="space-y-2 bg-slate-900/90 p-3.5 rounded-2xl border border-amber-500/30">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
              <span>Or Select a Craft Voice Audio:</span>
              <span className="text-[10px] text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">1-Tap Autopilot</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {CRAFT_PRESETS.slice(0, 4).map((cp) => (
                <button
                  key={cp.name}
                  onClick={() =>
                    handleStopVoiceAndTriggerAI(
                      language === 'en' ? cp.voiceSample : cp.voiceSampleNative
                    )
                  }
                  className="p-2 bg-slate-800 hover:bg-amber-600/80 text-white rounded-xl text-left border border-slate-700 transition-colors text-xs"
                >
                  <span className="block font-bold text-amber-300">{cp.name}</span>
                  <span className="block text-[10px] text-stone-300 line-clamp-1">
                    {language === 'en' ? cp.voiceSample : cp.voiceSampleNative}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowVoicePrompt(false)}
            className="w-full py-2 text-xs font-semibold text-stone-400 hover:text-white"
          >
            Cancel / Retake Photo
          </button>
        </div>
      )}

      {/* Choose from Craft Sample Presets (For Instant Testing) */}
      <div className="space-y-1.5 z-10 pb-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
          <span>Choose a Craft Preset:</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-amber-200 hover:text-white underline flex items-center gap-1"
          >
            <Upload className="w-3 h-3" />
            <span>Upload Photo</span>
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CRAFT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectPreset(preset)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 border transition-all flex items-center gap-1.5 ${
                previewImage === preset.url && !cameraActive
                  ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                  : 'bg-slate-800/80 text-amber-100 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <span>{preset.name}</span>
              {previewImage === preset.url && !cameraActive && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Shutter & Gallery Controls */}
      <div className="flex items-center justify-around z-10 py-1 border-t border-slate-800/80 pt-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white flex flex-col items-center gap-1 text-[10px] border border-slate-700"
        >
          <Upload className="w-5 h-5 text-amber-400" />
          <span>Upload</span>
        </button>

        {/* Shutter Capture Button -> Triggers Step 2 Voice */}
        <button
          onClick={handleSnapPhoto}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 transition-transform active:scale-90 shadow-2xl hover:scale-105"
          title="Snap Photo"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </button>

        <button
          onClick={() => {
            if (navigator.mediaDevices) {
              setCameraActive(true);
            }
          }}
          className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white flex flex-col items-center gap-1 text-[10px] border border-slate-700"
        >
          <RefreshCw className={`w-5 h-5 text-amber-400 ${cameraActive ? 'animate-spin' : ''}`} />
          <span>Camera</span>
        </button>
      </div>
    </div>
  );
};
