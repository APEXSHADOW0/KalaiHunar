import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { Check, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export const AIExtraction: React.FC = () => {
  const { setArtisanView, productDraft, setProductDraft } = useDemo();
  const [processingStep, setProcessingStep] = useState(0);
  const [dimensionsValue, setDimensionsValue] = useState(productDraft.dimensions || '18cm x 10cm x 8cm');

  const steps = [
    '✓ Regional voice recognized',
    '✓ Language acoustics analyzed',
    '✓ Product category classified: Handicraft → Home Decor',
    '✓ Material identified: Natural Clay / Terracotta',
    '✓ Usage identified: Home & Living Decoration',
    '✓ Production lead time extracted: 2 Days',
    '✓ Generating 12 Regional Language Catalogs...',
  ];

  const isDoneProcessing = processingStep >= steps.length;

  useEffect(() => {
    if (processingStep < steps.length) {
      const timer = setTimeout(() => {
        setProcessingStep((prev) => prev + 1);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [processingStep, steps.length]);

  const handleConfirmDimensions = () => {
    setProductDraft((prev) => ({
      ...prev,
      dimensions: dimensionsValue,
      confidenceScores: {
        ...(prev.confidenceScores || { category: 0.96, material: 0.94, usage: 0.92, dimensions: 0.65 }),
        dimensions: 0.95 // Upgraded to high confidence
      }
    }));
  };

  return (
    <div className="max-w-md mx-auto space-y-5 p-4 bg-white rounded-3xl border border-amber-200 shadow-md">
      {/* Title */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>STRUCTURED PRODUCT EXTRACTION</span>
        </span>
        <h2 className="text-2xl font-bold text-amber-950 m-0">AI Attributes Understanding</h2>
        <p className="text-xs text-amber-800 font-medium">
          Unstructured voice description converted into structured commerce data
        </p>
      </div>

      {!isDoneProcessing ? (
        <div className="p-6 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900 border-b border-amber-200 pb-2">
            <span>AI Understanding Engine</span>
            <span className="text-amber-600 animate-pulse font-mono">Processing...</span>
          </div>

          <div className="space-y-2">
            {steps.slice(0, processingStep).map((stepText, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-amber-950 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{stepText}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {/* Extracted Attributes Cards */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
            {/* Category */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Category</span>
                <span className="text-sm font-bold text-amber-950">Handicraft → Home Decor</span>
              </div>
              <ConfidenceBadge score={0.96} />
            </div>

            {/* Material */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Material</span>
                <span className="text-sm font-bold text-amber-950">Natural Clay (Terracotta)</span>
              </div>
              <ConfidenceBadge score={0.94} />
            </div>

            {/* Craft Method */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Craft Method</span>
                <span className="text-sm font-bold text-amber-950">Handmade Pottery</span>
              </div>
              <ConfidenceBadge score={0.92} />
            </div>

            {/* Production Time */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Production Time</span>
                <span className="text-sm font-bold text-amber-950">2 Days</span>
              </div>
              <ConfidenceBadge score={0.92} />
            </div>

            {/* Dimensions (CONFIDENCE-AWARE HIGHLIGHT) */}
            <div className="p-3 bg-amber-100/70 rounded-xl border-2 border-amber-300 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Dimensions (Height & Width)</span>
                  <span className="text-sm font-bold text-amber-950">{dimensionsValue}</span>
                </div>
                <ConfidenceBadge score={productDraft.confidenceScores?.dimensions || 0.65} />
              </div>

              {(productDraft.confidenceScores?.dimensions ?? 0.65) < 0.8 && (
                <div className="pt-2 border-t border-amber-200 text-xs">
                  <p className="text-amber-900 font-semibold mb-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>AI asks: Please confirm product dimensions</span>
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={dimensionsValue}
                      onChange={(e) => setDimensionsValue(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-amber-300 text-xs font-bold bg-white"
                      placeholder="e.g. 18cm x 10cm x 8cm"
                    />
                    <button
                      onClick={handleConfirmDimensions}
                      className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg text-xs hover:bg-amber-700"
                    >
                      ✓ Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setArtisanView('catalog-review')}
            className="w-full py-4 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 text-base touch-btn"
          >
            <span>✓ Review Multilingual Catalog</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
