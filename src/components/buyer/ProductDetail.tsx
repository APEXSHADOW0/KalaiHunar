import React, { useState } from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { RFQModal } from './RFQModal';
import { ArrowLeft, ShieldCheck, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { AudioCatalogPlayer } from '../common/AudioCatalogPlayer';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const { language } = useLanguage();
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [rfqSubmittedSuccess, setRfqSubmittedSuccess] = useState(false);

  const desc = product.descriptions[language] || product.descriptions.en;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 font-bold text-xs hover:bg-amber-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to B2B Marketplace</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 md:p-8 rounded-3xl border border-amber-200 shadow-xl">
        {/* Left Column: Product Gallery & Cluster Traceability */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-amber-200 bg-stone-100">
            <img
              src={product.enhancedImage || product.originalImage}
              alt={desc.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Artisan Cluster</span>
            </span>
          </div>

          {/* Full Spoken Audio-Enhanced Catalog Narration */}
          <div className="space-y-1">
            <AudioCatalogPlayer
              product={product}
              defaultLanguage={language}
              showLanguageSelector={true}
            />
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2 text-xs text-amber-900">
            <span className="font-bold text-amber-950 uppercase tracking-wider block">
              Authenticity & Cluster Traceability:
            </span>
            <div className="grid grid-cols-2 gap-2 font-semibold">
              <div className="bg-white p-2 rounded-lg border border-amber-200">
                <span className="text-amber-700 block text-[10px]">Artisan Community:</span>
                <span>Madurai Clay Crafts Co-op</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-amber-200">
                <span className="text-amber-700 block text-[10px]">Material Certificate:</span>
                <span>100% Natural River Clay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & RFQ Trigger */}
        <div className="space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-800 font-bold mb-1">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{product.artisanName} • {product.artisanLocation}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-amber-950 leading-tight m-0">
                {desc.title}
              </h1>
            </div>

            <p className="text-sm text-amber-950 font-medium leading-relaxed m-0">
              {desc.longDescription}
            </p>

            {/* Specifications Cards Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-0.5">
                <span className="text-amber-700 font-bold block text-[10px] uppercase">MOQ (Minimum Order)</span>
                <span className="text-sm font-extrabold text-amber-950">{product.moq} units</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-0.5">
                <span className="text-amber-700 font-bold block text-[10px] uppercase">Monthly Capacity</span>
                <span className="text-sm font-extrabold text-amber-950">{product.capacityPerMonth} units/mo</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-0.5">
                <span className="text-amber-700 font-bold block text-[10px] uppercase">Production Lead Time</span>
                <span className="text-sm font-extrabold text-amber-950">{product.productionTime}</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-0.5">
                <span className="text-amber-700 font-bold block text-[10px] uppercase">Dimensions</span>
                <span className="text-sm font-extrabold text-amber-950">{product.dimensions}</span>
              </div>
            </div>

            {/* Price Preview */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase block">Suggested Retail Price</span>
                <span className="text-3xl font-extrabold text-amber-950">₹{product.priceBreakdown.suggestedPrice}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700 block">B2B Wholesale Rate</span>
                <span className="text-xl font-extrabold text-emerald-800">₹{product.priceBreakdown.b2bUnitPrice} / unit</span>
              </div>
            </div>
          </div>

          {/* RFQ Trigger Button */}
          {rfqSubmittedSuccess ? (
            <div className="p-4 bg-emerald-50 text-emerald-900 border-2 border-emerald-300 rounded-2xl text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base m-0">Quotation Request (RFQ) Sent!</h4>
              <p className="text-xs m-0 font-medium">The artisan has received your RFQ in their Lakshmi Crafts dashboard.</p>
            </div>
          ) : (
            <button
              onClick={() => setShowRfqModal(true)}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 to-terracotta-600 hover:from-amber-500 hover:to-terracotta-500 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-lg touch-btn"
            >
              <Send className="w-5 h-5" />
              <span>Request for Quotation (RFQ)</span>
            </button>
          )}
        </div>
      </div>

      {/* RFQ MODAL */}
      {showRfqModal && (
        <RFQModal
          product={product}
          onClose={() => setShowRfqModal(false)}
          onSuccess={() => {
            setShowRfqModal(false);
            setRfqSubmittedSuccess(true);
          }}
        />
      )}
    </div>
  );
};
