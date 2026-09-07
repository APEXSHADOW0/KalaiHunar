import { SupportedLanguage } from '../i18n/translations';

export type Language = SupportedLanguage;

export type Role = 'landing' | 'artisan' | 'buyer' | 'admin';

export type ArtisanView =
  | 'onboarding'
  | 'home'
  | 'camera'
  | 'image-review'
  | 'voice-description'
  | 'ai-processing'
  | 'catalog-review'
  | 'pricing'
  | 'publish-success'
  | 'buyer-requests'
  | 'my-products'
  | 'offline-sync';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'conflict' | 'failed';

export type VerificationTier = 'self_declared' | 'cluster_verified' | 'govt_verified';

export interface SyncQueueItem {
  id: string;
  entityType: 'product' | 'rfq_response' | 'inquiry' | 'profile';
  operation: 'create' | 'update';
  payload: any;
  createdAt: string;
  retryCount: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  error?: string;
}

export interface PriceBreakdown {
  material: number;
  labour: number;
  packaging: number;
  overhead: number;
  baseCost: number;
  recommendedMin: number;
  recommendedMax: number;
  suggestedPrice: number;
  b2bUnitPrice: number;
}

export interface ConfidenceScores {
  category: number;
  material: number;
  usage: number;
  dimensions: number; // e.g. 0.65 = needs confirmation
}

export interface LocalizedDescription {
  title: string;
  shortDescription: string;
  longDescription: string;
  craftDetails: string;
}

export type ProductDescriptions = Partial<Record<Language, LocalizedDescription>> & {
  en: LocalizedDescription;
  ta: LocalizedDescription;
  hi: LocalizedDescription;
};

export interface Product {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanLocation: string;
  category: string;
  material: string;
  craft: string;
  use: string;
  productionTime: string;
  origin: string;
  moq: number;
  dimensions: string;
  capacityPerMonth: number;
  originalImage: string;
  enhancedImage: string;
  descriptions: ProductDescriptions;
  priceBreakdown: PriceBreakdown;
  qualityScore: {
    photo: number;
    details: number;
    description: number;
    pricing: number;
    overall: number;
  };
  confidenceScores: ConfidenceScores;
  status: 'draft' | 'published';
  verificationTier: VerificationTier;
  createdAt: string;
  rfqsCount: number;
  syncStatus?: SyncStatus;
}

export interface BuyerRFQ {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  buyerName: string;
  companyName: string;
  quantity: number;
  targetBudgetPerUnit: number;
  totalBudget: number;
  deliveryDays: number;
  additionalNotes?: string;
  status: 'pending' | 'accepted' | 'quoted' | 'declined';
  createdAt: string;
  matchScore: number;
  matchReasons?: string[];
  counterUnitPrice?: number;
  counterNotes?: string;
  counterDeliveryDays?: number;
}

export interface InquiryMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'artisan' | 'buyer';
  text: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface ClusterMetrics {
  totalArtisans: number;
  productsDigitized: number;
  buyerInquiries: number;
  totalRfqs: number;
  catalogAcceptanceRate: number;
  avgListingTimeMin: number;
  languageDistribution: Record<string, number>;
  manualListingMin: number;
  kalaihunarListingMin: number;
}

export interface AIProviderHealth {
  asr: 'healthy' | 'fallback' | 'down';
  vision: 'healthy' | 'fallback' | 'down';
  translation: 'healthy' | 'fallback' | 'down';
  matching: 'healthy' | 'fallback' | 'down';
  syncEngine: 'healthy' | 'fallback' | 'down';
}
