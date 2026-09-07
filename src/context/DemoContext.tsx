import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Role,
  ArtisanView,
  Product,
  BuyerRFQ,
  ClusterMetrics,
  SyncQueueItem,
  SyncStatus,
  AIProviderHealth,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_RFQS, INITIAL_METRICS } from '../data/mockData';
import { PricingService, CatalogService } from '../services/aiServices';

interface DemoContextType {
  role: Role;
  setRole: (role: Role) => void;
  artisanView: ArtisanView;
  setArtisanView: (view: ArtisanView) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  rfqs: BuyerRFQ[];
  metrics: ClusterMetrics;
  productDraft: Partial<Product>;
  setProductDraft: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  toggleNetwork: () => void;
  syncStatus: SyncStatus;
  syncQueue: SyncQueueItem[];
  triggerSyncNow: () => void;
  unreadNotificationsCount: number;
  clearNotifications: () => void;
  aiHealth: AIProviderHealth;
  resetDemo: () => void;
  loadRoleDemo: (role: Role) => void;
  publishCurrentDraft: () => Product;
  submitBuyerRFQ: (rfqData: Omit<BuyerRFQ, 'id' | 'createdAt' | 'status' | 'matchScore'>) => BuyerRFQ;
  respondToRFQ: (
    rfqId: string,
    action: 'accept' | 'counter' | 'decline',
    counterData?: { price: number; notes: string; days: number }
  ) => void;
}

const defaultDraft: Partial<Product> = {
  id: 'prod-terracotta-doll-draft',
  artisanId: 'art-lakshmi',
  artisanName: 'Lakshmi Pottery',
  artisanLocation: 'Madurai, Tamil Nadu',
  category: 'Handicrafts → Terracotta Decor',
  material: 'Natural Clay / Terracotta',
  craft: 'Terracotta Pottery & Sculpting',
  use: 'Home Decoration & Heritage Living',
  productionTime: '2 Days',
  origin: 'Madurai, Tamil Nadu',
  moq: 10,
  dimensions: '18cm x 10cm x 8cm',
  capacityPerMonth: 120,
  originalImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
  enhancedImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
  verificationTier: 'govt_verified',
  descriptions: CatalogService.generateMultilingualCatalog({}),
  priceBreakdown: PricingService.calculateExplainablePrice(200, 400, 50, 50, 30),
  qualityScore: {
    photo: 92,
    details: 95,
    description: 92,
    pricing: 88,
    overall: 92,
  },
  confidenceScores: {
    category: 0.98,
    material: 0.96,
    usage: 0.94,
    dimensions: 0.72,
  },
  status: 'draft',
  rfqsCount: 0,
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('landing');
  const [artisanView, setArtisanView] = useState<ArtisanView>('home');
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kalaihunar_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  const [rfqs, setRfqs] = useState<BuyerRFQ[]>(() => {
    try {
      const saved = localStorage.getItem('kalaihunar_rfqs');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_RFQS;
  });

  const [metrics, setMetrics] = useState<ClusterMetrics>(INITIAL_METRICS);
  const [productDraft, setProductDraft] = useState<Partial<Product>>(defaultDraft);

  // Network & Offline Sync State
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => {
    try {
      const saved = localStorage.getItem('kalaihunar_sync_queue');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(2);

  const [aiHealth] = useState<AIProviderHealth>({
    asr: 'healthy',
    vision: 'healthy',
    translation: 'healthy',
    matching: 'healthy',
    syncEngine: 'healthy',
  });

  // Persist products and RFQs locally
  useEffect(() => {
    try {
      localStorage.setItem('kalaihunar_products', JSON.stringify(products));
      localStorage.setItem('kalaihunar_rfqs', JSON.stringify(rfqs));
      localStorage.setItem('kalaihunar_sync_queue', JSON.stringify(syncQueue));
    } catch {
      // ignore
    }
  }, [products, rfqs, syncQueue]);

  const triggerSyncNow = useCallback(() => {
    if (!isOnline) {
      setSyncStatus('offline');
      return;
    }

    setSyncStatus('syncing');
    setTimeout(() => {
      // Process pending queue items
      setSyncQueue([]);
      setSyncStatus('synced');
      try {
        localStorage.removeItem('kalaihunar_sync_queue');
      } catch {
        // ignore
      }
    }, 1200);
  }, [isOnline]);

  const toggleNetwork = useCallback(() => {
    setIsOnline((prev) => {
      const next = !prev;
      if (!next) {
        setSyncStatus('offline');
      } else {
        setSyncStatus(syncQueue.length > 0 ? 'syncing' : 'synced');
        if (syncQueue.length > 0) {
          // Trigger auto-sync when network returns
          setTimeout(() => {
            triggerSyncNow();
          }, 600);
        }
      }
      return next;
    });
  }, [syncQueue, triggerSyncNow]);

  const clearNotifications = useCallback(() => {
    setUnreadNotificationsCount(0);
  }, []);

  const resetDemo = () => {
    setRole('landing');
    setArtisanView('home');
    setProducts(INITIAL_PRODUCTS);
    setRfqs(INITIAL_RFQS);
    setMetrics(INITIAL_METRICS);
    setProductDraft({ ...defaultDraft });
    setSyncQueue([]);
    setSyncStatus('synced');
    setIsOnline(true);
    setUnreadNotificationsCount(2);
    try {
      localStorage.removeItem('kalaihunar_products');
      localStorage.removeItem('kalaihunar_rfqs');
      localStorage.removeItem('kalaihunar_sync_queue');
    } catch {
      // ignore
    }
  };

  const loadRoleDemo = (targetRole: Role) => {
    setRole(targetRole);
    if (targetRole === 'artisan') {
      setArtisanView('home');
    }
  };

  const publishCurrentDraft = (): Product => {
    const isOfflineMode = !isOnline;
    const newProduct: Product = {
      ...(defaultDraft as Product),
      ...productDraft,
      id: `prod-${Date.now()}`,
      status: 'published',
      syncStatus: isOfflineMode ? 'offline' : 'synced',
      createdAt: new Date().toISOString().split('T')[0],
      rfqsCount: 0,
    };

    setProducts((prev) => [newProduct, ...prev]);

    if (isOfflineMode) {
      const queueItem: SyncQueueItem = {
        id: `sync-${Date.now()}`,
        entityType: 'product',
        operation: 'create',
        payload: newProduct,
        createdAt: new Date().toISOString(),
        retryCount: 0,
        status: 'pending',
      };
      setSyncQueue((prev) => [...prev, queueItem]);
      setSyncStatus('offline');
    } else {
      setMetrics((prev) => ({
        ...prev,
        productsDigitized: prev.productsDigitized + 1,
      }));
    }

    return newProduct;
  };

  const submitBuyerRFQ = (
    rfqData: Omit<BuyerRFQ, 'id' | 'createdAt' | 'status' | 'matchScore'>
  ): BuyerRFQ => {
    const newRfq: BuyerRFQ = {
      ...rfqData,
      id: `rfq-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      matchScore: 94,
      matchReasons: [
        '✓ Target unit price aligns with artisan wholesale minimum',
        '✓ Quantity fits artisan verified monthly production capacity',
        '✓ Delivery schedule is within feasible handcraft timelines',
      ],
    };

    setRfqs((prev) => [newRfq, ...prev]);

    // Update product rfq count
    setProducts((prev) =>
      prev.map((p) => (p.id === rfqData.productId ? { ...p, rfqsCount: p.rfqsCount + 1 } : p))
    );

    // Increment notification badge for artisan
    setUnreadNotificationsCount((prev) => prev + 1);

    // Update admin metrics
    setMetrics((prev) => ({
      ...prev,
      buyerInquiries: prev.buyerInquiries + 1,
      totalRfqs: prev.totalRfqs + 1,
    }));

    return newRfq;
  };

  const respondToRFQ = (
    rfqId: string,
    action: 'accept' | 'counter' | 'decline',
    counterData?: { price: number; notes: string; days: number }
  ) => {
    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id === rfqId) {
          if (action === 'accept') {
            return { ...r, status: 'accepted' };
          }
          if (action === 'decline') {
            return { ...r, status: 'declined' };
          }
          if (action === 'counter' && counterData) {
            return {
              ...r,
              status: 'quoted',
              counterUnitPrice: counterData.price,
              counterNotes: counterData.notes,
              counterDeliveryDays: counterData.days,
            };
          }
        }
        return r;
      })
    );
  };

  return (
    <DemoContext.Provider
      value={{
        role,
        setRole,
        artisanView,
        setArtisanView,
        products,
        setProducts,
        rfqs,
        metrics,
        productDraft,
        setProductDraft,
        isOnline,
        setIsOnline,
        toggleNetwork,
        syncStatus,
        syncQueue,
        triggerSyncNow,
        unreadNotificationsCount,
        clearNotifications,
        aiHealth,
        resetDemo,
        loadRoleDemo,
        publishCurrentDraft,
        submitBuyerRFQ,
        respondToRFQ,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
