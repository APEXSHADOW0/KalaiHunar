import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, translations, TranslationDict } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof TranslationDict) => string;
  speakText: (text: string, customLang?: SupportedLanguage) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'kalaihunar_preferred_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (saved && translations[saved]) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'ta'; // Default to Tamil as in SIH specification
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: keyof TranslationDict): string => {
      const currentDict = translations[language] || translations.en;
      return currentDict[key] || translations.en[key] || String(key);
    },
    [language]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speakText = useCallback(
    (text: string, customLang?: SupportedLanguage) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      stopSpeaking();

      const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === (customLang || language));
      const bcp47 = langMeta?.bcp47 || 'en-IN';

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = bcp47;
      utterance.rate = 0.95; // Slightly slower for low-literacy clarity
      utterance.pitch = 1.0;

      // Try finding an appropriate regional voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(
        (v) => v.lang.toLowerCase().replace('_', '-') === bcp47.toLowerCase()
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [language, stopSpeaking]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        speakText,
        stopSpeaking,
        isSpeaking,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
