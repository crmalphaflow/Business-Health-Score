import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BusinessHealthResult, AppSettings, AnalysisHistory } from '@/types/business';
import { DEFAULT_BENCHMARKS } from './calculations';

/**
 * Storage Keys
 */
const STORAGE_KEYS = {
  CURRENT_ANALYSIS: '@business_health/current_analysis',
  ANALYSIS_HISTORY: '@business_health/history',
  APP_SETTINGS: '@business_health/settings',
} as const;

/**
 * Default Settings
 */
const DEFAULT_SETTINGS: AppSettings = {
  currency: 'USD',
  language: 'de',
  theme: 'auto',
  customBenchmarks: undefined,
};

/**
 * Speichert die aktuelle Analyse
 */
export async function saveCurrentAnalysis(result: BusinessHealthResult): Promise<void> {
  try {
    const json = JSON.stringify(result);
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_ANALYSIS, json);
  } catch (error) {
    console.error('Error saving current analysis:', error);
    throw new Error('Fehler beim Speichern der Analyse');
  }
}

/**
 * Lädt die aktuelle Analyse
 */
export async function loadCurrentAnalysis(): Promise<BusinessHealthResult | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_ANALYSIS);
    if (!json) return null;
    return JSON.parse(json) as BusinessHealthResult;
  } catch (error) {
    console.error('Error loading current analysis:', error);
    return null;
  }
}

/**
 * Fügt eine Analyse zur Historie hinzu
 */
export async function addToHistory(result: BusinessHealthResult): Promise<void> {
  try {
    const history = await loadHistory();
    
    // Füge neue Analyse am Anfang hinzu
    history.analyses.unshift(result);
    
    // Begrenze Historie auf 50 Einträge
    if (history.analyses.length > 50) {
      history.analyses = history.analyses.slice(0, 50);
    }
    
    const json = JSON.stringify(history);
    await AsyncStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, json);
  } catch (error) {
    console.error('Error adding to history:', error);
    throw new Error('Fehler beim Speichern der Historie');
  }
}

/**
 * Lädt die gesamte Historie
 */
export async function loadHistory(): Promise<AnalysisHistory> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY);
    if (!json) {
      return { analyses: [] };
    }
    return JSON.parse(json) as AnalysisHistory;
  } catch (error) {
    console.error('Error loading history:', error);
    return { analyses: [] };
  }
}

/**
 * Löscht einen Eintrag aus der Historie
 */
export async function deleteFromHistory(id: string): Promise<void> {
  try {
    const history = await loadHistory();
    history.analyses = history.analyses.filter((analysis) => analysis.id !== id);
    
    const json = JSON.stringify(history);
    await AsyncStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, json);
  } catch (error) {
    console.error('Error deleting from history:', error);
    throw new Error('Fehler beim Löschen des Eintrags');
  }
}

/**
 * Löscht die gesamte Historie
 */
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ANALYSIS_HISTORY);
  } catch (error) {
    console.error('Error clearing history:', error);
    throw new Error('Fehler beim Löschen der Historie');
  }
}

/**
 * Speichert App-Einstellungen
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    const json = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, json);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw new Error('Fehler beim Speichern der Einstellungen');
  }
}

/**
 * Lädt App-Einstellungen
 */
export async function loadSettings(): Promise<AppSettings> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    if (!json) {
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(json) as AppSettings;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Setzt Einstellungen auf Standard zurück
 */
export async function resetSettings(): Promise<void> {
  try {
    await saveSettings(DEFAULT_SETTINGS);
  } catch (error) {
    console.error('Error resetting settings:', error);
    throw new Error('Fehler beim Zurücksetzen der Einstellungen');
  }
}

/**
 * Exportiert alle Daten als JSON-String (für CSV-Export vorbereitet)
 */
export async function exportData(): Promise<string> {
  try {
    const currentAnalysis = await loadCurrentAnalysis();
    const history = await loadHistory();
    const settings = await loadSettings();
    
    const exportData = {
      currentAnalysis,
      history,
      settings,
      exportDate: new Date().toISOString(),
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Fehler beim Exportieren der Daten');
  }
}

/**
 * Löscht alle App-Daten
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CURRENT_ANALYSIS,
      STORAGE_KEYS.ANALYSIS_HISTORY,
      STORAGE_KEYS.APP_SETTINGS,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw new Error('Fehler beim Löschen aller Daten');
  }
}
