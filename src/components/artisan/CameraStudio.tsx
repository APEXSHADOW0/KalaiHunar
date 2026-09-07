import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Camera, Image as ImageIcon, Flashlight, ArrowLeft, Sparkles } from 'lucide-react';

export const CameraStudio: React.FC = () => {
  const { setArtisanView } = useDemo();
  const [flashOn, setFlashOn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapturePhoto = () => {
    setIsCapturing(true);
    // Simulate photo capture delay
    setTimeout(() => {
      setIsCapturing(false);
      setArtisanView('image-review');
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto min-h-[80vh] flex flex-col justify-between p-4 bg-slate-950 text-white rounded-3xl shadow-2xl relative overflow-hidden">
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
          <span>AI Product Camera</span>
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

      {/* Camera Viewfinder Simulation */}
      <div className="relative flex-1 my-4 rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-slate-900 flex items-center justify-center">
        {/* Sample Captured Clay Doll Image Background */}
        <img
          src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800"
          alt="Product viewfinder preview"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />

        {/* Product Framing Guide Box */}
        <div className="relative w-64 h-64 border-2 border-dashed border-amber-400 rounded-2xl flex flex-col items-center justify-between p-3 pointer-events-none shadow-2xl">
          <div className="w-full flex justify-between">
            <span className="w-4 h-4 border-t-2 border-l-2 border-amber-400"></span>
            <span className="w-4 h-4 border-t-2 border-r-2 border-amber-400"></span>
          </div>
          <span className="text-[11px] font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded backdrop-blur-md">
            Place product inside frame
          </span>
          <div className="w-full flex justify-between">
            <span className="w-4 h-4 border-b-2 border-l-2 border-amber-400"></span>
            <span className="w-4 h-4 border-b-2 border-r-2 border-amber-400"></span>
          </div>
        </div>

        {/* Dynamic AI Tip Floating Banner */}
        <div className="absolute bottom-4 inset-x-4 bg-slate-950/90 border border-amber-400/40 rounded-xl p-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-amber-200 backdrop-blur-md animate-pulse">
          <span>💡 AI Tip: Move closer to illuminate craft details</span>
        </div>
      </div>

      {/* Bottom Shutter & Gallery Controls */}
      <div className="flex items-center justify-around z-10 py-2">
        <button
          onClick={handleCapturePhoto}
          className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex flex-col items-center gap-1 text-[10px]"
        >
          <ImageIcon className="w-5 h-5 text-amber-400" />
          <span>Gallery</span>
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

        <div className="w-12"></div> {/* Balance flex alignment */}
      </div>
    </div>
  );
};
