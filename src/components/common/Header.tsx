import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Sparkles,
  RefreshCw,
  User,
  ShoppingBag,
  BarChart3,
  Globe,
  Bell,
  Wifi,
  WifiOff,
  ChevronDown,
  Languages,
} from 'lucide-react';
import { RealtimeTranslatorModal } from './RealtimeTranslatorModal';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    resetDemo,
    setArtisanView,
    unreadNotificationsCount,
    clearNotifications,
    isOnline,
    toggleNetwork,
  } = useDemo();

  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showTranslatorModal, setShowTranslatorModal] = useState(false);

  const activeLangMeta = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  return (
    <header className="sticky top-0 z-50 bg-amber-900/95 text-amber-50 backdrop-blur-md border-b border-amber-800 shadow-md">
      {/* Top SIH Presentation Bar / Demo Mode Bar */}
      <div className="bg-amber-950 text-amber-200 text-xs py-1 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-amber-800/50">
        <div className="flex items-center gap-2 font-medium">
          <span className="bg-amber-700 text-amber-100 text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide">
            {t('demoMode')}
          </span>
          <span className="hidden sm:inline">
            <strong>KALAIHUNAR</strong> — Real-Time Multi-Language Audio & AI Vision Business Manager
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Online / Offline status badge in top bar */}
          <button
            onClick={toggleNetwork}
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded transition-colors ${
              isOnline
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}
            title="Click to toggle offline mode simulation"
          >
            {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-rose-400" />}
            <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
          </button>

          <button
            onClick={resetDemo}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-100 font-semibold px-2 py-0.5 rounded hover:bg-amber-900 transition-colors"
            title="Reset demo data to initial state"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t('resetDemo')}</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div onClick={() => setRole('landing')} className="cursor-pointer flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-terracotta-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white m-0">KALAIHUNAR</h1>
              <span className="text-[10px] bg-amber-800/80 text-amber-200 px-1.5 py-0.5 rounded font-mono font-bold">
                PROD
              </span>
            </div>
            <p className="text-xs text-amber-200/90 m-0 hidden sm:block font-medium">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center bg-amber-950/60 p-1 rounded-xl border border-amber-800/60">
          <button
            onClick={() => {
              setRole('artisan');
              setArtisanView('home');
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
              role === 'artisan'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-200 hover:text-white hover:bg-amber-900/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('artisanRole')}</span>
            <span className="sm:hidden">Artisan</span>
          </button>

          <button
            onClick={() => setRole('buyer')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
              role === 'buyer'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-200 hover:text-white hover:bg-amber-900/50'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('buyerRole')}</span>
            <span className="sm:hidden">Buyer</span>
          </button>

          <button
            onClick={() => setRole('admin')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
              role === 'admin'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-200 hover:text-white hover:bg-amber-900/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('adminRole')}</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </div>

        {/* Controls: Real-Time Translator, Notifications & Regional Languages Dropdown */}
        <div className="flex items-center gap-2">
          {/* Universal Real-Time Translator Quick Launch Button */}
          <button
            onClick={() => setShowTranslatorModal(true)}
            className="flex items-center gap-1.5 bg-amber-800 hover:bg-amber-700 text-amber-100 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-600/70 text-xs font-bold transition-all shadow-xs"
            title="Open Universal Real-Time Multi-Language AI Translator"
          >
            <Languages className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Real-Time Translator</span>
            <span className="md:hidden">Translate</span>
          </button>

          {/* Notification Alert Bell */}
          <button
            onClick={() => {
              clearNotifications();
              if (role === 'artisan') {
                setArtisanView('buyer-requests');
              }
            }}
            className="relative p-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/60 text-amber-200 hover:text-white transition-colors"
            title="Real-time RFQ and Buyer Inquiries"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-md">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Regional Languages Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-100 px-3 py-1.5 rounded-xl border border-amber-700/80 text-xs font-bold transition-colors shadow-inner"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeLangMeta.nativeName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2 shadow-2xl border-2 border-amber-200 text-slate-900 z-50 max-h-80 overflow-y-auto animate-scale-up">
                <div className="px-2 py-1.5 border-b border-amber-100 text-[11px] font-bold uppercase text-amber-800 tracking-wider">
                  Select Regional Language (12)
                </div>
                <div className="grid grid-cols-1 gap-1 pt-1">
                  {supportedLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        language === l.code
                          ? 'bg-amber-600 text-white font-bold shadow-xs'
                          : 'hover:bg-amber-50 text-amber-950'
                      }`}
                    >
                      <span className="text-sm">{l.nativeName}</span>
                      <span className={`text-[10px] ${language === l.code ? 'text-amber-100' : 'text-amber-700'}`}>
                        {l.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Real-Time Translator Modal */}
      <RealtimeTranslatorModal
        isOpen={showTranslatorModal}
        onClose={() => setShowTranslatorModal(false)}
      />
    </header>
  );
};
