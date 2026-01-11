import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { BusinessHealthResult, AppSettings, BenchmarkValues } from '@/types/business';
import {
  loadCurrentAnalysis,
  saveCurrentAnalysis,
  loadSettings,
  saveSettings,
  addToHistory,
} from './storage';
import { DEFAULT_BENCHMARKS } from './calculations';

/**
 * Business Context State
 */
interface BusinessContextState {
  // Aktuelle Analyse
  currentAnalysis: BusinessHealthResult | null;
  setCurrentAnalysis: (analysis: BusinessHealthResult | null) => void;
  
  // App-Einstellungen
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Benchmarks (aus Settings oder Default)
  benchmarks: BenchmarkValues;
  
  // Loading States
  isLoading: boolean;
  
  // Actions
  saveAnalysis: (analysis: BusinessHealthResult) => Promise<void>;
  clearAnalysis: () => void;
}

/**
 * Context erstellen
 */
const BusinessContext = createContext<BusinessContextState | undefined>(undefined);

/**
 * Provider Props
 */
interface BusinessProviderProps {
  children: ReactNode;
}

/**
 * Business Provider Component
 */
export function BusinessProvider({ children }: BusinessProviderProps) {
  const [currentAnalysis, setCurrentAnalysisState] = useState<BusinessHealthResult | null>(null);
  const [settings, setSettingsState] = useState<AppSettings>({
    currency: 'USD',
    language: 'de',
    theme: 'auto',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Lade Daten beim Start
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Lädt initiale Daten aus AsyncStorage
   */
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [analysis, loadedSettings] = await Promise.all([
        loadCurrentAnalysis(),
        loadSettings(),
      ]);
      
      if (analysis) {
        setCurrentAnalysisState(analysis);
      }
      
      setSettingsState(loadedSettings);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Setzt aktuelle Analyse
   */
  const setCurrentAnalysis = (analysis: BusinessHealthResult | null) => {
    setCurrentAnalysisState(analysis);
  };

  /**
   * Speichert Analyse (in Current + History)
   */
  const saveAnalysis = async (analysis: BusinessHealthResult) => {
    try {
      // Speichere als aktuelle Analyse
      await saveCurrentAnalysis(analysis);
      setCurrentAnalysisState(analysis);
      
      // Füge zur Historie hinzu
      await addToHistory(analysis);
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }
  };

  /**
   * Löscht aktuelle Analyse
   */
  const clearAnalysis = () => {
    setCurrentAnalysisState(null);
  };

  /**
   * Aktualisiert Einstellungen
   */
  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await saveSettings(updatedSettings);
      setSettingsState(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  /**
   * Berechne Benchmarks (Custom oder Default)
   */
  const benchmarks: BenchmarkValues = {
    database: {
      reactivationRate: settings.customBenchmarks?.database?.reactivationRate ?? DEFAULT_BENCHMARKS.database.reactivationRate,
    },
    reputation: {
      targetRating: settings.customBenchmarks?.reputation?.targetRating ?? DEFAULT_BENCHMARKS.reputation.targetRating,
      revenueIncreasePerStar: settings.customBenchmarks?.reputation?.revenueIncreasePerStar ?? DEFAULT_BENCHMARKS.reputation.revenueIncreasePerStar,
    },
    leadCapture: {
      conversionRate: settings.customBenchmarks?.leadCapture?.conversionRate ?? DEFAULT_BENCHMARKS.leadCapture.conversionRate,
    },
    omnichannel: {
      omnichannelConversionRate: settings.customBenchmarks?.omnichannel?.omnichannelConversionRate ?? DEFAULT_BENCHMARKS.omnichannel.omnichannelConversionRate,
      singleChannelConversionRate: settings.customBenchmarks?.omnichannel?.singleChannelConversionRate ?? DEFAULT_BENCHMARKS.omnichannel.singleChannelConversionRate,
    },
    website: {
      targetConversionRate: settings.customBenchmarks?.website?.targetConversionRate ?? DEFAULT_BENCHMARKS.website.targetConversionRate,
    },
  };

  const value: BusinessContextState = {
    currentAnalysis,
    setCurrentAnalysis,
    settings,
    updateSettings,
    benchmarks,
    isLoading,
    saveAnalysis,
    clearAnalysis,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

/**
 * Hook zum Zugriff auf Business Context
 */
export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
