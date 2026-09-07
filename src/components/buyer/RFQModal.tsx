import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Product } from '../../types';
import { MatchingService } from '../../services/aiServices';
import { X, Send, Sparkles } from 'lucide-react';

interface RFQModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export const RFQModal: React.FC<RFQModalProps> = ({ product, onClose, onSuccess }) => {
  const { submitBuyerRFQ } = useDemo();
  const [buyerName, setBuyerName] = useState('Vikram Sethi');
  const [companyName, setCompanyName] = useState('UrbanNest Interiors Pvt Ltd');
  const [quantity, setQuantity] = useState(50);
  const [targetBudgetPerUnit, setTargetBudgetPerUnit] = useState(product.priceBreakdown.b2bUnitPrice || 850);
  const [deliveryDays, setDeliveryDays] = useState(15);
  const [notes, setNotes] = useState('Required for boutique hotel lobby placement in Bengaluru. Need uniform earth tone finish.');

  // Live match score calculation
  const matchResult = MatchingService.calculateMatchScore(
    { quantity, targetBudgetPerUnit, deliveryDays },
    product
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitBuyerRFQ({
      productId: product.id,
      productTitle: product.descriptions.en.title,
      productImage: product.enhancedImage || product.originalImage,
      buyerName,
      companyName,
      quantity,
      targetBudgetPerUnit,
      totalBudget: quantity * targetBudgetPerUnit,
      deliveryDays,
      additionalNotes: notes,
    });

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg border-2 border-amber-300 shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>B2B REQUEST FOR QUOTATION</span>
          </span>
          <h3 className="text-2xl font-bold text-amber-950 m-0">Send RFQ to {product.artisanName}</h3>
          <p className="text-xs text-amber-800 font-medium">
            Specify your bulk requirements to receive direct cluster pricing
          </p>
        </div>

        {/* Selected Product Card Summary */}
        <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-center gap-3">
          <img
            src={product.enhancedImage || product.originalImage}
            alt={product.descriptions.en.title}
            className="w-14 h-14 rounded-xl object-cover border border-amber-300"
          />
          <div className="text-xs space-y-0.5">
            <h4 className="font-bold text-amber-950 m-0">{product.descriptions.en.title}</h4>
            <span className="text-amber-800 font-medium block">
              MOQ: {product.moq} units • Capacity: {product.capacityPerMonth} / month
            </span>
          </div>
        </div>

        {/* Live Match Score Indicator */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950">AI Market Linkage Match:</span>
            <span className="font-extrabold text-emerald-800 text-sm bg-emerald-200/80 px-2 py-0.5 rounded-full">
              {matchResult.score}% MATCH
            </span>
          </div>
          <div className="space-y-0.5 text-[11px] text-emerald-900">
            {matchResult.reasons.slice(0, 3).map((r, i) => (
              <span key={i} className="block">{r}</span>
            ))}
            {matchResult.warnings.map((w, i) => (
              <span key={i} className="block text-amber-700 font-medium">{w}</span>
            ))}
          </div>
        </div>

        {/* RFQ Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold text-amber-950">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-amber-800 mb-1">Buyer Name</label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-stone-50 font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] text-amber-800 mb-1">Company / Organization</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-stone-50 font-bold"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[11px] text-amber-800">Required Quantity (Units)</label>
              <span className="font-extrabold text-amber-950">{quantity} units</span>
            </div>
            <input
              type="range"
              min={product.moq}
              max={250}
              step={5}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-amber-800 mb-1">Target Budget (₹ / unit)</label>
              <input
                type="number"
                required
                value={targetBudgetPerUnit}
                onChange={(e) => setTargetBudgetPerUnit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-stone-50 font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] text-amber-800 mb-1">Delivery Lead Days</label>
              <input
                type="number"
                required
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-stone-50 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-amber-800 mb-1">Additional Requirements / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-stone-50 font-medium text-xs"
            />
          </div>

          {/* Total Calculated Budget preview */}
          <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-300 flex items-center justify-between text-xs">
            <span className="font-bold text-amber-900">Total Estimated Order Value:</span>
            <span className="text-base font-extrabold text-emerald-700">
              ₹{(quantity * targetBudgetPerUnit).toLocaleString()}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base touch-btn transition-transform hover:scale-[1.01]"
          >
            <Send className="w-5 h-5" />
            <span>Submit Quotation Request (RFQ)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
