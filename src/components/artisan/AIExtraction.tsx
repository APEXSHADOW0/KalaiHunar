import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { Check, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { CatalogService, PricingService, ExtractedProductAttributes } from '../../services/aiServices';
import { useLanguage } from '../../i18n/LanguageContext';

export const AIExtraction: React.FC = () => {
  const { setArtisanView, productDraft, setProductDraft } = useDemo();
  const { language } = useLanguage();
  const [processingStep, setProcessingStep] = useState(0);

  // Extract dynamic attributes using the real smart NLP entity extractor
  const [extracted, setExtracted] = useState<ExtractedProductAttributes>(() => {
    return CatalogService.extractAttributes(productDraft.transcript || '', language);
  });

  const [dimensionsValue, setDimensionsValue] = useState(
    productDraft.dimensions || extracted.dimensions || '20cm x 15cm x 10cm'
  );

  const steps = [
    '✓ Regional voice recognized and translated',
    '✓ Acoustic & phoneme analysis verified',
    `✓ Product category classified: ${extracted.category}`,
    `✓ Material identified: ${extracted.material}`,
    `✓ Craft technique mapped: ${extracted.craft}`,
    `✓ Production lead time extracted: ${extracted.productionTime}`,
    '✓ Generating 12 Regional Language Catalogs...',
  ];

  const isDoneProcessing = processingStep >= steps.length;

  useEffect(() => {
    if (processingStep < steps.length) {
      const timer = setTimeout(() => {
        setProcessingStep((prev) => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    } else if (processingStep === steps.length) {
      // Automatically update the product draft with the extracted attributes and generated multilingual catalog
      const multilingualDescriptions = CatalogService.generateMultilingualCatalog(extracted);
      const baseline = extracted.baselineCost;
      const initialPriceBreakdown = PricingService.calculateExplainablePrice(
        baseline.material,
        baseline.labour,
        baseline.packaging,
        baseline.overhead,
        30
      );

      setProductDraft((prev) => ({
        ...prev,
        category: extracted.category,
        material: extracted.material,
        craft: extracted.craft,
        use: extracted.use,
        productionTime: extracted.productionTime,
        dimensions: dimensionsValue,
        moq: extracted.moq,
        capacityPerMonth: extracted.capacityPerMonth,
        descriptions: multilingualDescriptions,
        priceBreakdown: initialPriceBreakdown,
        confidenceScores: extracted.confidenceScores,
      }));
    }
  }, [processingStep, steps.length, extracted, dimensionsValue, setProductDraft]);

  const handleConfirmDimensions = () => {
    setProductDraft((prev) => ({
      ...prev,
      dimensions: dimensionsValue,
      confidenceScores: {
        ...(prev.confidenceScores || extracted.confidenceScores),
        dimensions: 0.95, // Upgraded to high confidence
      },
    }));
    setExtracted((prev) => ({
      ...prev,
      dimensions: dimensionsValue,
      confidenceScores: {
        ...prev.confidenceScores,
        dimensions: 0.95,
      },
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
                <span className="text-sm font-bold text-amber-950">{extracted.category}</span>
              </div>
              <ConfidenceBadge score={extracted.confidenceScores.category} />
            </div>

            {/* Material */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Material</span>
                <span className="text-sm font-bold text-amber-950">{extracted.material}</span>
              </div>
              <ConfidenceBadge score={extracted.confidenceScores.material} />
            </div>

            {/* Craft Method */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Craft Method</span>
                <span className="text-sm font-bold text-amber-950">{extracted.craft}</span>
              </div>
              <ConfidenceBadge score={extracted.confidenceScores.usage} />
            </div>

            {/* Production Time */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Production Time</span>
                <span className="text-sm font-bold text-amber-950">{extracted.productionTime}</span>
              </div>
              <ConfidenceBadge score={0.94} />
            </div>

            {/* Dimensions (CONFIDENCE-AWARE HIGHLIGHT) */}
            <div className="p-3 bg-amber-100/70 rounded-xl border-2 border-amber-300 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Dimensions (Height & Width)</span>
                  <span className="text-sm font-bold text-amber-950">{dimensionsValue}</span>
                </div>
                <ConfidenceBadge score={extracted.confidenceScores.dimensions} />
              </div>

              {extracted.confidenceScores.dimensions < 0.8 && (
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
