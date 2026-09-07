import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Sparkles,
  Camera,
  Mic,
  Brain,
  Calculator,
  Globe,
  Volume2,
  CheckCircle2,
  Rocket,
} from 'lucide-react';
import { AIVisionEnhancer } from '../../services/imageEnhancer';
import { SpeechService, CatalogService, PricingService } from '../../services/aiServices';
import { TranslationService } from '../../services/translationService';

interface ProcessingPhase {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

const PHASES: ProcessingPhase[] = [
  {
    id: 1,
    label: 'AI Vision Real-Time Enhancement',
    sublabel: 'Studio backdrop isolation, edge sharpening & pigment preservation',
    icon: <Camera className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 2,
    label: 'Speech & Phoneme Recognition',
    sublabel: 'Interpreting mother-tongue dialect & artisanal terminology',
    icon: <Mic className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 3,
    label: 'Commerce Attribute Extraction',
    sublabel: 'Extracting craft method, materials, dimensions & lead time',
    icon: <Brain className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 4,
    label: 'Fair Transparent Pricing Engine',
    sublabel: 'Calculating raw material, artisan labour, overhead & wholesale B2B price',
    icon: <Calculator className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 5,
    label: 'Real-Time Multi-Language Translation',
    sublabel: 'Auto-generating descriptions across all 12 regional languages simultaneously',
    icon: <Globe className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 6,
    label: 'Spoken Audio Catalog Narration Synthesis',
    sublabel: 'Generating spoken audio scripts with dynamic waveforms in every language',
    icon: <Volume2 className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 7,
    label: 'Autonomous Marketplace Publication',
    sublabel: 'Committing product directly to verified B2B buyer marketplace',
    icon: <Rocket className="w-4 h-4 text-amber-500" />,
  },
];

export const AutonomousAIProcessor: React.FC = () => {
  const { productDraft, setProductDraft, setArtisanView, publishCurrentDraft } = useDemo();
  const { language } = useLanguage();
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [percent, setPercent] = useState<number>(14);

  useEffect(() => {
    let isCancelled = false;

    const executeAutonomousPipeline = async () => {
      // 1. Phase 1: Real-Time Image Enhancement
      setCurrentPhase(1);
      const originalImage =
        productDraft.originalImage ||
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800';

      const enhanced = await AIVisionEnhancer.enhance(originalImage, {
        preset: 'heritage_studio',
        sharpness: 50,
        contrast: 14,
        saturation: 68,
        brightness: 6,
      });

      if (isCancelled) return;
      setCompletedPhases((prev) => [...prev, 1]);
      setPercent(28);

      // 2. Phase 2: Speech Recognition & Translation
      setCurrentPhase(2);
      const voiceResult = await SpeechService.processVoiceDescription(
        language,
        productDraft.transcript || undefined
      );

      if (isCancelled) return;
      setCompletedPhases((prev) => [...prev, 2]);
      setPercent(42);

      // 3. Phase 3: Attribute Extraction
      setCurrentPhase(3);
      const extracted = CatalogService.extractAttributes(voiceResult.transcript, language);

      if (isCancelled) return;
      setCompletedPhases((prev) => [...prev, 3]);
      setPercent(57);

      // 4. Phase 4: Pricing Calculation
      setCurrentPhase(4);
      const baseline = extracted.baselineCost;
      const priceBreakdown = PricingService.calculateExplainablePrice(
        baseline.material,
        baseline.labour,
        baseline.packaging,
        baseline.overhead,
        30
      );

      if (isCancelled) return;
      setCompletedPhases((prev) => [...prev, 4]);
      setPercent(71);

      // 5. Phase 5: Real-Time 12-Language Translation
      setCurrentPhase(5);
      const baseDescriptions = CatalogService.generateMultilingualCatalog(extracted);
      const fullMultilingualDescriptions = await TranslationService.translateProductCatalog(
        baseDescriptions,
        language
      );

      if (isCancelled) return;
      setCompletedPhases((prev) => [...prev, 5]);
      setPercent(85);

      // 6. Phase 6: Spoken Audio Narration Synthesis for Every Language
      setCurrentPhase(6);
      await new Promise((r) => setTimeout(r, 400));

      if (isCancelled) return;
      setCompletedPhases((prev) => [...prev, 6]);
      setPercent(95);

      // 7. Phase 7: Publish to Marketplace
      setCurrentPhase(7);

      setProductDraft((prev) => ({
        ...prev,
        originalImage,
        enhancedImage: enhanced.enhancedDataUrl,
        transcript: voiceResult.transcript,
        category: extracted.category,
        material: extracted.material,
        craft: extracted.craft,
        use: extracted.use,
        productionTime: extracted.productionTime,
        dimensions: extracted.dimensions,
        moq: extracted.moq,
        capacityPerMonth: extracted.capacityPerMonth,
        descriptions: fullMultilingualDescriptions,
        priceBreakdown,
        qualityScore: {
          photo: enhanced.qualityScore,
          details: enhanced.metrics.sharpnessScore,
          description: 94,
          pricing: 90,
          overall: Math.round((enhanced.qualityScore + 94 + 90) / 3),
        },
        confidenceScores: extracted.confidenceScores,
        status: 'published',
      }));

      // Auto-publish to live marketplace
      publishCurrentDraft();

      setCompletedPhases((prev) => [...prev, 7]);
      setPercent(100);

      // Smooth transition to Success Showcase
      setTimeout(() => {
        if (!isCancelled) {
          setArtisanView('publish-success');
        }
      }, 700);
    };

    executeAutonomousPipeline();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-[80vh] flex flex-col justify-between p-5 bg-white rounded-3xl border-2 border-amber-300 shadow-2xl space-y-5 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center space-y-2 pt-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white mx-auto flex items-center justify-center shadow-lg animate-pulse">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wide">
            Zero-Touch AI Autopilot Active
          </span>
          <h2 className="text-2xl font-black text-amber-950 mt-1 m-0">AI Is Doing Everything For You</h2>
          <p className="text-xs text-amber-800 font-medium mt-1">
            Input received (Photo + Voice). Converting into live audio-enhanced catalog.
          </p>
        </div>
      </div>

      {/* Real-time Progress Bar */}
      <div className="space-y-1.5 bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
        <div className="flex justify-between items-center text-xs font-bold text-amber-950">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
            <span>Autonomous Pipeline Execution</span>
          </span>
          <span className="font-mono text-amber-700 font-extrabold">{percent}%</span>
        </div>
        <div className="w-full bg-amber-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-600 to-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>

      {/* Step by Step Real-Time Execution List */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1 scrollbar-thin">
        {PHASES.map((phase) => {
          const isDone = completedPhases.includes(phase.id);
          const isCurrent = currentPhase === phase.id && !isDone;

          return (
            <div
              key={phase.id}
              className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                isDone
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-2xs'
                  : isCurrent
                  ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs ring-1 ring-amber-300 animate-pulse'
                  : 'bg-stone-50/50 border-stone-200 text-stone-400 opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-amber-600 border-t-transparent animate-spin"></div>
                ) : (
                  phase.icon
                )}
              </div>

              <div className="text-xs space-y-0.5">
                <span className={`font-bold block ${isDone ? 'text-emerald-950' : isCurrent ? 'text-amber-950' : 'text-stone-500'}`}>
                  {phase.label}
                </span>
                <span className="text-[10px] text-stone-600 block leading-tight">
                  {phase.sublabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Status Tip */}
      <div className="p-3 bg-stone-100 rounded-xl text-center text-[11px] font-semibold text-stone-700">
        💡 No typing or button clicking required. The AI is enhancing, translating, and publishing automatically.
      </div>
    </div>
  );
};

