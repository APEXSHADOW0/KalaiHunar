import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Sparkles, User, ShoppingBag, BarChart3, ArrowRight, Globe } from 'lucide-react';

export const LandingHero: React.FC = () => {
  const { loadRoleDemo } = useDemo();

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-6 animate-fade-in">
      {/* Main Hero Header Banner */}
      <div className="bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-amber-800 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-5 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 bg-amber-800/80 text-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-600/50 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI VOICE-FIRST BUSINESS ASSISTANT FOR ARTISANS</span>
          </div>

          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none m-0">
              KALAIHUNAR
            </h1>
            <p className="text-xl md:text-2xl font-bold text-amber-300 mt-2 m-0 font-heading">
              Your craft. Your voice. Your market.
            </p>
          </div>

          <p className="text-base text-amber-100/90 font-medium leading-relaxed m-0">
            We are not teaching marginalized artisans how to become digital marketers. We are building the AI digital business manager that converts native voice and photos into certified B2B catalogs.
          </p>

          {/* Regional Languages Pill Bar */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-amber-200/90 font-medium">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>12 Regional Languages Supported:</span>
            <span className="font-bold text-white">தமிழ் • हिन्दी • తెలుగు • ಕನ್ನಡ • বাংলা • मराठी • ਪੰਜਾਬੀ...</span>
          </div>

          {/* Primary & Secondary Action CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => loadRoleDemo('artisan')}
              className="py-4 px-6 bg-gradient-to-r from-amber-500 to-terracotta-600 hover:from-amber-400 hover:to-terracotta-500 text-white font-extrabold rounded-2xl shadow-xl flex items-center justify-center gap-2.5 text-lg touch-btn transition-transform hover:scale-[1.02]"
            >
              <User className="w-5 h-5" />
              <span>Start as Artisan</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => loadRoleDemo('buyer')}
              className="py-4 px-6 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-bold rounded-2xl flex items-center justify-center gap-2 text-base touch-btn transition-transform hover:scale-[1.02]"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span>Explore B2B Marketplace</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => loadRoleDemo('admin')}
              className="text-xs text-amber-300/80 hover:text-white underline font-semibold flex items-center justify-center md:justify-start gap-1"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Cluster Manager & Government Analytics Dashboard</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Card Stack */}
        <div className="relative w-full max-w-sm aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/40 bg-amber-900 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800"
            alt="Handmade terracotta craft"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-5 text-left">
            <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider w-fit mb-1 shadow">
              Live AI Digitization
            </span>
            <p className="text-sm font-bold text-white m-0">Lakshmi Pottery • Terracotta Decorative Doll</p>
            <span className="text-xs text-amber-200 font-medium">Madurai, Tamil Nadu</span>
          </div>
        </div>
      </div>

      {/* 5-STAGE STORYTELLING PROCESS FLOW */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-amber-200 shadow-md space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">The KALAIHUNAR Core Engine</span>
          <h2 className="text-2xl font-bold text-amber-950 m-0">From Physical Craft to Direct B2B Market Linkage</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white mx-auto flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h4 className="font-bold text-amber-950 text-sm m-0">CAMERA</h4>
            <p className="text-xs text-amber-800 font-medium m-0">Photo quality check & studio background</p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white mx-auto flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h4 className="font-bold text-amber-950 text-sm m-0">VOICE</h4>
            <p className="text-xs text-amber-800 font-medium m-0">Describe in any of 12 regional languages</p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white mx-auto flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h4 className="font-bold text-amber-950 text-sm m-0">AI CATALOG</h4>
            <p className="text-xs text-amber-800 font-medium m-0">Zero-hallucination structured facts</p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white mx-auto flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h4 className="font-bold text-amber-950 text-sm m-0">FAIR PRICING</h4>
            <p className="text-xs text-amber-800 font-medium m-0">Transparent formula based on real costs</p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white mx-auto flex items-center justify-center font-bold text-sm">
              05
            </div>
            <h4 className="font-bold text-amber-950 text-sm m-0">MARKET LINKAGE</h4>
            <p className="text-xs text-amber-800 font-medium m-0">Direct B2B buyers & live RFQ counter-quotes</p>
          </div>
        </div>
      </div>
    </div>
  );
};
