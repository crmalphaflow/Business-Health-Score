import { ScrollView, Text, View, Pressable, Alert, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { loadHistory, deleteFromHistory, clearHistory } from '@/lib/storage';
import { formatCurrency } from '@/lib/calculations';
import { useBusiness } from '@/lib/business-context';
import type { BusinessHealthResult } from '@/types/business';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

/**
 * History Screen - Verlauf aller Analysen
 */
export default function HistoryScreen() {
  const colors = useColors();
  const { settings, setCurrentAnalysis } = useBusiness();
  const [analyses, setAnalyses] = useState<BusinessHealthResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      setLoading(true);
      const history = await loadHistory();
      setAnalyses(history.analyses);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisPress = (analysis: BusinessHealthResult) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Setze als aktuelle Analyse und navigiere zu Results
    setCurrentAnalysis(analysis);
    router.push('/results' as any);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Analyse löschen',
      'Möchten Sie diese Analyse wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFromHistory(id);
              await loadHistoryData();
            } catch (error) {
              Alert.alert('Fehler', 'Fehler beim Löschen der Analyse');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Gesamten Verlauf löschen',
      'Möchten Sie wirklich alle Analysen löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Alle löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearHistory();
              await loadHistoryData();
            } catch (error) {
              Alert.alert('Fehler', 'Fehler beim Löschen des Verlaufs');
            }
          },
        },
      ]
    );
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      critical: 'Kritisch',
      needs_improvement: 'Verbesserungsbedarf',
      good: 'Gut',
      excellent: 'Exzellent',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'critical':
        return colors.error;
      case 'needs_improvement':
        return colors.warning;
      case 'good':
        return colors.primary;
      case 'excellent':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-muted">Lade Verlauf...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (analyses.length === 0) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-2xl font-bold text-foreground">Verlauf</Text>
          <Text className="text-base text-muted text-center max-w-sm">
            Noch keine Analysen vorhanden. Starten Sie Ihre erste Analyse, um den Verlauf zu sehen.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">Verlauf</Text>
            {analyses.length > 0 && (
              <Pressable
                onPress={handleClearAll}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text className="text-sm font-medium" style={{ color: colors.error }}>
                  Alle löschen
                </Text>
              </Pressable>
            )}
          </View>

          {/* Analysen-Liste */}
          <View className="gap-3">
            {analyses.map((analysis) => (
              <Pressable
                key={analysis.id}
                onPress={() => handleAnalysisPress(analysis)}
                onLongPress={() => handleDelete(analysis.id)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-sm text-muted mb-1">
                        {new Date(analysis.timestamp).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Text>
                      <Text className="text-lg font-bold text-foreground">
                        {analysis.totalScore} / {analysis.maxScore} Punkte
                      </Text>
                    </View>
                    
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${getStatusColor(analysis.status)}20` }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: getStatusColor(analysis.status) }}
                      >
                        {getStatusLabel(analysis.status)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-xs text-muted mb-1">
                        Jährlicher Umsatzverlust
                      </Text>
                      <Text className="text-base font-semibold text-foreground">
                        {formatCurrency(analysis.annualRevenueLoss, settings.currency)}
                      </Text>
                    </View>
                    
                    <View className="flex-1 items-end">
                      <Text className="text-xs text-muted mb-1">
                        Pro Tag
                      </Text>
                      <Text className="text-base font-semibold text-foreground">
                        {formatCurrency(analysis.dailyOpportunityCost, settings.currency)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Hinweis */}
          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-xs text-muted text-center">
              Tippen Sie auf eine Analyse, um Details zu sehen. Halten Sie gedrückt, um zu löschen.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
