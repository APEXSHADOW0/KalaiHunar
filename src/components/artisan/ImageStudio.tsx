import React, { useState, useEffect, useCallback } from 'react';
import { useDemo } from '../../context/DemoContext';
import { ImageSlider } from '../common/ImageSlider';
import {
  Check,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Sliders,
  Sun,
  Contrast,
  Zap,
  Palette,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AIVisionEnhancer, StudioPreset } from '../../services/imageEnhancer';

const STUDIO_PRESETS: { id: StudioPreset; name: string; icon: string; desc: string }[] = [
  { id: 'heritage_studio', name: 'Heritage Studio', icon: '🏛️', desc: 'Balanced neutral backdrop & soft rim light' },
  { id: 'vibrant_craft', name: 'Vibrant Colors', icon: '🎨', desc: 'Boosts natural dyes, clay & silk saturation' },
  { id: 'b2b_clean', name: 'B2B Catalog', icon: '🏢', desc: 'Minimal white commercial e-commerce presentation' },
  { id: 'warm_glow', name: 'Warm Glow', icon: '☀️', desc: 'Warm amber lighting for rustic wood & terracotta' },
  { id: 'hd_sharpness', name: 'Intricate HD', icon: '🔍', desc: 'High-pass unsharp mask for fine filigree & weave' },
];

export const ImageStudio: React.FC = () => {
  const { setArtisanView, productDraft, setProductDraft } = useDemo();
  const [analyzing, setAnalyzing] = useState<boolean>(() => !productDraft.enhancedImage);
  const [activePreset, setActivePreset] = useState<StudioPreset>('heritage_studio');
  const [showTuning, setShowTuning] = useState(false);

  // Real-time enhancement parameters
  const [brightness, setBrightness] = useState(6);
  const [contrast, setContrast] = useState(12);
  const [sharpness, setSharpness] = useState(45);
  const [saturation, setSaturation] = useState(65);
  const [qualityScore, setQualityScore] = useState(94);
  const [metrics, setMetrics] = useState({
    sharpnessScore: 92,
    lightingBalanceScore: 94,
    colorVibrancyScore: 96,
  });

  const originalSrc =
    productDraft.originalImage ||
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800';

  const [currentEnhancedSrc, setCurrentEnhancedSrc] = useState<string>(
    productDraft.enhancedImage || originalSrc
  );

  // Apply real-time enhancement
  const recomputeEnhancement = useCallback(
    async (
      preset: StudioPreset,
      b: number,
      c: number,
      sh: number,
      sat: number
    ) => {
      const res = await AIVisionEnhancer.enhance(originalSrc, {
        preset,
        brightness: b,
        contrast: c,
        sharpness: sh,
        saturation: sat,
      });

      setCurrentEnhancedSrc(res.enhancedDataUrl);
      setQualityScore(res.qualityScore);
      setMetrics(res.metrics);

      setProductDraft((prev) => ({
        ...prev,
        enhancedImage: res.enhancedDataUrl,
        qualityScore: {
          photo: res.qualityScore,
          details: res.metrics.sharpnessScore,
          description: 92,
          pricing: 88,
          overall: Math.round((res.qualityScore + 92 + 88) / 3),
        },
      }));
    },
    [originalSrc, setProductDraft]
  );

  // Initial load enhancement
  useEffect(() => {
    if (!productDraft.enhancedImage) {
      let isMounted = true;
      recomputeEnhancement(activePreset, brightness, contrast, sharpness, saturation).then(() => {
        if (isMounted) setAnalyzing(false);
      });
      return () => {
        isMounted = false;
      };
    }
  }, [productDraft.enhancedImage, activePreset, brightness, contrast, sharpness, saturation, recomputeEnhancement]);

  const handleSelectPreset = async (presetId: StudioPreset) => {
    setActivePreset(presetId);

    let newB = 6;
    let newC = 12;
    let newSh = 45;
    let newSat = 65;

    if (presetId === 'vibrant_craft') {
      newSat = 85;
      newC = 18;
      newB = 8;
    } else if (presetId === 'b2b_clean') {
      newB = 10;
      newC = 14;
      newSat = 52;
      newSh = 50;
    } else if (presetId === 'warm_glow') {
      newB = 8;
      newC = 8;
      newSat = 72;
    } else if (presetId === 'hd_sharpness') {
      newSh = 80;
      newC = 20;
    }

    setBrightness(newB);
    setContrast(newC);
    setSharpness(newSh);
    setSaturation(newSat);

    await recomputeEnhancement(presetId, newB, newC, newSh, newSat);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4 bg-white rounded-3xl border border-amber-200 shadow-md animate-fade-in">
      {/* Header Title */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>REAL-TIME AI PRODUCT STUDIO</span>
        </span>
        <h2 className="text-2xl font-bold text-amber-950 m-0">Image Presentation Studio</h2>
        <p className="text-xs text-amber-800 font-medium">
          Background cleaned while 100% preserving your handmade craft shape & color
        </p>
      </div>

      {analyzing ? (
        <div className="p-8 text-center bg-amber-50/60 rounded-2xl border border-amber-200 space-y-4">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-amber-950">Enhancing photo details in real time...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* AI Photo Quality Analysis Card with Live Metrics */}
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-amber-950 border-b border-amber-200 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>AI Photo Quality Score</span>
              </span>
              <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2.5 py-0.5 rounded-full text-xs">
                {qualityScore}% Excellent
              </span>
            </div>

            {/* Micro Metrics Grid */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold text-center">
              <div className="bg-white p-1.5 rounded-xl border border-amber-200/80">
                <span className="text-stone-500 block text-[10px]">Sharpness</span>
                <span className="font-bold text-amber-950">{metrics.sharpnessScore}%</span>
              </div>
              <div className="bg-white p-1.5 rounded-xl border border-amber-200/80">
                <span className="text-stone-500 block text-[10px]">Lighting</span>
                <span className="font-bold text-amber-950">{metrics.lightingBalanceScore}%</span>
              </div>
              <div className="bg-white p-1.5 rounded-xl border border-amber-200/80">
                <span className="text-stone-500 block text-[10px]">Color Vibrancy</span>
                <span className="font-bold text-amber-950">{metrics.colorVibrancyScore}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-amber-900 pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Micro-details & grain sharpened</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Natural studio isolation applied</span>
              </div>
            </div>
          </div>

          {/* Interactive Before / After Image Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 px-1">
              <span>Drag slider to compare Before & After:</span>
              <span className="text-amber-700 font-mono">100% Authentic Craft</span>
            </div>
            <ImageSlider
              originalSrc={originalSrc}
              enhancedSrc={currentEnhancedSrc}
            />
          </div>

          {/* 1-Click AI Studio Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              1-Click AI Studio Styles:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {STUDIO_PRESETS.slice(0, 3).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    activePreset === preset.id
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-stone-50 hover:bg-amber-50 text-stone-900 border-stone-200'
                  }`}
                >
                  <span className="text-base block mb-0.5">{preset.icon}</span>
                  <span className="text-[11px] font-bold block leading-tight">{preset.name}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {STUDIO_PRESETS.slice(3).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    activePreset === preset.id
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-stone-50 hover:bg-amber-50 text-stone-900 border-stone-200'
                  }`}
                >
                  <span className="text-base block mb-0.5">{preset.icon}</span>
                  <span className="text-[11px] font-bold block leading-tight">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Fine-Tuning Drawer */}
          <div className="border border-amber-200 rounded-2xl overflow-hidden bg-stone-50/70 text-xs">
            <button
              onClick={() => setShowTuning(!showTuning)}
              className="w-full p-2.5 bg-amber-100/60 hover:bg-amber-100 text-amber-950 font-bold flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-700" />
                <span>Fine-Tune AI Settings in Real Time</span>
              </div>
              {showTuning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTuning && (
              <div className="p-3 space-y-3 bg-white border-t border-amber-200">
                {/* Sharpness Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-amber-950">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-600" />
                      <span>Edge HD Sharpness</span>
                    </span>
                    <span>{sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sharpness}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSharpness(val);
                      recomputeEnhancement(activePreset, brightness, contrast, val, saturation);
                    }}
                    className="w-full accent-amber-600"
                  />
                </div>

                {/* Brightness Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-amber-950">
                    <span className="flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-600" />
                      <span>Natural Illumination</span>
                    </span>
                    <span>{brightness > 0 ? `+${brightness}%` : `${brightness}%`}</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={brightness}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBrightness(val);
                      recomputeEnhancement(activePreset, val, contrast, sharpness, saturation);
                    }}
                    className="w-full accent-amber-600"
                  />
                </div>

                {/* Saturation Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-amber-950">
                    <span className="flex items-center gap-1">
                      <Palette className="w-3 h-3 text-amber-600" />
                      <span>Artisan Pigment Vibrancy</span>
                    </span>
                    <span>{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="95"
                    value={saturation}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSaturation(val);
                      recomputeEnhancement(activePreset, brightness, contrast, sharpness, val);
                    }}
                    className="w-full accent-amber-600"
                  />
                </div>

                {/* Contrast Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-amber-950">
                    <span className="flex items-center gap-1">
                      <Contrast className="w-3 h-3 text-amber-600" />
                      <span>Studio Contrast</span>
                    </span>
                    <span>{contrast > 0 ? `+${contrast}%` : `${contrast}%`}</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="35"
                    value={contrast}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setContrast(val);
                      recomputeEnhancement(activePreset, brightness, val, sharpness, saturation);
                    }}
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => setArtisanView('voice-description')}
              className="w-full py-4 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base touch-btn transition-transform hover:scale-[1.01]"
            >
              <span>✓ Continue with Enhanced Studio Photo</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setArtisanView('camera')}
              className="w-full py-2.5 px-4 bg-white hover:bg-amber-50 text-amber-900 font-semibold rounded-xl border border-amber-300 text-xs flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Photo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
