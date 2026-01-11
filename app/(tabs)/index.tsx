import { ScrollView, Text, View, Pressable, Platform } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { ScoreCircle } from '@/components/ui/score-circle';
import { MetricCard } from '@/components/ui/metric-card';
import { PillarCard } from '@/components/ui/pillar-card';
import { PrimaryButton } from '@/components/ui/button';
import { useBusiness } from '@/lib/business-context';
import { formatCurrency } from '@/lib/calculations';
import { router } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

/**
 * Home Screen - Dashboard mit Business Health Score Übersicht
 */
export default function HomeScreen() {
  const { currentAnalysis, settings } = useBusiness();
  const colors = useColors();

  const handleNewAnalysis = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/input');
  };
  
  const handleViewResults = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/results' as any);
  };

  // Pillar-Details werden in Results Screen angezeigt (Expandable Cards)

  // Wenn keine Analyse vorhanden, zeige Empty State
  if (!currentAnalysis) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-8">
          <Animated.View 
            entering={FadeInUp.duration(600).springify()}
            className="items-center gap-4"
          >
            {/* Grafisches Element */}
            <View 
              className="w-32 h-32 rounded-full items-center justify-center mb-4"
              style={{ 
                backgroundColor: `${colors.primary}15`,
                borderWidth: 3,
                borderColor: `${colors.primary}30`,
              }}
            >
              <View 
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-4xl font-bold text-background">?</Text>
              </View>
            </View>
            
            <Text className="text-3xl font-bold text-foreground text-center">
              Business Health Score
            </Text>
            <Text className="text-base text-muted text-center max-w-sm leading-relaxed">
              Analysieren Sie die Effizienz Ihres Unternehmens in 5 Schlüsselbereichen und entdecken Sie versteckte Umsatzpotenziale.
            </Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.duration(600).delay(200).springify()}
            className="w-full max-w-sm"
          >
            <Pressable
              onPress={handleNewAnalysis}
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                backgroundColor: colors.primary,
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 24,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              })}
            >
              <Text className="text-center text-lg font-bold text-background">
                Erste Analyse starten
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScreenContainer>
    );
  }

  // Dashboard mit Analyse-Daten
  return (
    <ScreenContainer className="p-6">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Animated.View 
          entering={FadeInUp.duration(400)}
          className="gap-6"
        >
          {/* Header */}
          <Animated.View 
            entering={FadeInDown.duration(400).delay(100)}
            className="items-center gap-2"
          >
            <Text className="text-2xl font-bold text-foreground">
              Business Health Score
            </Text>
            <Text className="text-sm text-muted">
              Letzte Analyse: {new Date(currentAnalysis.timestamp).toLocaleDateString('de-DE')}
            </Text>
          </Animated.View>

          {/* Score Circle */}
          <Animated.View 
            entering={FadeInUp.duration(600).delay(200).springify()}
            className="items-center py-4"
          >
            <ScoreCircle
              score={currentAnalysis.totalScore}
              maxScore={currentAnalysis.maxScore}
              status={currentAnalysis.status}
              size={200}
            />
          </Animated.View>

          {/* Status Badge */}
          <View className="items-center">
            <View className="bg-surface px-4 py-2 rounded-full border border-border">
              <Text className="text-sm font-medium text-foreground">
                {getStatusLabel(currentAnalysis.status)}
              </Text>
            </View>
          </View>

          {/* Key Metrics */}
          <Animated.View 
            entering={FadeInDown.duration(400).delay(400)}
            className="gap-3"
          >
            <MetricCard
              icon="dollarsign.circle.fill"
              label="Jährlicher Umsatzverlust"
              value={formatCurrency(currentAnalysis.annualRevenueLoss, settings.currency)}
              subtitle="Potenzial durch Optimierung"
            />
            
            <MetricCard
              icon="clock.fill"
              value={formatCurrency(currentAnalysis.dailyOpportunityCost, settings.currency)}
              label="Tägliche Opportunitätskosten"
            />
          </Animated.View>
          
          {/* Säulen Übersicht */}
          <Animated.View 
            entering={FadeInUp.duration(400).delay(500)}
            className="gap-3"
          >
            <Text className="text-lg font-semibold text-foreground">
              5 Säulen im Detail
            </Text>
            
            {currentAnalysis.pillars.map((pillar, index) => (
              <Animated.View
                key={pillar.name}
                entering={FadeInDown.duration(300).delay(600 + index * 100)}
              >
                <PillarCard pillar={pillar} />
              </Animated.View>
            ))}
          </Animated.View>
          {/* Action Buttons */}
          <Animated.View 
            entering={FadeInDown.duration(400).delay(600)}
            className="gap-3 pt-4"
          >
            {/* Zum Dashboard Button */}
            <Pressable
              onPress={handleViewResults}
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                backgroundColor: colors.primary,
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 24,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              })}
            >
              <Text className="text-center text-base font-bold text-background">
                Detaillierte Ergebnisse anzeigen
              </Text>
            </Pressable>
            
            {/* Neue Analyse Button */}
            <Pressable
              onPress={handleNewAnalysis}
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                backgroundColor: colors.surface,
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderWidth: 2,
                borderColor: colors.border,
              })}
            >
              <Text 
                className="text-center text-base font-bold"
                style={{ color: colors.primary }}
              >
                Neue Analyse starten
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

/**
 * Helper: Status-Label
 */
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    critical: 'Kritisch - Sofortiger Handlungsbedarf',
    needs_improvement: 'Optimierungsbedarf',
    good: 'Gut - Weiter so!',
    excellent: 'Exzellent - Benchmark erreicht',
  };
  return labels[status] || status;
}
