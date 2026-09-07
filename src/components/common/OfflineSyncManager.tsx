import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export const OfflineSyncManager: React.FC = () => {
  const { isOnline, toggleNetwork, syncStatus, syncQueue, triggerSyncNow } = useDemo();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Pill Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full shadow-lg border text-xs font-bold transition-all ${
            !isOnline
              ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
              : syncStatus === 'syncing'
              ? 'bg-amber-500 text-amber-950 border-amber-400'
              : syncQueue.length > 0
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-emerald-800 text-emerald-100 border-emerald-700'
          }`}
        >
          {!isOnline ? (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Mode ({syncQueue.length} queued)</span>
            </>
          ) : syncStatus === 'syncing' ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Syncing...</span>
            </>
          ) : syncQueue.length > 0 ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{syncQueue.length} Drafts Pending</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-300" />
              <span>Online • Synced</span>
            </>
          )}
        </button>
      </div>

      {/* Expanded Sync Control Popover */}
      {isExpanded && (
        <div className="absolute bottom-12 right-0 w-80 bg-white rounded-2xl p-4 shadow-2xl border-2 border-amber-200 text-amber-950 space-y-3 animate-scale-up">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 m-0 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
              <span>Network & Offline Sync</span>
            </h4>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isOnline ? 'Network Connected' : 'Disconnected'}
            </span>
          </div>

          <p className="text-xs text-amber-800 leading-relaxed m-0">
            Simulate poor 2G/offline rural connectivity. Changes made offline are saved locally and automatically sync when connection returns.
          </p>

          {/* Network Simulator Toggle */}
          <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-200">
            <div className="text-xs">
              <span className="font-bold block">Simulate Internet</span>
              <span className="text-[11px] text-amber-700">
                {isOnline ? 'Online (Real-time sync)' : 'Offline (Local draft mode)'}
              </span>
            </div>
            <button
              onClick={toggleNetwork}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                isOnline
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>

          {/* Outbox Queue Status */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-amber-900">Pending Sync Outbox:</span>
              <span className="font-bold">{syncQueue.length} operations</span>
            </div>

            {syncQueue.length === 0 ? (
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>All product catalogs & RFQs are fully synchronized with server.</span>
              </div>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {syncQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 bg-amber-50/80 rounded-lg border border-amber-200 text-[11px] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold uppercase text-amber-950">{item.entityType}</span>
                      <span className="text-amber-700 block text-[10px]">
                        {item.payload?.descriptions?.en?.title || item.id}
                      </span>
                    </div>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              disabled={!isOnline || syncStatus === 'syncing' || syncQueue.length === 0}
              onClick={triggerSyncNow}
              className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync Outbox Now'}</span>
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
