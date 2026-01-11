/**
 * Business Health Score App - Type Definitions
 */

/**
 * Eingabedaten vom User für die Analyse
 */
export interface BusinessInputData {
  // Säule 1: Datenbank
  totalCustomers: number;
  averageProjectValue: number;
  contactFrequencyPerYear: number;
  hasReactivationProcess: boolean; // Prozess zur Kundenreaktivierung vorhanden?

  // Säule 2: Reputation
  googleStarRating: number; // 1-5
  reviewResponseRate: number; // 0-100%
  sharesReviewsOnSocialMedia: boolean; // Positive Bewertungen auf Social Media geteilt?

  // Säule 3: Lead Capture
  dailyCalls: number;
  callAnswerRate: number; // 0-100%
  hasAfterHoursHandling: boolean; // Anrufbehandlung nach Feierabend/Wochenende?

  // Säule 4: Omnichannel
  availableChannels: Channel[];
  averageResponseTimeHours: number; // Durchschnittliche Antwortzeit in Stunden

  // Säule 5: Website
  monthlyWebsiteVisitors: number;
  conversionRate: number; // 0-100%
  isMobileOptimized: boolean; // Website für mobile Endgeräte optimiert?
  hasAutomatedFollowUp: boolean; // Automatisierte Follow-up-Sequenzen vorhanden?
  websiteLoadTime?: number; // optional, in Sekunden
}

/**
 * Verfügbare Kommunikationskanäle
 */
export type Channel = 'phone' | 'email' | 'live_chat' | 'social_media' | 'sms';

/**
 * Score für eine einzelne Säule
 */
export interface PillarScore {
  name: PillarName;
  score: number; // 0-100
  maxScore: number; // immer 100
  percentage: number; // score/maxScore * 100
  revenueImpact: number; // Umsatzverlust für diese Säule
  metrics: PillarMetrics;
  recommendations: string[];
}

/**
 * Namen der 5 Säulen
 */
export type PillarName = 'database' | 'reputation' | 'lead_capture' | 'omnichannel' | 'website';

/**
 * Metriken für jede Säule (für Detail-Ansicht)
 */
export type PillarMetrics = 
  | DatabaseMetrics 
  | ReputationMetrics 
  | LeadCaptureMetrics 
  | OmnichannelMetrics 
  | WebsiteMetrics;

export interface DatabaseMetrics {
  totalCustomers: number;
  contactFrequency: number;
  averageProjectValue: number;
  reactivationPotential: number;
}

export interface ReputationMetrics {
  currentRating: number;
  targetRating: number;
  responseRate: number;
  ratingGap: number;
}

export interface LeadCaptureMetrics {
  dailyCalls: number;
  answerRate: number;
  missedCallsPerDay: number;
  missedCallsPerYear: number;
}

export interface OmnichannelMetrics {
  availableChannels: Channel[];
  channelCount: number;
  currentConversionRate: number;
  targetConversionRate: number;
}

export interface WebsiteMetrics {
  monthlyVisitors: number;
  currentConversionRate: number;
  targetConversionRate: number;
  conversionGap: number;
}

/**
 * Gesamtergebnis der Analyse
 */
export interface BusinessHealthResult {
  // Gesamt-Score
  totalScore: number; // 0-500
  maxScore: number; // immer 500
  percentage: number; // totalScore/maxScore * 100
  status: ScoreStatus;

  // Revenue Impact
  annualRevenueLoss: number;
  dailyOpportunityCost: number;

  // Einzelne Säulen
  pillars: PillarScore[];

  // Eingabedaten (für Historie)
  inputData: BusinessInputData;

  // Metadaten
  timestamp: number; // Unix timestamp
  id: string; // UUID
}

/**
 * Status basierend auf Prozent-Score
 */
export type ScoreStatus = 'critical' | 'needs_improvement' | 'good' | 'excellent';

/**
 * Benchmark-Werte (anpassbar in Settings)
 */
export interface BenchmarkValues {
  database: {
    reactivationRate: number; // Standard: 0.25 (25%)
  };
  reputation: {
    targetRating: number; // Standard: 4.8
    revenueIncreasePerStar: number; // Standard: 0.07 (7%)
  };
  leadCapture: {
    conversionRate: number; // Standard: 0.35 (35%)
  };
  omnichannel: {
    omnichannelConversionRate: number; // Standard: 0.6314 (63.14%)
    singleChannelConversionRate: number; // Standard: 0.22 (22%)
  };
  website: {
    targetConversionRate: number; // Standard: 0.052 (5.2%)
  };
}

/**
 * App-Einstellungen
 */
export interface AppSettings {
  currency: Currency;
  language: Language;
  theme: ThemeMode;
  customBenchmarks?: Partial<BenchmarkValues>;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CHF';
export type Language = 'de' | 'en';
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Gespeicherte Historie
 */
export interface AnalysisHistory {
  analyses: BusinessHealthResult[];
}
