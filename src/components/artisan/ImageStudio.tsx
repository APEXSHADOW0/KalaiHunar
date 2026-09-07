import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { ImageSlider } from '../common/ImageSlider';
import { Check, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { VisionService, ImageAnalysisResult } from '../../services/aiServices';

export const ImageStudio: React.FC = () => {
  const { setArtisanView, productDraft } = useDemo();
  const [analyzing, setAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState<ImageAnalysisResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    VisionService.analyzeImage(productDraft.originalImage || '').then((res) => {
      if (isMounted) {
        setAnalysis(res);
        setAnalyzing(false);
      }
    });
    return () => { isMounted = false; };
  }, [productDraft.originalImage]);

  return (
    <div className="max-w-md mx-auto space-y-5 p-4 bg-white rounded-3xl border border-amber-200 shadow-md">
      {/* Header Title */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>AI PRODUCT STUDIO</span>
        </span>
        <h2 className="text-2xl font-bold text-amber-950 m-0">Image Presentation Studio</h2>
        <p className="text-xs text-amber-800 font-medium">
          Background cleaned while 100% preserving your handmade craft shape & color
        </p>
      </div>

      {analyzing ? (
        <div className="p-8 text-center bg-amber-50/60 rounded-2xl border border-amber-200 space-y-4">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-amber-950">Analyzing photo lighting & background...</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* AI Photo Quality Analysis Card */}
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-amber-950 mb-1 border-b border-amber-200 pb-1">
              <span>Photo Quality Analysis</span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                {analysis?.qualityScore || 92}% Excellent
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-amber-900">
              {(analysis?.recommendations || [
                '✓ Product detected and centered',
                '✓ Natural lighting balanced',
                '✓ Studio background cleaned',
              ]).map((rec, i) => (
                <div key={i} className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Before / After Image Slider */}
          <ImageSlider
            originalSrc={productDraft.originalImage || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800'}
            enhancedSrc={productDraft.enhancedImage || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800'}
          />

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setArtisanView('voice-description')}
              className="w-full py-4 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 text-base touch-btn"
            >
              <span>✓ Continue with Studio Photo</span>
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
