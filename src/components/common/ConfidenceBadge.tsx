import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ConfidenceBadgeProps {
  score: number; // 0 to 1
  label?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score, label }) => {
  const isHigh = score >= 0.85;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isHigh
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-amber-50 text-amber-800 border border-amber-300'
      }`}
    >
      {isHigh ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
      )}
      <span>{label || (isHigh ? 'High confidence' : 'Needs confirmation')}</span>
    </div>
  );
};
