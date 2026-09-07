import React, { useState } from 'react';
import { ShieldCheck, Sliders } from 'lucide-react';

interface ImageSliderProps {
  originalSrc: string;
  enhancedSrc: string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ originalSrc, enhancedSrc }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientPositionX: number, containerRect: DOMRect) => {
    const x = clientPositionX - containerRect.left;
    let percentage = (x / containerRect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Authenticity Preserved Badge */}
      <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Authenticity Preserved ✓</span>
        <span className="text-[10px] text-emerald-600 font-normal pl-1 border-l border-emerald-200">No details invented</span>
      </div>

      {/* Slider Container */}
      <div
        className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden shadow-xl border-2 border-amber-200 select-none cursor-ew-resize touch-none bg-stone-100"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        {/* Background Image: AI Enhanced Studio */}
        <img
          src={enhancedSrc}
          alt="AI Enhanced Studio"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Foreground Image: Original Raw Photo (Clipped by slider position) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalSrc}
            alt="Original Artisan Photo"
            className="absolute top-0 left-0 w-full h-full object-cover max-w-none"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Vertical Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
            <Sliders className="w-4 h-4" />
          </div>
        </div>

        {/* Labels Overlay */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md z-10">
          📷 ORIGINAL
        </div>
        <div className="absolute bottom-3 right-3 bg-amber-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md z-10">
          ✨ AI STUDIO
        </div>
      </div>

      {/* Helper instruction below slider */}
      <p className="mt-2 text-xs text-amber-800/70 font-medium">
        Drag slider left/right to compare raw photo vs AI studio presentation
      </p>
    </div>
  );
};
