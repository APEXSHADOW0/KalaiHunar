import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { DemoProvider, useDemo } from './context/DemoContext';
import { Header } from './components/common/Header';
import { OfflineSyncManager } from './components/common/OfflineSyncManager';
import { LandingHero } from './components/landing/LandingHero';
import { ArtisanOnboarding } from './components/artisan/ArtisanOnboarding';
import { ArtisanHome } from './components/artisan/ArtisanHome';
import { CameraStudio } from './components/artisan/CameraStudio';
import { ImageStudio } from './components/artisan/ImageStudio';
import { VoiceDescription } from './components/artisan/VoiceDescription';
import { AIExtraction } from './components/artisan/AIExtraction';
import { AutonomousAIProcessor } from './components/artisan/AutonomousAIProcessor';
import { MultilingualCatalog } from './components/artisan/MultilingualCatalog';
import { PricingAssistant } from './components/artisan/PricingAssistant';
import { PublishSuccess } from './components/artisan/PublishSuccess';
import { BuyerRequestsList } from './components/artisan/BuyerRequestsList';
import { MarketplaceHome } from './components/buyer/MarketplaceHome';
import { ProductDetail } from './components/buyer/ProductDetail';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Product } from './types';
import { Plus, ChevronLeft } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, artisanView, setArtisanView, products } = useDemo();
  const { language, t } = useLanguage();
  const [selectedBuyerProduct, setSelectedBuyerProduct] = useState<Product | null>(null);

  const renderArtisanView = () => {
    switch (artisanView) {
      case 'onboarding':
        return <ArtisanOnboarding />;
      case 'home':
        return <ArtisanHome />;
      case 'camera':
        return <CameraStudio />;
      case 'image-review':
        return <ImageStudio />;
      case 'voice-description':
        return <VoiceDescription />;
      case 'ai-processing':
        return <AIExtraction />;
      case 'autonomous-processing':
        return <AutonomousAIProcessor />;
      case 'catalog-review':
        return <MultilingualCatalog />;
      case 'pricing':
        return <PricingAssistant />;
      case 'publish-success':
        return <PublishSuccess />;
      case 'buyer-requests':
        return <BuyerRequestsList />;
      case 'my-products':
        return (
          <div className="max-w-md mx-auto space-y-4 p-4 bg-white rounded-3xl border border-amber-200 shadow-md animate-fade-in">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <button
                onClick={() => setArtisanView('home')}
                className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold hover:bg-amber-200 flex items-center gap-1 text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('back')}</span>
              </button>
              <h2 className="text-xl font-bold text-amber-950 m-0">{t('myProducts')}</h2>
              <button
                onClick={() => setArtisanView('camera')}
                className="p-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 flex items-center gap-1 text-xs shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{t('addProduct')}</span>
              </button>
            </div>

            <div className="space-y-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-center gap-3 shadow-2xs"
                >
                  <img
                    src={prod.enhancedImage || prod.originalImage}
                    alt={prod.descriptions[language]?.title || prod.descriptions.en.title}
                    className="w-16 h-16 rounded-xl object-cover border border-amber-300 shrink-0"
                  />
                  <div className="text-xs space-y-1 flex-1">
                    <h4 className="font-bold text-amber-950 m-0 text-sm">
                      {prod.descriptions[language]?.title || prod.descriptions.en.title}
                    </h4>
                    <span className="text-amber-800 font-semibold block">
                      Suggested Price: ₹{prod.priceBreakdown.suggestedPrice} (B2B: ₹{prod.priceBreakdown.b2bUnitPrice})
                    </span>
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold ${
                          prod.syncStatus === 'offline'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {prod.syncStatus === 'offline' ? 'Offline Draft' : 'Published'}
                      </span>
                      <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                        MOQ {prod.moq}
                      </span>
                      <span className="bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-semibold">
                        {prod.craft}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <ArtisanHome />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {role === 'landing' && <LandingHero />}
        {role === 'artisan' && renderArtisanView()}
        {role === 'buyer' &&
          (selectedBuyerProduct ? (
            <ProductDetail product={selectedBuyerProduct} onBack={() => setSelectedBuyerProduct(null)} />
          ) : (
            <MarketplaceHome onSelectProduct={(prod) => setSelectedBuyerProduct(prod)} />
          ))}
        {role === 'admin' && <AdminDashboard />}
      </main>

      {/* Floating Offline Resilience & Sync Manager */}
      <OfflineSyncManager />

      <footer className="bg-amber-950 text-amber-200/80 text-xs py-6 px-4 text-center border-t border-amber-900 mt-12">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="m-0 font-bold tracking-wide text-amber-100">
            KALAIHUNAR — AI Voice-First Assistant for Artisans
          </p>
          <p className="m-0 text-amber-300/60 text-[11px]">
            "Your Craft. Your Voice. Your Market." • Smart Cataloging, Transparent Pricing & Direct B2B Market Linkage
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <DemoProvider>
        <AppContent />
      </DemoProvider>
    </LanguageProvider>
  );
}
