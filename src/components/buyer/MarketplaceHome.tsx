import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Product } from '../../types';
import {
  Search,
  Filter,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Sparkles,
  Volume2,
  Square,
} from 'lucide-react';
import { AudioCatalogService } from '../../services/audioCatalogService';

interface MarketplaceHomeProps {
  onSelectProduct: (product: Product) => void;
}

export const MarketplaceHome: React.FC<MarketplaceHomeProps> = ({ onSelectProduct }) => {
  const { products } = useDemo();
  const { language, supportedLanguages } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [playingProductId, setPlayingProductId] = useState<string | null>(null);

  const categories = ['All', 'Handicrafts', 'Textiles', 'Baskets & Fiber', 'Pottery', 'Home Decor'];

  const activeLangMeta =
    supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  const filteredProducts = products.filter((p) => {
    const desc = p.descriptions[language] || p.descriptions.en;
    const matchesSearch =
      desc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.material.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleToggleCardAudio = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();

    if (playingProductId === product.id) {
      AudioCatalogService.stop();
      setPlayingProductId(null);
    } else {
      AudioCatalogService.stop();
      setPlayingProductId(product.id);

      const script = AudioCatalogService.generateNarrationScript(product, language);
      AudioCatalogService.playCatalogNarration(
        script.sentences,
        language,
        1.0,
        (idx) => {
          if (idx === -1) {
            setPlayingProductId(null);
          }
        },
        () => {
          setPlayingProductId(null);
        }
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Buyer Desktop Header & Hero Search Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-amber-50 p-6 md:p-8 rounded-3xl shadow-xl border border-amber-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="inline-flex items-center gap-1 bg-amber-700/60 text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>KALAIHUNAR AUDIO-ENHANCED CRAFT CATALOG</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight m-0">
            Direct Procurement from Verified Indian Artisan Clusters
          </h2>
          <p className="text-sm text-amber-200/90 font-medium m-0">
            Eliminate intermediary markups. AI-digitized product catalogs with real-time audio narration in {activeLangMeta.name} ({activeLangMeta.nativeName}).
          </p>
        </div>

        {/* Global Search Box */}
        <div className="w-full md:w-96 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-inner space-y-2">
          <div className="relative">
            <Search className="w-5 h-5 text-amber-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terracotta, handloom, baskets..."
              className="w-full pl-11 pr-4 py-3 bg-white text-amber-950 rounded-xl text-sm font-semibold focus:outline-none placeholder-amber-800/60 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button className="px-3 py-2 bg-amber-100 text-amber-950 rounded-xl font-bold text-xs flex items-center gap-1 border border-amber-300 shrink-0">
          <Filter className="w-3.5 h-3.5 text-amber-700" />
          <span>Filters</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-amber-700 text-white shadow-md'
                : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const desc = product.descriptions[language] || product.descriptions.en;
          const isCardAudioPlaying = playingProductId === product.id;

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-white rounded-3xl border border-amber-200 overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={product.enhancedImage || product.originalImage}
                    alt={desc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Artisan</span>
                    </span>
                  </div>

                  {/* Instant Audio Catalog Quick Button */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => handleToggleCardAudio(e, product)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 transition-all ${
                        isCardAudioPlaying
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-slate-950/85 hover:bg-slate-950 text-amber-300 backdrop-blur-md'
                      }`}
                      title={`Listen to Audio Catalog in ${activeLangMeta.name}`}
                    >
                      {isCardAudioPlaying ? (
                        <>
                          <Square className="w-3 h-3 text-white" />
                          <span>Playing</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Audio ({activeLangMeta.nativeName})</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    MOQ: {product.moq} pcs
                  </div>
                </div>

                {/* Product Info Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-amber-800 font-semibold">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{product.artisanLocation}</span>
                    </span>
                    <span>{product.artisanName}</span>
                  </div>

                  <h3 className="text-lg font-bold text-amber-950 group-hover:text-amber-700 transition-colors leading-snug m-0">
                    {desc.title}
                  </h3>

                  <p className="text-xs text-amber-950 font-medium line-clamp-2 m-0">
                    {desc.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5 text-[11px] text-amber-900 font-semibold pt-1">
                    <span className="bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Material: {product.material}
                    </span>
                    <span className="bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Lead time: {product.productionTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-5 pt-0 border-t border-amber-100 flex items-center justify-between mt-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">
                    Suggested Price
                  </span>
                  <span className="text-xl font-extrabold text-amber-950">
                    ₹{product.priceBreakdown.suggestedPrice}
                  </span>
                  <span className="text-[10px] text-amber-800 font-medium block">
                    B2B Wholesale: ₹{product.priceBreakdown.b2bUnitPrice}/unit
                  </span>
                </div>

                <button className="py-2.5 px-4 bg-amber-600 group-hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
