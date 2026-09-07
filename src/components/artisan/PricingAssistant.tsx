import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, ArrowRight, Sparkles, Tag, Sliders, ChevronLeft } from 'lucide-react';
import { PricingService } from '../../services/aiServices';

export const PricingAssistant: React.FC = () => {
  const { setArtisanView, setProductDraft, productDraft } = useDemo();
  const { t } = useLanguage();

  const [material, setMaterial] = useState<number>(productDraft.priceBreakdown?.material || 200);
  const [labour, setLabour] = useState<number>(productDraft.priceBreakdown?.labour || 400);
  const [packaging, setPackaging] = useState<number>(productDraft.priceBreakdown?.packaging || 50);
  const [overhead, setOverhead] = useState<number>(productDraft.priceBreakdown?.overhead || 50);
  const [margin, setMargin] = useState<number>(30);
  const [showSliders, setShowSliders] = useState<boolean>(false);

  const priceBreakdown = PricingService.calculateExplainablePrice(material, labour, packaging, overhead, margin);

  const [pricingChoice, setPricingChoice] = useState<'min' | 'suggested' | 'premium'>('suggested');

  const selectedPrice =
    pricingChoice === 'min'
      ? priceBreakdown.recommendedMin
      : pricingChoice === 'suggested'
      ? priceBreakdown.suggestedPrice
      : priceBreakdown.recommendedMax;

  const handleProceedToPublish = () => {
    setProductDraft((prev) => ({
      ...prev,
      priceBreakdown: {
        ...priceBreakdown,
        suggestedPrice: selectedPrice,
      },
    }));
    setArtisanView('publish-success');
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4 bg-white rounded-3xl border border-amber-200 shadow-md animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-2">
        <button
          onClick={() => setArtisanView('catalog-review')}
          className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold hover:bg-amber-200 flex items-center gap-1 text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('back')}</span>
        </button>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>EXPLAINABLE PRICING FORMULA</span>
        </span>
      </div>

      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-amber-950 m-0">{t('pricingTitle')}</h2>
        <p className="text-xs text-amber-800 font-medium">
          Suggested price = Materials + Fair Artisan Labour + Packaging + Logistics + Margin
        </p>
      </div>

      {/* Cost Breakdown Table */}
      <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-xs space-y-2">
        <div className="flex items-center justify-between border-b border-amber-200 pb-1">
          <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
            YOUR COST BREAKDOWN
          </span>
          <button
            onClick={() => setShowSliders(!showSliders)}
            className="flex items-center gap-1 text-amber-800 font-bold hover:text-amber-950 text-[11px] bg-white px-2 py-0.5 rounded-md border border-amber-300"
          >
            <Sliders className="w-3 h-3 text-amber-700" />
            <span>{showSliders ? 'Hide Sliders' : 'Adjust Costs'}</span>
          </button>
        </div>

        {/* Optional Interactive Cost Sliders */}
        {showSliders && (
          <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-3 animate-fade-in">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-amber-900">
                <span>{t('materialCost')}:</span>
                <span>₹{material}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="10"
                value={material}
                onChange={(e) => setMaterial(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-amber-900">
                <span>{t('labourCost')}:</span>
                <span>₹{labour}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="20"
                value={labour}
                onChange={(e) => setLabour(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-amber-900">
                <span>{t('packagingCost')}:</span>
                <span>₹{packaging}</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={packaging}
                onChange={(e) => setPackaging(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-amber-900">
                <span>{t('overheadCost')}:</span>
                <span>₹{overhead}</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={overhead}
                onChange={(e) => setOverhead(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-amber-900">
                <span>Artisan Margin (%):</span>
                <span>{margin}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5 text-amber-900 font-semibold">
          <div className="flex justify-between">
            <span>{t('materialCost')} (Natural Clay & Dyes)</span>
            <span>₹{priceBreakdown.material}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('labourCost')} (2 Days Handcrafting)</span>
            <span>₹{priceBreakdown.labour}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('packagingCost')} (Corrugated box & Straw)</span>
            <span>₹{priceBreakdown.packaging}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('overheadCost')} (Kiln Baking & Handling)</span>
            <span>₹{priceBreakdown.overhead}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-amber-950 pt-2 border-t border-amber-300">
            <span>Base Production Cost</span>
            <span>₹{priceBreakdown.baseCost}</span>
          </div>
        </div>
      </div>

      {/* Recommended Pricing Range Card */}
      <div className="bg-gradient-to-r from-amber-600 to-terracotta-600 text-white p-5 rounded-2xl shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs text-amber-100 font-medium">
          <span>{t('suggestedPriceRange')}</span>
          <span className="bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded font-mono font-bold">
            ₹{priceBreakdown.recommendedMin} — ₹{priceBreakdown.recommendedMax}
          </span>
        </div>

        <div className="text-center py-1">
          <span className="text-xs text-amber-200 block font-semibold">CALCULATED UNIT PRICE</span>
          <span className="text-4xl font-extrabold tracking-tight">₹{selectedPrice}</span>
        </div>

        <div className="bg-black/20 p-3 rounded-xl border border-white/10 text-xs space-y-1">
          <span className="font-bold text-amber-200 block text-[10px] uppercase">Transparent Calculation:</span>
          <div className="grid grid-cols-2 gap-1 text-[11px] text-amber-100">
            <span>✓ ₹{priceBreakdown.baseCost} Total Base Cost</span>
            <span>✓ {margin}% Desired Profit Margin</span>
            <span>✓ Fair artisan hourly wage</span>
            <span>✓ Verified Madurai cluster rate</span>
          </div>
        </div>
      </div>

      {/* Pricing Choice Options */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-amber-950 block">Select Pricing Strategy:</span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setPricingChoice('min')}
            className={`p-3 rounded-xl border text-center transition-all ${
              pricingChoice === 'min'
                ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-md'
                : 'bg-white text-amber-950 border-amber-200 hover:bg-amber-50'
            }`}
          >
            <span className="text-[10px] block opacity-80 uppercase">Minimum</span>
            <span className="text-base font-extrabold">₹{priceBreakdown.recommendedMin}</span>
          </button>

          <button
            onClick={() => setPricingChoice('suggested')}
            className={`p-3 rounded-xl border text-center transition-all ${
              pricingChoice === 'suggested'
                ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-md ring-2 ring-amber-400'
                : 'bg-white text-amber-950 border-amber-200 hover:bg-amber-50'
            }`}
          >
            <span className="text-[10px] block opacity-80 uppercase">Suggested</span>
            <span className="text-base font-extrabold">₹{priceBreakdown.suggestedPrice}</span>
          </button>

          <button
            onClick={() => setPricingChoice('premium')}
            className={`p-3 rounded-xl border text-center transition-all ${
              pricingChoice === 'premium'
                ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-md'
                : 'bg-white text-amber-950 border-amber-200 hover:bg-amber-50'
            }`}
          >
            <span className="text-[10px] block opacity-80 uppercase">Premium</span>
            <span className="text-base font-extrabold">₹{priceBreakdown.recommendedMax}</span>
          </button>
        </div>
      </div>

      {/* B2B Wholesale Tier */}
      <div className="bg-stone-50 p-3.5 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-950 shadow-xs">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-700" />
          <div>
            <span className="font-bold block">{t('b2bBulkPrice')}</span>
            <span className="text-[10px] text-amber-800">For bulk buyer orders (MOQ {productDraft.moq || 10}+)</span>
          </div>
        </div>
        <span className="text-base font-extrabold text-emerald-700">₹{priceBreakdown.b2bUnitPrice} / unit</span>
      </div>

      {/* Disclaimer */}
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p className="m-0 leading-tight">
          <strong>Artisan Autonomy Guarantee:</strong> This formula is an explainable recommendation. You retain full control over your selling prices.
        </p>
      </div>

      {/* Catalog Readiness Score */}
      <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-emerald-950 block">PRODUCT READINESS SCORE</span>
          <span className="text-emerald-800 font-medium">96/100 — Ready to Publish</span>
        </div>
        <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
          ✓ READY
        </span>
      </div>

      <button
        onClick={handleProceedToPublish}
        className="w-full py-4 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base touch-btn transition-transform hover:scale-[1.01]"
      >
        <span>{t('publishProduct')}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
