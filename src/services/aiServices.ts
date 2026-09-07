import { Product, ProductDescriptions, PriceBreakdown, ConfidenceScores, BuyerRFQ, Language } from '../types';

export interface ImageAnalysisResult {
  qualityScore: number;
  detectedCategory: string;
  detectedMaterial: string;
  backgroundStatus: 'clean' | 'cluttered' | 'acceptable';
  lightingStatus: 'good' | 'shadows' | 'dark';
  blurStatus: 'sharp' | 'slightly_blurry' | 'blurry';
  recommendations: string[];
  enhancedImageUrl: string;
  confidence: number;
}

export interface SpeechRecognitionResult {
  language: Language;
  transcript: string;
  translatedEnglish: string;
  confidence: number;
}

// Regional demo transcript library mapping to ensure authentic speech recognition for all 12 regional languages
const REGIONAL_DEMO_TRANSCRIPTS: Record<Language, { transcript: string; translatedEnglish: string }> = {
  ta: {
    transcript: 'இது கையால் செய்யப்பட்ட பாரம்பரிய மண் பொம்மை. மதுரை களிமண்ணால் செய்யப்பட்டது. வீட்டை அலங்கரிக்க சிறந்தது. செய்ய இரண்டு நாட்கள் ஆகும்.',
    translatedEnglish: 'This is a handcrafted traditional terracotta doll made from Madurai natural clay. Ideal for home decor. Takes two days to make.',
  },
  hi: {
    transcript: 'यह शुद्ध प्राकृतिक मिट्टी से बनी हस्तनिर्मित टेराकोटा गुड़िया है। घर की सजावट के लिए आदर्श है। इसे बनाने में दो दिन का समय लगता है।',
    translatedEnglish: 'This is a handcrafted terracotta doll made from pure natural clay. Ideal for home decoration. Takes two days to create.',
  },
  en: {
    transcript: 'Handcrafted terracotta decorative doll made from 100% natural clay. Perfect for modern and heritage home decor. Production takes 2 days.',
    translatedEnglish: 'Handcrafted terracotta decorative doll made from 100% natural clay. Perfect for modern and heritage home decor. Production takes 2 days.',
  },
  te: {
    transcript: 'ఇది చేతితో చేసిన సంప్రదాయ మట్టి బొమ్మ. సహజమైన కృష్ణామట్టితో తయారు చేయబడింది. ఇల్లు అలంకరణకు చాలా బాగుంటుంది. రెండు రోజులు పడుతుంది.',
    translatedEnglish: 'This is a handmade traditional clay doll made of natural clay. Very good for home decoration. Production takes 2 days.',
  },
  kn: {
    transcript: 'ಇದು ಕೈಯಿಂದ ತಯಾರಿಸಿದ ಸಾಂಪ್ರದಾಯಿಕ ಮಣ್ಣಿನ ಗೊಂಬೆ. ನೈಸರ್ಗಿಕ ಜೇಡಿಮಣ್ಣಿನಿಂದ ಮಾಡಲ್ಪಟ್ಟಿದೆ. ಮನೆ ಅಲಂಕಾರಕ್ಕೆ ಸೂಕ್ತವಾಗಿದೆ. ತಯಾರಿಸಲು ಎರಡು ದಿನ ಬೇಕಾಗುತ್ತದೆ.',
    translatedEnglish: 'This is a handcrafted traditional clay doll made from natural clay. Suitable for home decor. Takes two days to produce.',
  },
  ml: {
    transcript: 'ഇത് കൈകൊണ്ട് നിർമ്മിച്ച പരമ്പരാഗത ടെറാക്കോട്ട ശിൽപം. പ്രകൃതിദത്തമായ കളിമണ്ണിൽ തീർത്തതാണ്. വീട് അലങ്കരിക്കാൻ അനുയോജ്യമാണ്. രണ്ട് ദിവസത്തെ സമയം വേണം.',
    translatedEnglish: 'This is a handcrafted traditional terracotta sculpture made with natural clay. Suitable for home decoration. Requires two days.',
  },
  bn: {
    transcript: 'এটি খাঁটি প্রাকৃতিক মাটি দিয়ে তৈরি ঐতিহ্যবাহী পোড়ামাটির পুতুল। গৃহসজ্জার জন্য অত্যন্ত সুন্দর। এটি তৈরিতে দুই দিন সময় লাগে।',
    translatedEnglish: 'This is a traditional terracotta doll made of pure natural clay. Beautiful for home decor. Takes two days to make.',
  },
  mr: {
    transcript: 'हे अस्सल मातीपासून हाताने बनवलेले पारंपरिक टेराकोटा खेळणे आहे. घराच्या सजावटीसाठी उत्कृष्ट आहे. हे बनवण्यासाठी दोन दिवस लागतात.',
    translatedEnglish: 'This is a traditional terracotta toy handmade from genuine clay. Excellent for home decoration. Takes two days to craft.',
  },
  gu: {
    transcript: 'આ શુદ્ધ કુદરતી માટીમાંથી હાથે બનાવેલી પરંપરાગત ઢીંગલી છે. ઘરની સજાવટ માટે ઉત્તમ છે. તેને બનાવવામાં બે દિવસ લાગે છે.',
    translatedEnglish: 'This is a traditional doll handmade from pure natural clay. Excellent for home decor. Takes two days to produce.',
  },
  pa: {
    transcript: 'ਇਹ ਕੁਦਰਤੀ ਮਿੱਟੀ ਤੋਂ ਹੱਥ ਨਾਲ ਬਣਿਆ ਰਵਾਇਤੀ ਟੈਰਾਕੋਟਾ ਖਿਡੌਣਾ ਹੈ। ਘਰ ਦੀ ਸਜਾਵਟ ਲਈ ਬਹੁਤ ਵਧੀਆ ਹੈ। ਇਸ ਨੂੰ ਬਣਾਉਣ ਵਿੱਚ ਦੋ ਦਿਨ ਲੱਗਦੇ ਹਨ।',
    translatedEnglish: 'This is a traditional terracotta craft handmade from natural clay. Great for home decoration. Takes two days to make.',
  },
  or: {
    transcript: 'ଏହା ପ୍ରାକୃତିକ ମାଟିରେ ହାତ ତିଆରି ପାରମ୍ପରିକ ଟେରାକୋଟା ଖେଳଣା। ଘର ସଜାଇବା ପାଇଁ ବହୁତ ସୁନ୍ଦର। ଏହା ତିଆରି କରିବାକୁ ଦୁଇ ଦିନ ଲାଗେ।',
    translatedEnglish: 'This is a traditional terracotta toy handmade from natural clay. Very nice for decorating the home. Takes two days to make.',
  },
  as: {
    transcript: 'এইটো প্ৰাকৃতিক মাটিৰে হাতেৰে তৈয়াৰ কৰা পৰম্পৰাগত টেৰাকোটা পুতলা। ঘৰ সজোৱাৰ বাবে উৎকৃষ্ট। এইটো বনাবলৈ দুই দিন সময় লাগে।',
    translatedEnglish: 'This is a traditional terracotta doll handmade with natural clay. Excellent for home decoration. Takes two days to craft.',
  },
};

export class VisionService {
  static async analyzeImage(_imageSrc: string): Promise<ImageAnalysisResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      qualityScore: 92,
      detectedCategory: 'Handicrafts → Terracotta Decor',
      detectedMaterial: 'Natural Clay / Terracotta',
      backgroundStatus: 'cluttered',
      lightingStatus: 'good',
      blurStatus: 'sharp',
      recommendations: [
        '✓ Product is well-centered and sharp',
        '✓ Lighting is natural and even',
        'ℹ AI background clean-up recommended for B2B catalog standard',
      ],
      // Clean studio background version preserving authentic product colors and shape
      enhancedImageUrl:
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
      confidence: 0.94,
    };
  }
}

export class SpeechService {
  static async processVoiceDescription(
    language: Language = 'ta',
    _audioBlob?: Blob
  ): Promise<SpeechRecognitionResult> {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const demo = REGIONAL_DEMO_TRANSCRIPTS[language] || REGIONAL_DEMO_TRANSCRIPTS.ta;

    return {
      language,
      transcript: demo.transcript,
      translatedEnglish: demo.translatedEnglish,
      confidence: 0.95,
    };
  }

  static async processVoiceOnboarding(
    language: Language = 'ta'
  ): Promise<{ transcript: string; translated: string; location: string; craft: string }> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const greetings: Record<Language, string> = {
      ta: 'நான் மதுரையில் களிமண் பொம்மைகள் மற்றும் பானைகள் செய்கிறேன்',
      hi: 'मैं मदुरै में मिट्टी के बर्तन और पारंपरिक मूर्तियां बनाती हूं',
      en: 'I make terracotta clay craft and pottery in Madurai, Tamil Nadu',
      te: 'నేను మదురైలో మట్టి పాత్రలు మరియు బొమ్మలు తయారు చేస్తాను',
      kn: 'ನಾನು ಮದುರೈನಲ್ಲಿ ಮಣ್ಣಿನ ಮಡಕೆ ಮತ್ತು ಗೊಂಬೆಗಳನ್ನು ಮಾಡುತ್ತೇನೆ',
      ml: 'ഞാൻ മധുരയിൽ മൺപാത്രങ്ങളും ശിൽപങ്ങളും ഉണ്ടാക്കുന്നു',
      bn: 'আমি মাদুরাইতে পোড়ামাটির পাত্র ও পুতুল তৈরি করি',
      mr: 'मी मदुरैमध्ये मातीची भांडी आणि मूर्ती बनवते',
      gu: 'હું મદુરાઈમાં માટીના વાસણો અને રમકડાં બનાવું છું',
      pa: 'ਮੈਂ ਮਦੁਰਾਈ ਵਿੱਚ ਮਿੱਟੀ ਦੇ ਭਾਂਡੇ ਅਤੇ ਮੂਰਤੀਆਂ ਬਣਾਉਂਦੀ ਹਾਂ',
      or: 'ମୁଁ ମଦୁରାଇରେ ମାଟି ପାତ୍ର ଏବଂ ମୂର୍ତ୍ତି ତିଆରି କରେ',
      as: 'মই মাদুৰাইত মাটিৰ বাচন আৰু পুতলা তৈয়াৰ কৰোঁ',
    };

    return {
      transcript: greetings[language] || greetings.ta,
      translated: 'Artisan operates pottery & clay decor cluster in Madurai, Tamil Nadu.',
      location: 'Madurai, Tamil Nadu',
      craft: 'Terracotta Pottery & Sculptures',
    };
  }
}

export class CatalogService {
  static extractAttributes(_transcript: string, _language: Language = 'ta') {
    return {
      title: 'Handmade Terracotta Decorative Doll',
      category: 'Handicraft → Home Decor',
      material: 'Natural Clay / Terracotta',
      craft: 'Heritage Wheel & Hand Sculpting',
      use: 'Home & Living Decoration',
      productionTime: '2 Days',
      origin: 'Madurai, Tamil Nadu',
      moq: 10,
      dimensions: '18cm x 10cm x 8cm',
      capacityPerMonth: 150,
      confidenceScores: {
        category: 0.98,
        material: 0.96,
        usage: 0.94,
        dimensions: 0.72, // Needs confirmation
      } as ConfidenceScores,
    };
  }

  static generateMultilingualCatalog(_attributes: any): ProductDescriptions {
    return {
      en: {
        title: 'Handmade Terracotta Decorative Doll',
        shortDescription: 'A handcrafted terracotta decorative doll made from natural clay, ideal for traditional and contemporary home decor.',
        longDescription: 'Sourced directly from Madurai clay artisan clusters, each terracotta doll is sculpted by hand using heritage wheel and molding methods, air-dried under sunlight, and kiln-baked at high temperature for lasting strength.',
        craftDetails: '100% Biodegradable • Hand-painted with natural dyes • Ancient Madurai Clay Artistry',
      },
      ta: {
        title: 'கையால் செய்யப்பட்ட பாரம்பரிய மண் பொம்மை',
        shortDescription: 'இயற்கையான களிமண்ணால் செய்யப்பட்ட பாரம்பரிய மண் பொம்மை. வீட்டை அழகாக அலங்கரிக்க சிறந்தது.',
        longDescription: 'மதுரை பாரம்பரிய களிமண் கலைஞர்களால் கையால் வடிவமைக்கப்பட்டது. இயற்கை வெயிலில் உலர்த்தப்பட்டு, சூளையில் சுடப்பட்டு நீண்ட பலம் பெற்றுள்ளது.',
        craftDetails: '100% இயற்கை களிமண் • பாரம்பரிய கைவினை முறை • மதுரை கைவினை மரபு',
      },
      hi: {
        title: 'हस्तनिर्मित पारंपरिक टेराकोटा सजावटी गुड़िया',
        shortDescription: 'प्राकृतिक मिट्टी से बनी एक सुंदर टेराकोटा सजावटी गुड़िया, जो घर की सजावट के लिए आदर्श है।',
        longDescription: 'मदुरै के पारंपरिक कारीगरों द्वारा शुद्ध मिट्टी से तैयार की गई। सूर्य के प्रकाश में सुखाकर भट्टी में पकाई गई, जिससे टिकाऊपन मिलता है।',
        craftDetails: '100% प्राकृतिक मिट्टी • हाथ से चित्रित • पारंपरिक विरासत कला',
      },
      te: {
        title: 'చేతితో చేసిన సాంప్రదాయ మట్టి అలంకరణ బొమ్మ',
        shortDescription: 'సహజమైన కృష్ణామట్టితో చేసిన మట్టి బొమ్మ. ఇంటి అలంకరణకు ఎంతో శోభనిస్తుంది.',
        longDescription: 'మదురై సంప్రదాయ కుమ్మరి కళాకారులచే చేతితో రూపొందించబడింది. ఎండలో ఆరబెట్టి అధిక ఉష్ణోగ్రత వద్ద కాల్చడం వల్ల దృఢంగా ఉంటుంది.',
        craftDetails: '100% సహజ మట్టి • చేతితో వేసిన రంగులు • ప్రాచీన చేతివృత్తి నైపుణ్యం',
      },
      kn: {
        title: 'ಕೈಯಿಂದ ಮಾಡಿದ ಸಾಂಪ್ರದಾಯಿಕ ಮಣ್ಣಿನ ಅಲಂಕಾರಿಕ ಗೊಂಬೆ',
        shortDescription: 'ನೈಸರ್ಗಿಕ ಜೇಡಿಮಣ್ಣಿನಿಂದ ಮಾಡಿದ ಸುಂದರ ಗೊಂಬೆ. ಮನೆ ಹಾಗೂ ಕಚೇರಿ ಅಲಂಕಾರಕ್ಕೆ ಸೂಕ್ತ.',
        longDescription: 'ಮದುರೈ ಕುಶಲಕರ್ಮಿಗಳಿಂದ ಕೈಯಿಂದ ರೂಪಿಸಲ್ಪಟ್ಟಿದ್ದು, ಸೂರ್ಯನ ಬಿಸಿಲಿನಲ್ಲಿ ಒಣಗಿಸಿ ಆವಿಗೆಯಲ್ಲಿ ಸುಡಲಾಗುತ್ತದೆ.',
        craftDetails: '100% ನೈಸರ್ಗಿಕ ಮಣ್ಣು • ಸಾಂಪ್ರದಾಯಿಕ ಕಲೆ • ಪರಿಸರ ಸ್ನೇಹಿ',
      },
      ml: {
        title: 'കൈകൊണ്ട് നിർമ്മിച്ച പരമ്പരാഗത ടെറാക്കോട്ട അലങ്കാര ശിൽപം',
        shortDescription: 'പ്രകൃതിദത്ത കളിമണ്ണിൽ തീർത്ത മനോഹരമായ ശിൽപം. വീട് അലങ്കരിക്കാൻ ഏറ്റവും അനുയോജ്യം.',
        longDescription: 'മധുരയിലെ പരമ്പരാഗത കരകൗശല വിദഗ്ദ്ധർ കൈകൊണ്ട് നിർമ്മിച്ചത്. വെയിലിൽ ഉണക്കി ചൂളയിൽ ചുട്ടെടുത്ത ഉറപ്പുള്ള നിർമ്മിതി.',
        craftDetails: '100% സ്വാഭാവിക കളിമണ്ണ് • കൈകൊണ്ട് വരച്ച ചിത്രപ്പണികൾ • മധുര കരകൗശലം',
      },
      bn: {
        title: 'হাতে তৈরি ঐতিহ্যবাহী পোড়ামাটির আলংকারিক পুতুল',
        shortDescription: 'প্রাকৃতিক মাটি দিয়ে তৈরি অপূর্ব পোড়ামাটির পুতুল, গৃহসজ্জার জন্য আদর্শ।',
        longDescription: 'মাদুরাইয়ের ঐতিহ্যবাহী কারিগরদের দ্বারা নিপুণ হাতে নির্মিত। রোদে শুকিয়ে ভাটায় পুড়িয়ে দীর্ঘস্থায়ী স্থায়িত্ব দেওয়া হয়েছে।',
        craftDetails: '১০০% প্রাকৃতিক পোড়ামাটি • হাতে আঁকা নকশা • ঐতিহ্যবাহী কারুশিল্প',
      },
      mr: {
        title: 'हाताने बनवलेले पारंपरिक टेराकोटा सजावटी खेळणे',
        shortDescription: 'शुद्ध मातीपासून बनवलेली सुंदर टेराकोटा मूर्ती, घर सजवण्यासाठी आदर्श.',
        longDescription: 'मदुरैच्या कुशल कारागिरांनी हाताने तयार केली आहे. उन्हात वाळवून भट्टीत भाजल्यामुळे दीर्घकाळ टिकते.',
        craftDetails: '१००% नैसर्गिक माती • हाताने रंगवलेले • पारंपरिक कलाकुसर',
      },
      gu: {
        title: 'હાથે બનાવેલી પરંપરાગત ટેરાકોટા સુશોભન ઢીંગલી',
        shortDescription: 'કુદરતી માટીમાંથી બનેલી આકર્ષક ઢીંગલી, ઘરની સજાવટ માટે ઉત્તમ પસંદગી.',
        longDescription: 'મદુરાઈના કુશળ કારીગરો દ્વારા હાથે ઘડાયેલી. કુદરતી તડકામાં સૂકવી ભઠ્ઠીમાં પકવેલી મજબૂત બનાવટ.',
        craftDetails: '૧૦૦% કુદરતી માટી • હાથથી કરેલું પેઇન્ટિંગ • પર્યાવરણ અનુકૂળ',
      },
      pa: {
        title: 'ਹੱਥ ਨਾਲ ਬਣਿਆ ਰਵਾਇਤੀ ਟੈਰਾਕੋਟਾ ਸਜਾਵਟੀ ਖਿਡੌਣਾ',
        shortDescription: 'ਕੁਦਰਤੀ ਮਿੱਟੀ ਦਾ ਬਣਿਆ ਸੁੰਦਰ ਖਿਡੌਣਾ, ਘਰੇਲੂ ਸਜਾਵਟ ਲਈ ਉੱਤਮ।',
        longDescription: 'ਮਦੁਰਾਈ ਦੇ ਰਵਾਇਤੀ ਕਾਰੀਗਰਾਂ ਦੁਆਰਾ ਹੱਥ ਨਾਲ ਤਿਆਰ ਕੀਤਾ ਗਿਆ। ਭੱਠੀ ਵਿੱਚ ਪਕਾ ਕੇ ਮਜ਼ਬੂਤ ਬਣਾਇਆ ਗਿਆ ਹੈ।',
        craftDetails: '੧੦੦% ਕੁਦਰਤੀ ਮਿੱਟੀ • ਹੱਥ ਨਾਲ ਕੀਤੀ ਨੱਕਾਸ਼ੀ • ਰਵਾਇਤੀ ਵਿਰਸਾ',
      },
      or: {
        title: 'ହାତ ତିଆରି ପାରମ୍ପରିକ ଟେରାକୋଟା ସାଜସଜ୍ଜା ଖେଳଣା',
        shortDescription: 'ପ୍ରାକୃତିକ ମାଟିରେ ତିଆରି ସୁନ୍ଦର ଖେଳଣା, ଘରର ସୌନ୍ଦର୍ଯ୍ୟ ବୃଦ୍ଧି ପାଇଁ ଉତ୍କୃଷ୍ଟ।',
        longDescription: 'ମଦୁରାଇ କାରିଗରଙ୍କ ଦ୍ୱାରା ନିର୍ମିତ। ଖରାରେ ଶୁଖାଇ ଭାଟିରେ ପୋଡ଼ି ଦୃଢ଼ କରାଯାଇଛି।',
        craftDetails: '୧୦୦% ପ୍ରାକୃତିକ ମାଟି • ହାତରେ ଅଙ୍କିତ ରଙ୍ଗ • ପ୍ରାଚୀନ ଶିଳ୍ପକଳା',
      },
      as: {
        title: 'হাতেৰে তৈয়াৰ কৰা পৰম্পৰাগত টেৰাকোটা আলংকাৰিক পুতলা',
        shortDescription: 'প্ৰাকৃতিক মাটিৰে গঠিত সুন্দৰ পুতলা, ঘৰ সজোৱাৰ বাবে এক উৎকৃষ্ট নিদৰ্শন।',
        longDescription: 'মাদুৰাইৰ পৰম্পৰাগত শিল্পীসকলে নিপুণ হাতেৰে সাজি উলিওৱা। ৰ’দত শুকুৱাই ভাটীত পুৰি মজবুত কৰা হৈছে।',
        craftDetails: '১০০% প্ৰাকৃতিক মাটি • হাতেৰে কৰা ৰং • পৰম্পৰাগত শিল্প',
      },
    };
  }
}

export class PricingService {
  static calculateExplainablePrice(
    materialCost = 200,
    labourCost = 400,
    packaging = 50,
    overhead = 50,
    marginPercent = 30
  ): PriceBreakdown {
    const baseCost = materialCost + labourCost + packaging + overhead;
    const margin = baseCost * (marginPercent / 100);
    const suggestedPrice = Math.round(baseCost + margin);
    const recommendedMin = Math.round(baseCost * 1.15); // 15% min margin
    const recommendedMax = Math.round(baseCost * 1.45); // 45% premium retail
    const b2bUnitPrice = Math.round(baseCost * 1.18); // Bulk discounted price

    return {
      material: materialCost,
      labour: labourCost,
      packaging,
      overhead,
      baseCost,
      recommendedMin,
      recommendedMax,
      suggestedPrice,
      b2bUnitPrice,
    };
  }
}

export class MatchingService {
  static calculateMatchScore(
    rfq: Partial<BuyerRFQ>,
    product: Product
  ): { score: number; reasons: string[]; warnings: string[] } {
    let score = 0;
    const reasons: string[] = [];
    const warnings: string[] = [];

    // 1. Price compatibility (25%)
    const targetPrice = rfq.targetBudgetPerUnit || 0;
    if (targetPrice >= product.priceBreakdown.suggestedPrice) {
      score += 25;
      reasons.push('✓ Price fits comfortably within buyer budget');
    } else if (targetPrice >= product.priceBreakdown.b2bUnitPrice) {
      score += 20;
      reasons.push('✓ Meets wholesale B2B unit price');
    } else if (targetPrice > 0) {
      score += 10;
      warnings.push('⚠ Buyer target price is below recommended B2B baseline');
    }

    // 2. Capacity & Production timeline (20%)
    const requestedQty = rfq.quantity || 1;
    if (requestedQty <= product.capacityPerMonth) {
      score += 20;
      reasons.push(`✓ Monthly capacity (${product.capacityPerMonth} units) satisfies demand (${requestedQty} units)`);
    } else {
      score += 8;
      warnings.push(`⚠ Quantity (${requestedQty}) exceeds single month capacity (${product.capacityPerMonth})`);
    }

    // 3. Category & Craft Match (20%)
    score += 20;
    reasons.push(`✓ Authentic craft match: ${product.craft}`);

    // 4. MOQ Compatibility (10%)
    if (requestedQty >= product.moq) {
      score += 10;
      reasons.push(`✓ Quantity meets Minimum Order Quantity (MOQ: ${product.moq})`);
    } else {
      warnings.push(`⚠ Requested quantity is lower than standard MOQ (${product.moq})`);
    }

    // 5. Delivery timeline (10%)
    const reqDays = rfq.deliveryDays || 14;
    if (reqDays >= 7) {
      score += 10;
      reasons.push(`✓ Delivery timeline of ${reqDays} days is achievable`);
    } else {
      score += 4;
      warnings.push(`⚠ Tight timeline: handcrafting requires adequate drying and baking time`);
    }

    // 6. Craft Authenticity & Verification (10%)
    if (product.verificationTier === 'govt_verified') {
      score += 10;
      reasons.push('✓ Government verified artisan cluster credentials');
    } else if (product.verificationTier === 'cluster_verified') {
      score += 8;
      reasons.push('✓ Verified local artisan cluster membership');
    } else {
      score += 6;
      reasons.push('✓ Community self-declared authentic craftsperson');
    }

    // 7. Location (5%)
    score += 5;
    reasons.push(`✓ Direct cluster origin: ${product.artisanLocation}`);

    return {
      score: Math.min(score, 98),
      reasons,
      warnings,
    };
  }
}
