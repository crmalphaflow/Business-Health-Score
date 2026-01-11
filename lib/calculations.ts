import type {
  BusinessInputData,
  BusinessHealthResult,
  PillarScore,
  BenchmarkValues,
  ScoreStatus,
  PillarName,
} from '@/types/business';

/**
 * Standard-Benchmark-Werte
 */
export const DEFAULT_BENCHMARKS: BenchmarkValues = {
  database: {
    reactivationRate: 0.25, // 25%
  },
  reputation: {
    targetRating: 4.8,
    revenueIncreasePerStar: 0.07, // 7%
  },
  leadCapture: {
    conversionRate: 0.35, // 35%
  },
  omnichannel: {
    omnichannelConversionRate: 0.6314, // 63.14%
    singleChannelConversionRate: 0.22, // 22%
  },
  website: {
    targetConversionRate: 0.052, // 5.2%
  },
};

/**
 * Hauptfunktion: Berechnet den gesamten Business Health Score
 */
export function calculateBusinessHealth(
  inputData: BusinessInputData,
  benchmarks: BenchmarkValues = DEFAULT_BENCHMARKS,
  currentAnnualRevenue?: number
): BusinessHealthResult {
  // Berechne Scores für alle 5 Säulen
  const databaseScore = calculateDatabaseScore(inputData, benchmarks);
  const reputationScore = calculateReputationScore(inputData, benchmarks, currentAnnualRevenue);
  const leadCaptureScore = calculateLeadCaptureScore(inputData, benchmarks);
  const omnichannelScore = calculateOmnichannelScore(inputData, benchmarks);
  const websiteScore = calculateWebsiteScore(inputData, benchmarks);

  const pillars: PillarScore[] = [
    databaseScore,
    reputationScore,
    leadCaptureScore,
    omnichannelScore,
    websiteScore,
  ];

  // Gesamt-Score (Summe aller Säulen)
  const totalScore = pillars.reduce((sum, pillar) => sum + pillar.score, 0);
  const maxScore = 500;
  const percentage = (totalScore / maxScore) * 100;

  // Status bestimmen
  const status = getScoreStatus(percentage);

  // Gesamt-Revenue-Loss (Summe aller Säulen)
  const annualRevenueLoss = pillars.reduce((sum, pillar) => sum + pillar.revenueImpact, 0);
  const dailyOpportunityCost = annualRevenueLoss / 365;

  return {
    totalScore: Math.round(totalScore),
    maxScore,
    percentage: Math.round(percentage * 10) / 10,
    status,
    annualRevenueLoss: Math.round(annualRevenueLoss),
    dailyOpportunityCost: Math.round(dailyOpportunityCost),
    pillars,
    inputData,
    timestamp: Date.now(),
    id: generateId(),
  };
}

/**
 * Säule 1: Datenbank
 * Score basiert auf Kontaktfrequenz und Segmentierung
 */
function calculateDatabaseScore(
  input: BusinessInputData,
  benchmarks: BenchmarkValues
): PillarScore {
  const { totalCustomers, averageProjectValue, contactFrequencyPerYear, hasReactivationProcess } = input;

  // Score-Logik: Je höher die Kontaktfrequenz, desto besser
  // 0 Kontakte = 0 Punkte, 1x jährlich = 52 Punkte, 12x jährlich = 100 Punkte
  let baseScore = 0;
  if (contactFrequencyPerYear === 0) {
    baseScore = 0;
  } else if (contactFrequencyPerYear < 12) {
    baseScore = 40 + (contactFrequencyPerYear / 12) * 60;
  } else {
    baseScore = 100;
  }
  
  // Qualitativer Faktor: Reaktivierungsprozess (+15 Punkte wenn vorhanden)
  const qualitativeBonus = hasReactivationProcess ? 15 : 0;
  let score = Math.min(baseScore + qualitativeBonus, 100);

  // Revenue Impact: Reaktivierungs-Potenzial
  const reactivationPotential = totalCustomers * benchmarks.database.reactivationRate;
  const revenueImpact = reactivationPotential * averageProjectValue;

  return {
    name: 'database',
    score: Math.round(score),
    maxScore: 100,
    percentage: Math.round(score),
    revenueImpact: Math.round(revenueImpact),
    metrics: {
      totalCustomers,
      contactFrequency: contactFrequencyPerYear,
      averageProjectValue,
      reactivationPotential: Math.round(reactivationPotential),
    },
    recommendations: getDatabaseRecommendations(score),
  };
}

/**
 * Säule 2: Reputation
 * Score basiert auf Sternen und Antwortrate
 */
function calculateReputationScore(
  input: BusinessInputData,
  benchmarks: BenchmarkValues,
  currentAnnualRevenue: number = 500000 // Fallback-Wert
): PillarScore {
  const { googleStarRating, reviewResponseRate, sharesReviewsOnSocialMedia } = input;
  const targetRating = benchmarks.reputation.targetRating;

  // Score-Logik: 
  // - 40% basiert auf Rating (1 Stern = 0 Punkte, 5 Sterne = 40 Punkte)
  // - 40% basiert auf Antwortrate (0% = 0 Punkte, 100% = 40 Punkte)
  // - 20% basiert auf Social Media Sharing (Ja = 20 Punkte, Nein = 0 Punkte)
  const ratingScore = ((googleStarRating - 1) / 4) * 40;
  const responseScore = (reviewResponseRate / 100) * 40;
  const socialMediaScore = sharesReviewsOnSocialMedia ? 20 : 0;
  const score = ratingScore + responseScore + socialMediaScore;

  // Revenue Impact: Reputations-Gewinn
  const ratingGap = Math.max(0, targetRating - googleStarRating);
  const revenueImpact = ratingGap * benchmarks.reputation.revenueIncreasePerStar * currentAnnualRevenue;

  return {
    name: 'reputation',
    score: Math.round(score),
    maxScore: 100,
    percentage: Math.round(score),
    revenueImpact: Math.round(revenueImpact),
    metrics: {
      currentRating: googleStarRating,
      targetRating,
      responseRate: reviewResponseRate,
      ratingGap,
    },
    recommendations: getReputationRecommendations(googleStarRating, reviewResponseRate),
  };
}

/**
 * Säule 3: Lead Capture
 * Score basiert auf Erreichbarkeit (Anrufannahmequote)
 */
function calculateLeadCaptureScore(
  input: BusinessInputData,
  benchmarks: BenchmarkValues
): PillarScore {
  const { dailyCalls, callAnswerRate, hasAfterHoursHandling, averageProjectValue } = input;

  // Score-Logik: Annahmequote als Basis (max 85 Punkte)
  // 0% = 0 Punkte, 100% = 85 Punkte
  const baseScore = (callAnswerRate / 100) * 85;
  
  // Qualitativer Faktor: After-Hours-Handling (+15 Punkte wenn vorhanden)
  const qualitativeBonus = hasAfterHoursHandling ? 15 : 0;
  const score = Math.min(baseScore + qualitativeBonus, 100);

  // Revenue Impact: Verpasste Anrufe
  const missedCallsPerDay = dailyCalls * (1 - callAnswerRate / 100);
  const missedCallsPerYear = missedCallsPerDay * 365;
  const revenueImpact = missedCallsPerYear * benchmarks.leadCapture.conversionRate * averageProjectValue;

  return {
    name: 'lead_capture',
    score: Math.round(score),
    maxScore: 100,
    percentage: Math.round(score),
    revenueImpact: Math.round(revenueImpact),
    metrics: {
      dailyCalls,
      answerRate: callAnswerRate,
      missedCallsPerDay: Math.round(missedCallsPerDay),
      missedCallsPerYear: Math.round(missedCallsPerYear),
    },
    recommendations: getLeadCaptureRecommendations(callAnswerRate),
  };
}

/**
 * Säule 4: Omnichannel
 * Score basiert auf verfügbaren Kanälen
 */
function calculateOmnichannelScore(
  input: BusinessInputData,
  benchmarks: BenchmarkValues
): PillarScore {
  const { availableChannels, averageResponseTimeHours, averageProjectValue, monthlyWebsiteVisitors } = input;
  const channelCount = availableChannels.length;

  // Score-Logik: Kanalanzahl als Basis (max 70 Punkte)
  // 1 Kanal = 14 Punkte, 5 Kanäle = 70 Punkte
  const channelScore = Math.min(channelCount * 14, 70);
  
  // Antwortzeit-Score (max 30 Punkte)
  // < 1 Stunde = 30 Punkte, 1-4 Stunden = 20 Punkte, 4-24 Stunden = 10 Punkte, > 24 Stunden = 0 Punkte
  let responseScore = 0;
  if (averageResponseTimeHours < 1) {
    responseScore = 30;
  } else if (averageResponseTimeHours <= 4) {
    responseScore = 20;
  } else if (averageResponseTimeHours <= 24) {
    responseScore = 10;
  }
  
  const score = Math.min(channelScore + responseScore, 100);

  // Revenue Impact: Omnichannel-Chance
  const monthlyLeads = monthlyWebsiteVisitors * 0.1; // Annahme: 10% der Besucher sind Leads
  const currentConversionRate = channelCount === 1 
    ? benchmarks.omnichannel.singleChannelConversionRate 
    : benchmarks.omnichannel.omnichannelConversionRate;
  const conversionGap = benchmarks.omnichannel.omnichannelConversionRate - currentConversionRate;
  const revenueImpact = monthlyLeads * 12 * conversionGap * averageProjectValue;

  return {
    name: 'omnichannel',
    score: Math.round(score),
    maxScore: 100,
    percentage: Math.round(score),
    revenueImpact: Math.max(0, Math.round(revenueImpact)),
    metrics: {
      availableChannels,
      channelCount,
      currentConversionRate,
      targetConversionRate: benchmarks.omnichannel.omnichannelConversionRate,
    },
    recommendations: getOmnichannelRecommendations(channelCount),
  };
}

/**
 * Säule 5: Website
 * Score basiert auf Konversion und Speed
 */
function calculateWebsiteScore(
  input: BusinessInputData,
  benchmarks: BenchmarkValues
): PillarScore {
  const { monthlyWebsiteVisitors, conversionRate, isMobileOptimized, hasAutomatedFollowUp, averageProjectValue } = input;
  const targetConversionRate = benchmarks.website.targetConversionRate * 100; // in %

  // Score-Logik: Konversionsrate als Basis (max 60 Punkte)
  // 0% = 0 Punkte, 5.2% (Benchmark) = 60 Punkte
  const conversionScore = Math.min((conversionRate / targetConversionRate) * 60, 60);
  
  // Qualitative Faktoren (je 20 Punkte)
  const mobileScore = isMobileOptimized ? 20 : 0;
  const followUpScore = hasAutomatedFollowUp ? 20 : 0;
  
  const score = Math.min(conversionScore + mobileScore + followUpScore, 100);

  // Revenue Impact: Website-Konversions-Lücke (KORRIGIERTE FORMEL)
  // Besucher × (5,2 % Benchmark-Rate - aktuelle Rate) × Verkaufswert
  const conversionGap = Math.max(0, targetConversionRate - conversionRate) / 100;
  const revenueImpact = monthlyWebsiteVisitors * conversionGap * averageProjectValue;

  return {
    name: 'website',
    score: Math.round(score),
    maxScore: 100,
    percentage: Math.round(score),
    revenueImpact: Math.round(revenueImpact),
    metrics: {
      monthlyVisitors: monthlyWebsiteVisitors,
      currentConversionRate: conversionRate,
      targetConversionRate: targetConversionRate,
      conversionGap: conversionGap * 100,
    },
    recommendations: getWebsiteRecommendations(conversionRate, targetConversionRate),
  };
}

/**
 * Bestimmt den Status basierend auf Prozent-Score
 */
function getScoreStatus(percentage: number): ScoreStatus {
  if (percentage < 50) return 'critical';
  if (percentage < 80) return 'needs_improvement';
  if (percentage < 90) return 'good';
  return 'excellent';
}

/**
 * Empfehlungen für Datenbank-Säule
 */
function getDatabaseRecommendations(score: number): string[] {
  const recommendations: string[] = [];
  
  if (score < 50) {
    recommendations.push('Implementieren Sie ein CRM-System zur systematischen Kundenpflege');
    recommendations.push('Erstellen Sie einen E-Mail-Newsletter für regelmäßigen Kontakt');
    recommendations.push('Segmentieren Sie Ihre Datenbank nach Kaufverhalten');
  } else if (score < 80) {
    recommendations.push('Erhöhen Sie die Kontaktfrequenz auf mindestens monatlich');
    recommendations.push('Personalisieren Sie Ihre Kommunikation basierend auf Kundensegmenten');
  } else {
    recommendations.push('Optimieren Sie Ihre Kampagnen durch A/B-Testing');
    recommendations.push('Nutzen Sie Predictive Analytics für proaktive Ansprache');
  }
  
  return recommendations;
}

/**
 * Empfehlungen für Reputation-Säule
 */
function getReputationRecommendations(rating: number, responseRate: number): string[] {
  const recommendations: string[] = [];
  
  if (rating < 4.0) {
    recommendations.push('Analysieren Sie negative Bewertungen und beheben Sie Hauptprobleme');
    recommendations.push('Implementieren Sie ein Qualitätssicherungssystem');
  }
  
  if (responseRate < 50) {
    recommendations.push('Richten Sie Benachrichtigungen für neue Bewertungen ein');
    recommendations.push('Antworten Sie innerhalb von 24 Stunden auf alle Bewertungen');
  }
  
  if (rating >= 4.0 && rating < 4.5) {
    recommendations.push('Bitten Sie zufriedene Kunden aktiv um Bewertungen');
    recommendations.push('Optimieren Sie den Bewertungsprozess (z.B. QR-Code, direkter Link)');
  }
  
  return recommendations;
}

/**
 * Empfehlungen für Lead Capture-Säule
 */
function getLeadCaptureRecommendations(answerRate: number): string[] {
  const recommendations: string[] = [];
  
  if (answerRate < 60) {
    recommendations.push('Implementieren Sie ein Call-Tracking-System');
    recommendations.push('Erwägen Sie einen Anrufbeantworter-Service');
    recommendations.push('Nutzen Sie automatische SMS-Rückrufe für verpasste Anrufe');
  } else if (answerRate < 85) {
    recommendations.push('Optimieren Sie Ihre Telefonzeiten basierend auf Anrufmustern');
    recommendations.push('Schulen Sie Ihr Team in effizienter Anrufbearbeitung');
  } else {
    recommendations.push('Analysieren Sie Anrufqualität und Conversion-Rate');
    recommendations.push('Implementieren Sie Call-Recording für Qualitätssicherung');
  }
  
  return recommendations;
}

/**
 * Empfehlungen für Omnichannel-Säule
 */
function getOmnichannelRecommendations(channelCount: number): string[] {
  const recommendations: string[] = [];
  
  if (channelCount < 3) {
    recommendations.push('Fügen Sie Live-Chat auf Ihrer Website hinzu');
    recommendations.push('Erweitern Sie Ihre Präsenz auf Social Media');
    recommendations.push('Implementieren Sie SMS-Benachrichtigungen');
  } else if (channelCount < 5) {
    recommendations.push('Integrieren Sie alle Kanäle in ein zentrales System');
    recommendations.push('Bieten Sie konsistente Erfahrung über alle Kanäle');
  } else {
    recommendations.push('Optimieren Sie die Kanalnutzung basierend auf Kundenpräferenzen');
    recommendations.push('Nutzen Sie KI für intelligentes Channel-Routing');
  }
  
  return recommendations;
}

/**
 * Empfehlungen für Website-Säule
 */
function getWebsiteRecommendations(currentRate: number, targetRate: number): string[] {
  const recommendations: string[] = [];
  
  if (currentRate < 2) {
    recommendations.push('Überarbeiten Sie Ihre Landing Pages komplett');
    recommendations.push('Vereinfachen Sie den Conversion-Prozess');
    recommendations.push('Fügen Sie klare Call-to-Actions hinzu');
  } else if (currentRate < targetRate) {
    recommendations.push('Führen Sie A/B-Tests für wichtige Elemente durch');
    recommendations.push('Optimieren Sie die Ladegeschwindigkeit');
    recommendations.push('Verbessern Sie die mobile Nutzererfahrung');
  } else {
    recommendations.push('Nutzen Sie Heatmaps zur weiteren Optimierung');
    recommendations.push('Implementieren Sie Personalisierung basierend auf Nutzerverhalten');
  }
  
  return recommendations;
}

/**
 * Generiert eine eindeutige ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formatiert Währungswerte
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formatiert Prozentwerte
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}
