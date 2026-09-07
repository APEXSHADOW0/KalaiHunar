import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceWaveformProps {
  isRecording?: boolean;
  label?: string;
  sublabel?: string;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isRecording = false,
  label = 'Tap and speak',
  sublabel = 'Speak naturally in Tamil, Hindi or English',
  onStartRecording,
  onStopRecording
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        {/* Pulsing rings when recording */}
        {isRecording && (
          <>
            <div className="absolute -inset-4 rounded-full bg-amber-500/20 animate-ping" />
            <div className="absolute -inset-8 rounded-full bg-amber-500/10 animate-pulse" />
          </>
        )}

        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-xl ${
            isRecording
              ? 'bg-rose-600 text-white ring-8 ring-rose-100 scale-105'
              : 'bg-gradient-to-tr from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 hover:scale-105'
          }`}
          aria-label="Toggle voice recording"
        >
          <Mic className={`w-10 h-10 ${isRecording ? 'animate-bounce' : ''}`} />
        </button>
      </div>

      {/* Audio Wave Bars visualizer */}
      {isRecording ? (
        <div className="flex items-center justify-center gap-1.5 h-10 mb-3">
          <span className="w-1.5 bg-amber-600 rounded-full animate-wave-1"></span>
          <span className="w-1.5 bg-amber-600 rounded-full animate-wave-2"></span>
          <span className="w-1.5 bg-amber-600 rounded-full animate-wave-3"></span>
          <span className="w-1.5 bg-amber-600 rounded-full animate-wave-4"></span>
          <span className="w-1.5 bg-amber-600 rounded-full animate-wave-5"></span>
          <span className="w-1.5 bg-amber-600 rounded-full animate-wave-2"></span>
          <span className="w-1.5 bg-amber-600 rounded-full animate-wave-1"></span>
        </div>
      ) : (
        <p className="text-lg font-bold text-amber-950 mb-1">{label}</p>
      )}

      <p className="text-xs text-amber-800/80 font-medium max-w-xs">{sublabel}</p>
    </div>
  );
};
