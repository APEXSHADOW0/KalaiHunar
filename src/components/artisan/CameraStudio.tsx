import React, { useState, useRef, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import {
  Camera,
  Flashlight,
  ArrowLeft,
  Sparkles,
  Upload,
  RefreshCw,
  Check,
  Wand2,
} from 'lucide-react';
import { AIVisionEnhancer } from '../../services/imageEnhancer';

const CRAFT_PRESETS = [
  {
    name: 'Terracotta Pottery',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
    type: 'Clay',
  },
  {
    name: 'Handloom Silk Saree',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    type: 'Silk',
  },
  {
    name: 'Heritage Brass Diya',
    url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=800',
    type: 'Brass',
  },
  {
    name: 'Teak Wood Carving',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    type: 'Wood',
  },
  {
    name: 'Eco Fiber Basket',
    url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=800',
    type: 'Fiber',
  },
];

export const CameraStudio: React.FC = () => {
  const { setArtisanView, setProductDraft } = useDemo();
  const [flashOn, setFlashOn] = useState(false);
  const [aiBoostMode, setAiBoostMode] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(CRAFT_PRESETS[0].url);
  const [enhancementPhase, setEnhancementPhase] = useState<number | null>(null);
  const [shutterFlash, setShutterFlash] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);

    let capturedUrl = previewImage;

    // If live camera is active, grab the live frame from video
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

    // Real-Time 4-Phase AI Enhancement Pipeline
    setEnhancementPhase(1);

    setTimeout(() => setEnhancementPhase(2), 220);
    setTimeout(() => setEnhancementPhase(3), 440);
    setTimeout(() => setEnhancementPhase(4), 660);

    // Run real pixel-level Canvas enhancement concurrently
    const enhancePromise = AIVisionEnhancer.enhance(capturedUrl, {
      preset: 'heritage_studio',
      sharpness: 45,
      contrast: 12,
      brightness: 6,
      saturation: 65,
    });

    const enhancedResult = await enhancePromise;

    setTimeout(() => {
      // Save original and real-time enhanced image to product draft
      setProductDraft((prev) => ({
        ...prev,
        originalImage: capturedUrl,
        enhancedImage: enhancedResult.enhancedDataUrl,
        qualityScore: {
          photo: enhancedResult.qualityScore,
          details: enhancedResult.metrics.sharpnessScore,
          description: 92,
          pricing: 88,
          overall: Math.round((enhancedResult.qualityScore + 92 + 88) / 3),
        },
      }));

      setIsCapturing(false);
      setEnhancementPhase(null);
      setArtisanView('image-review');
    }, 900);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setPreviewImage(dataUrl);
          setCameraActive(false);

          setEnhancementPhase(1);
          setTimeout(() => setEnhancementPhase(2), 200);
          setTimeout(() => setEnhancementPhase(3), 400);

          const enhancedResult = await AIVisionEnhancer.enhance(dataUrl, {
            preset: 'heritage_studio',
          });

          setProductDraft((prev) => ({
            ...prev,
            originalImage: dataUrl,
            enhancedImage: enhancedResult.enhancedDataUrl,
          }));

          setTimeout(() => {
            setEnhancementPhase(null);
            setArtisanView('image-review');
          }, 600);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    setPreviewImage(url);
    setCameraActive(false);
    setProductDraft((prev) => ({
      ...prev,
      originalImage: url,
    }));
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
          <span>{aiBoostMode ? 'Real-Time AI Boost Active' : 'AI Lens Normal'}</span>
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
            <span>Center Craft Item for Real-Time AI Lens</span>
          </span>
          <div className="w-full flex justify-between">
            <span className="w-4 h-4 border-b-2 border-l-2 border-amber-400"></span>
            <span className="w-4 h-4 border-b-2 border-r-2 border-amber-400"></span>
          </div>
        </div>

        {/* Real-Time AI Enhancement Progress Pipeline Overlay */}
        {enhancementPhase !== null && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-extrabold text-white m-0">
                Enhancing in Real Time...
              </h3>
              <p className="text-xs text-amber-300 font-medium">
                Pixel-level AI restoration & studio illumination
              </p>
            </div>

            <div className="w-full max-w-xs space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-200">
                {enhancementPhase >= 1 ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-amber-400 animate-spin"></div>
                )}
                <span>Extracting micro-textures & edge sharpness</span>
              </div>

              <div className="flex items-center gap-2 text-amber-200">
                {enhancementPhase >= 2 ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-amber-400 animate-spin"></div>
                )}
                <span>Balancing natural lighting & shadow neutralization</span>
              </div>

              <div className="flex items-center gap-2 text-amber-200">
                {enhancementPhase >= 3 ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-amber-400 animate-spin"></div>
                )}
                <span>Preserving authentic artisan pigments</span>
              </div>

              <div className="flex items-center gap-2 text-amber-200">
                {enhancementPhase >= 4 ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-amber-400 animate-spin"></div>
                )}
                <span>Generating luxury neutral studio backdrop</span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic AI Quality Tip */}
        <div className="absolute bottom-3 inset-x-3 bg-slate-950/90 border border-amber-400/40 rounded-xl p-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-amber-200 backdrop-blur-md z-10">
          <span>
            {cameraError
              ? `💡 ${cameraError}`
              : '💡 Real-time AI will automatically sharpen details and balance lighting upon capture.'}
          </span>
        </div>
      </div>

      {/* Choose from Craft Sample Presets (For Instant Testing) */}
      <div className="space-y-1.5 z-10 pb-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
          <span>Or Choose a Craft to Test:</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-amber-200 hover:text-white underline flex items-center gap-1"
          >
            <Upload className="w-3 h-3" />
            <span>Upload My Own Photo</span>
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CRAFT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectPreset(preset.url)}
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

        {/* Shutter Capture Button */}
        <button
          onClick={handleCapturePhoto}
          disabled={isCapturing}
          className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 transition-transform active:scale-90 shadow-2xl ${
            isCapturing ? 'scale-95 opacity-80' : 'hover:scale-105'
          }`}
          title="Take Photo with Real-Time AI Enhancement"
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
