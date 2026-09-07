import React, { useState, useRef, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Camera, Flashlight, ArrowLeft, Sparkles, Upload, RefreshCw, Check } from 'lucide-react';

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
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(CRAFT_PRESETS[0].url);

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
          // Camera permission denied or not available
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

  const handleCapturePhoto = () => {
    setIsCapturing(true);

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

    // Save to product draft
    setProductDraft((prev) => ({
      ...prev,
      originalImage: capturedUrl,
    }));

    setTimeout(() => {
      setIsCapturing(false);
      setArtisanView('image-review');
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setPreviewImage(dataUrl);
          setCameraActive(false);
          setProductDraft((prev) => ({
            ...prev,
            originalImage: dataUrl,
          }));
          setArtisanView('image-review');
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

      {/* Top Controls Bar */}
      <div className="flex items-center justify-between z-10">
        <button
          onClick={() => setArtisanView('home')}
          className="p-2.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{cameraActive ? 'Live Camera Active' : 'AI Product Camera'}</span>
        </span>

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
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={previewImage}
            alt="Product viewfinder preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Framing Guide Box */}
        <div className="relative w-64 h-64 border-2 border-dashed border-amber-400 rounded-2xl flex flex-col items-center justify-between p-3 pointer-events-none shadow-2xl z-10">
          <div className="w-full flex justify-between">
            <span className="w-4 h-4 border-t-2 border-l-2 border-amber-400"></span>
            <span className="w-4 h-4 border-t-2 border-r-2 border-amber-400"></span>
          </div>
          <span className="text-[11px] font-bold text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-md">
            Place craft item inside frame
          </span>
          <div className="w-full flex justify-between">
            <span className="w-4 h-4 border-b-2 border-l-2 border-amber-400"></span>
            <span className="w-4 h-4 border-b-2 border-r-2 border-amber-400"></span>
          </div>
        </div>

        {/* Dynamic AI Quality Tip */}
        <div className="absolute bottom-3 inset-x-3 bg-slate-950/90 border border-amber-400/40 rounded-xl p-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-amber-200 backdrop-blur-md z-10">
          <span>{cameraError ? `💡 ${cameraError}` : '💡 AI Camera: Ensure natural light on physical details'}</span>
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
