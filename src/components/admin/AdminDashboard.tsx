import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Users,
  Package,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  Globe,
  Sparkles,
  Activity,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { metrics, products, setProducts } = useDemo();
  const { t } = useLanguage();

  const handleToggleVerification = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextTier =
            p.verificationTier === 'self_declared'
              ? 'cluster_verified'
              : p.verificationTier === 'cluster_verified'
              ? 'govt_verified'
              : 'self_declared';
          return { ...p, verificationTier: nextTier };
        }
        return p;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-950 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-amber-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="inline-flex items-center gap-1 bg-amber-700/60 text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>KALAIHUNAR CLUSTER & SYSTEM ADMIN</span>
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight m-0">
            Artisan Digitization & AI Operations
          </h2>
          <p className="text-xs text-amber-200/80 font-medium m-0">
            Real-time monitoring of 12 regional languages, AI pipeline health, and B2B craft market linkages
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI Catalog Acceptance: 94%</span>
          </span>
        </div>
      </div>

      {/* AI SYSTEM HEALTH MONITOR */}
      <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-amber-100 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
            <h4 className="text-sm font-bold text-amber-950 m-0">AI Services & Pipelines Health</h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            All Systems Operational
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-semibold">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] text-amber-800 uppercase block font-bold">Speech ASR</span>
            <span className="text-emerald-700 font-bold block mt-1">● IndicConformer</span>
            <span className="text-[10px] text-stone-500">12 Indian Languages</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] text-amber-800 uppercase block font-bold">Image Studio</span>
            <span className="text-emerald-700 font-bold block mt-1">● Authenticity AI</span>
            <span className="text-[10px] text-stone-500">Zero Hallucination</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] text-amber-800 uppercase block font-bold">Translation</span>
            <span className="text-emerald-700 font-bold block mt-1">● IndicTrans2</span>
            <span className="text-[10px] text-stone-500">Preserves Craft Terms</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] text-amber-800 uppercase block font-bold">Market Matching</span>
            <span className="text-emerald-700 font-bold block mt-1">● Explainable AI</span>
            <span className="text-[10px] text-stone-500">Weighted Capacity</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] text-amber-800 uppercase block font-bold">Offline Sync</span>
            <span className="text-emerald-700 font-bold block mt-1">● Outbox Queue</span>
            <span className="text-[10px] text-stone-500">Automatic Retry</span>
          </div>
        </div>
      </div>

      {/* TOP 4 KEY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">{t('totalArtisans')}</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-amber-950 block">{metrics.totalArtisans.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% this month</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Products Digitized</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-amber-950 block">{metrics.productsDigitized.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+342 new catalogs</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Buyer Inquiries</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-amber-950 block">{metrics.buyerInquiries.toLocaleString()}</span>
          <span className="text-[11px] text-amber-800 font-medium">B2B direct matches</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Active RFQs</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-emerald-700 block">{metrics.totalRfqs.toLocaleString()}</span>
          <span className="text-[11px] text-amber-800 font-medium">₹1.8 Cr potential procurement</span>
        </div>
      </div>

      {/* CLUSTER VERIFICATION TIERS CONTROL */}
      <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-amber-100 pb-2">
          <div>
            <h4 className="text-base font-bold text-amber-950 m-0">Cluster Artisan Verification Manager</h4>
            <span className="text-xs text-amber-800 font-medium">
              Tiers: Self-Declared → Cluster Verified → Government Handloom/Handicraft Verified
            </span>
          </div>
          <ShieldCheck className="w-5 h-5 text-amber-700" />
        </div>

        <div className="space-y-2.5">
          {products.map((p) => (
            <div
              key={p.id}
              className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.enhancedImage || p.originalImage}
                  alt={p.descriptions.en.title}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-300 shrink-0"
                />
                <div>
                  <h5 className="font-bold text-amber-950 m-0 text-sm">{p.descriptions.en.title}</h5>
                  <span className="text-amber-800 font-medium">
                    {p.artisanName} • {p.artisanLocation}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full font-bold text-[11px] uppercase border ${
                    p.verificationTier === 'govt_verified'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : p.verificationTier === 'cluster_verified'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-stone-100 text-stone-700 border-stone-300'
                  }`}
                >
                  {p.verificationTier === 'govt_verified'
                    ? '🏛 Govt Verified'
                    : p.verificationTier === 'cluster_verified'
                    ? '👥 Cluster Verified'
                    : '📝 Self-Declared'}
                </span>

                <button
                  onClick={() => handleToggleVerification(p.id)}
                  className="px-3 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold rounded-xl text-xs shadow-2xs"
                >
                  Change Tier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REGIONAL & LANGUAGE DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <h4 className="text-base font-bold text-amber-950 m-0">Regional Language Voice Input Usage</h4>
            <Globe className="w-5 h-5 text-amber-600" />
          </div>

          <div className="space-y-3 text-xs font-bold text-amber-950">
            <div>
              <div className="flex justify-between mb-1">
                <span>தமிழ் (Tamil)</span>
                <span>{metrics.languageDistribution.ta || 42}%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full"
                  style={{ width: `${metrics.languageDistribution.ta || 42}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>हिंदी (Hindi)</span>
                <span>{metrics.languageDistribution.hi || 28}%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${metrics.languageDistribution.hi || 28}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>తెలుగు (Telugu)</span>
                <span>{metrics.languageDistribution.te || 12}%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${metrics.languageDistribution.te || 12}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>ಕನ್ನಡ (Kannada)</span>
                <span>{metrics.languageDistribution.kn || 8}%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-700 h-full rounded-full"
                  style={{ width: `${metrics.languageDistribution.kn || 8}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>বাংলা (Bengali)</span>
                <span>{metrics.languageDistribution.bn || 6}%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-800 h-full rounded-full"
                  style={{ width: `${metrics.languageDistribution.bn || 6}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Speed and Impact Comparison */}
        <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <h4 className="text-base font-bold text-amber-950 m-0">Digitization Speed & Time Reduction</h4>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-600 block">Manual Listing</span>
              <span className="text-2xl font-extrabold text-stone-700 block">~25.0 min</span>
              <span className="text-[11px] text-stone-500 font-medium">Desktop typing, studio camera, translation</span>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-300 text-center space-y-1 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">KALAIHUNAR AI</span>
              <span className="text-2xl font-extrabold text-emerald-700 block">~3.5 min</span>
              <span className="text-[11px] text-emerald-900 font-bold">86% Time Saved per Artisan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
