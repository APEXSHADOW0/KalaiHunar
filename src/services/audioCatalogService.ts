import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { Product } from '../types';

export interface CatalogAudioScript {
  language: SupportedLanguage;
  fullText: string;
  sentences: string[];
}

export class AudioCatalogService {
  private static activeUtterance: SpeechSynthesisUtterance | null = null;
  private static isPlaying = false;
  private static currentSentenceIdx = 0;
  private static sentencesList: string[] = [];
  private static activeCallback: ((idx: number) => void) | null = null;
  private static endCallback: (() => void) | null = null;
  private static audioCtx: AudioContext | null = null;
  private static isFallbackPlaying = false;

  /**
   * Generates authentic, fluent multi-sentence spoken narration for any product in any language.
   */
  static generateNarrationScript(
    product: Partial<Product>,
    language: SupportedLanguage = 'en'
  ): CatalogAudioScript {
    const desc = product.descriptions?.[language] || product.descriptions?.en;
    const title = desc?.title || 'Handcrafted Artisan Product';
    const shortDesc = desc?.shortDescription || '';
    const longDesc = desc?.longDescription || '';
    const origin = product.artisanLocation || product.origin || 'Madurai, Tamil Nadu';
    const material = product.material || 'Natural Craft Material';
    const craft = product.craft || 'Traditional Handcrafted Technique';
    const time = product.productionTime || '2 Days';
    const price = product.priceBreakdown?.suggestedPrice || 500;
    const b2b = product.priceBreakdown?.b2bUnitPrice || 420;
    const moq = product.moq || 10;

    let sentences: string[] = [];

    switch (language) {
      case 'ta':
        sentences = [
          `வணக்கம். இது ${origin} கைவினைஞர்களால் பாரம்பரிய முறையில் உருவாக்கப்பட்ட ${title}.`,
          `${material} கொண்டு ${craft} முறையில் நேர்த்தியாக வடிவமைக்கப்பட்டுள்ளது.`,
          `ஒவ்வொரு பொருளும் உருவாக ${time} நேரம் தேவைப்படும்.`,
          `நேரடி மொத்த விற்பனை விலை ஒரு பொருளுக்கு ரூபாய் ${b2b}. குறைந்தபட்ச ஆணை அளவு ${moq} எண்ணிக்கைகள். பரிந்துரைக்கப்பட்ட சில்லறை விலை ரூபாய் ${price}.`,
        ];
        break;

      case 'hi':
        sentences = [
          `नमस्ते। यह ${origin} के कुशल कारीगरों द्वारा हस्तनिर्मित ${title} है।`,
          `यह उत्पाद शुद्ध ${material} से ${craft} तकनीक द्वारा तैयार किया गया है।`,
          `इसे पूर्ण रूप से तैयार करने में ${time} का समय लगता है।`,
          `थोक बी-टू-बी दर प्रति इकाई ₹${b2b} है। न्यूनतम ऑर्डर मात्रा ${moq} पीस है। अनुशंसित खुदरा मूल्य ₹${price} है।`,
        ];
        break;

      case 'te':
        sentences = [
          `నమస్కారం. ఇది ${origin} చేతివృత్తి నిపుణులచే రూపొందించబడిన ${title}.`,
          `ఇది సహజమైన ${material}తో ${craft} పద్ధతిలో తయారుచేయబడింది.`,
          `దీని తయారీకి ${time} సమయం పడుతుంది.`,
          `హోల్‌సేల్ ధర ప్రతి యూనిట్‌కు ₹${b2b}. కనీస ఆర్డర్ పరిమాణం ${moq} ముక్కలు. రిటైల్ ధర ₹${price}.`,
        ];
        break;

      case 'kn':
        sentences = [
          `ನಮಸ್ಕಾರ. ಇದು ${origin} ಕುಶಲಕರ್ಮಿಗಳಿಂದ ರೂಪಿಸಲ್ಪಟ್ಟ ${title}.`,
          `ಇದು ನೈಸರ್ಗಿಕ ${material}ನಿಂದ ${craft} ವಿಧಾನದಲ್ಲಿ ತಯಾರಾಗಿದೆ.`,
          `ತಯಾರಿಸಲು ${time} ಸಮಯ ಬೇಕಾಗುತ್ತದೆ.`,
          `ಸಗಟು ದರ ₹${b2b}. ಕನಿಷ್ಠ ಆರ್ಡರ್ ${moq} ತುಣುಕುಗಳು. ಚಿಲ್ಲರೆ ಬೆಲೆ ₹${price}.`,
        ];
        break;

      case 'ml':
        sentences = [
          `നമസ്കാരം. ${origin} കരകൗശല വിദഗ്ദ്ധർ നിർമ്മിച്ച ${title}.`,
          `പ്രകൃതിദത്ത ${material}ൽ ${craft} രീതിയിലാണ് ഇത് ഒരുക്കിയിട്ടുള്ളത്.`,
          `നിർമ്മാണത്തിന് ${time} സമയമെടുക്കും.`,
          `ഹോൾസെയിൽ വില ₹${b2b}. മിനിമം ഓർഡർ ${moq} എണ്ണം. റീട്ടെയിൽ വില ₹${price}.`,
        ];
        break;

      case 'bn':
        sentences = [
          `নমস্কার। এটি ${origin} এর দক্ষ কারিগরদের দ্বারা নির্মিত ${title}।`,
          `এটি প্রাকৃতিক ${material} দিয়ে ঐতিহ্যবাহী ${craft} শৈলীতে তৈরি।`,
          `তৈরিতে ${time} সময় লাগে।`,
          `পাইকারি বি-টু-বি মূল্য প্রতি পিস ₹${b2b}। ন্যূনতম অর্ডার ${moq} পিস। খুচরা মূল্য ₹${price}।`,
        ];
        break;

      case 'mr':
        sentences = [
          `नमस्कार. हे ${origin} मधील कारागिरांनी हाताने तयार केलेले ${title} आहे.`,
          `हे शुद्ध ${material} पासून ${craft} कलेने बनवले आहे.`,
          `हे बनवण्यासाठी ${time} वेळ लागतो.`,
          `घाऊक दर प्रति नग ₹${b2b} आहे. किमान ऑर्डर ${moq} नग. किरकोळ किंमत ₹${price}.`,
        ];
        break;

      case 'gu':
        sentences = [
          `નમસ્તે. આ ${origin}ના કારીગરો દ્વારા હાથે ઘડાયેલ ${title} છે.`,
          `તે શુદ્ધ ${material}માંથી ${craft} પદ્ધતિથી બનાવેલ છે.`,
          `તેને બનાવવામાં ${time} સમય લાગે છે.`,
          `જથ્થાબંધ દર પ્રતિ નંગ ₹${b2b} છે. લઘુત્તમ ઓર્ડર ${moq} નંગ. છૂટક કિંમત ₹${price}.`,
        ];
        break;

      case 'pa':
        sentences = [
          `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ। ਇਹ ${origin} ਦੇ ਕਾਰੀਗਰਾਂ ਦੁਆਰਾ ਹੱਥ ਨਾਲ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ${title} ਹੈ।`,
          `ਇਹ ਕੁਦਰਤੀ ${material} ਤੋਂ ${craft} ਢੰਗ ਨਾਲ ਬਣਿਆ ਹੈ।`,
          `ਇਸ ਨੂੰ ਤਿਆਰ ਕਰਨ ਵਿੱਚ ${time} ਲੱਗਦੇ ਹਨ।`,
          `ਥੋਕ ਦਰ ₹${b2b} ਪ੍ਰਤੀ ਯੂਨਿਟ ਹੈ। ਘੱਟੋ-ਘੱਟ ਆਰਡਰ ${moq} ਪੀਸ ਹੈ। ਪ੍ਰਚੂਨ ਮੁੱਲ ₹${price}।`,
        ];
        break;

      case 'or':
        sentences = [
          `ନମସ୍କାର। ଏହା ${origin} ର କାରିଗରଙ୍କ ଦ୍ୱାରା ନିର୍ମିତ ${title}।`,
          `ଏହା ପ୍ରାକୃତିକ ${material} ରେ ${craft} ଶୈଳୀରେ ପ୍ରସ୍ତୁତ।`,
          `ତିଆରି ପାଇଁ ${time} ସମୟ ଆବଶ୍ୟକ।`,
          `ହୋଲସେଲ ମୂଲ୍ୟ ₹${b2b}। ସର୍ବନିମ୍ନ ଅର୍ଡର ${moq} ଖଣ୍ଡ। ଖୁଚୁରା ମୂଲ୍ୟ ₹${price}।`,
        ];
        break;

      case 'as':
        sentences = [
          `নমস্কাৰ। এইটো ${origin}ৰ শিল্পীসকলে হাতেৰে সজা ${title}।`,
          `প্ৰাকৃতিক ${material}ৰে ${craft} শৈলীত এইটো তৈয়াৰ কৰা হৈছে।`,
          `নিৰ্মাণৰ বাবে ${time} সময় লাগে।`,
          `পাইকাৰী মূল্য ₹${b2b}। সৰ্বনিম্ন অৰ্ডাৰ ${moq}টা। খুচুৰা মূল্য ₹${price}।`,
        ];
        break;

      default:
        sentences = [
          `Welcome. Sourced directly from verified artisan clusters in ${origin}, this is the ${title}.`,
          shortDesc || `Authentic handcrafted piece made of ${material} using ${craft}.`,
          longDesc ? longDesc.slice(0, 160) + '.' : `Production requires ${time} of handcrafting.`,
          `Wholesale B2B unit price is ₹${b2b} with minimum order quantity of ${moq} pieces. Suggested retail price is ₹${price}.`,
        ];
        break;
    }

    return {
      language,
      fullText: sentences.join(' '),
      sentences,
    };
  }

  /**
   * Starts playback of sentence sequence with real-time sentence tracking and speed control.
   */
  static playCatalogNarration(
    sentences: string[],
    language: SupportedLanguage,
    speed: number = 1.0,
    onSentenceChange: (idx: number) => void,
    onFinish: () => void
  ) {
    this.stop();
    if (!sentences || sentences.length === 0) {
      onFinish();
      return;
    }

    this.isPlaying = true;
    this.sentencesList = sentences;
    this.currentSentenceIdx = 0;
    this.activeCallback = onSentenceChange;
    this.endCallback = onFinish;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.playAcousticFallback(sentences, onSentenceChange, onFinish);
      return;
    }

    // Check if speechSynthesis has voices
    window.speechSynthesis.cancel();
    this.speakSentence(0, language, speed);
  }

  private static speakSentence(
    idx: number,
    language: SupportedLanguage,
    speed: number
  ) {
    if (!this.isPlaying || idx >= this.sentencesList.length) {
      this.isPlaying = false;
      this.activeCallback?.(-1);
      this.endCallback?.();
      return;
    }

    this.currentSentenceIdx = idx;
    this.activeCallback?.(idx);

    const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language);
    const bcp47 = langMeta?.bcp47 || 'en-IN';

    const text = this.sentencesList[idx];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = bcp47;
    utterance.rate = Math.max(0.6, Math.min(1.4, speed));
    utterance.pitch = 1.0;

    // Look for matching regional voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().replace('_', '-') === bcp47.toLowerCase() ||
        v.lang.toLowerCase().startsWith(language.toLowerCase())
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (this.isPlaying) {
        // Small pause between sentences for natural narration pacing
        setTimeout(() => {
          this.speakSentence(idx + 1, language, speed);
        }, 220);
      }
    };

    utterance.onerror = (_e) => {
      // If OS voice failed or unsupported locale, play fallback tone and step through
      if (idx === 0 && (!voices || voices.length === 0)) {
        this.playAcousticFallback(this.sentencesList, this.activeCallback!, this.endCallback!);
      } else {
        setTimeout(() => {
          this.speakSentence(idx + 1, language, speed);
        }, 300);
      }
    };

    this.activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * High-fidelity Web Audio API acoustic fallback synthesizer:
   * Generates warm harmonic melodic notes matching spoken sentence cadence so audio ALWAYS plays!
   */
  private static playAcousticFallback(
    sentences: string[],
    onSentenceChange: (idx: number) => void,
    onFinish: () => void
  ) {
    this.isFallbackPlaying = true;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        onFinish();
        return;
      }
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      let current = 0;
      const playNext = () => {
        if (!this.isFallbackPlaying || current >= sentences.length) {
          this.isFallbackPlaying = false;
          onSentenceChange(-1);
          onFinish();
          return;
        }

        onSentenceChange(current);
        this.playMelodicChime();

        current++;
        setTimeout(playNext, 2800);
      };

      playNext();
    } catch {
      onFinish();
    }
  }

  private static playMelodicChime() {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Pentatonic pleasant frequencies (C4, E4, G4, A4)
      const freqs = [261.63, 329.63, 392.0, 440.0];
      const f = freqs[Math.floor(Math.random() * freqs.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.exponentialRampToValueAtTime(f * 1.5, now + 0.3);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch {
      // AudioCtx disabled
    }
  }

  static stop() {
    this.isPlaying = false;
    this.isFallbackPlaying = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.activeCallback?.(-1);
  }

  static isCurrentlyPlaying(): boolean {
    return this.isPlaying || this.isFallbackPlaying;
  }
}
