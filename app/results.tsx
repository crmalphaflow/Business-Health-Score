import { ScrollView, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { ScoreCircle } from '@/components/ui/score-circle';
import { MetricCard } from '@/components/ui/metric-card';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { useBusiness } from '@/lib/business-context';
import { formatCurrency } from '@/lib/calculations';
import { router } from 'expo-router';

/**
 * Results Screen - Detaillierte Ergebnisanzeige
 */
export default function ResultsScreen() {
  const { currentAnalysis, settings } = useBusiness();

  if (!currentAnalysis) {
    router.replace('/');
    return null;
  }

  const handleNewAnalysis = () => {
    router.push('/input' as any);
  };

  const handleBackToHome = () => {
    router.replace('/');
  };

  const getPillarLabel = (name: string): string => {
    const labels: Record<string, string> = {
      database: 'Datenbank',
      reputation: 'Reputation',
      lead_capture: 'Lead Capture',
      omnichannel: 'Omnichannel',
      website: 'Website',
    };
    return labels[name] || name;
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      critical: 'Kritisch - Sofortiger Handlungsbedarf',
      needs_improvement: 'Optimierungsbedarf',
      good: 'Gut - Weiter so!',
      excellent: 'Exzellent - Benchmark erreicht',
    };
    return labels[status] || status;
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-2xl font-bold text-foreground">
              Ihre Ergebnisse
            </Text>
            <Text className="text-sm text-muted">
              {new Date(currentAnalysis.timestamp).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>

          {/* Score Circle */}
          <View className="items-center py-4">
            <ScoreCircle
              score={currentAnalysis.totalScore}
              maxScore={currentAnalysis.maxScore}
              status={currentAnalysis.status}
              size={220}
              strokeWidth={18}
            />
          </View>

          {/* Status Badge */}
          <View className="items-center">
            <View className="bg-surface px-4 py-2 rounded-full border border-border">
              <Text className="text-sm font-medium text-foreground">
                {getStatusLabel(currentAnalysis.status)}
              </Text>
            </View>
          </View>

          {/* Revenue Impact */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              Umsatz-Impact
            </Text>
            
            <MetricCard
              icon="dollarsign.circle.fill"
              label="Jährlicher Umsatzverlust"
              value={formatCurrency(currentAnalysis.annualRevenueLoss, settings.currency)}
              subtitle="Summe aller Optimierungspotenziale"
            />
            
            <MetricCard
              icon="clock.fill"
              label="Tägliche Opportunitätskosten"
              value={formatCurrency(currentAnalysis.dailyOpportunityCost, settings.currency)}
              subtitle={`${formatCurrency(currentAnalysis.annualRevenueLoss, settings.currency)} / 365 Tage`}
            />
          </View>

          {/* 5 Säulen Breakdown */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              5 Säulen im Detail
            </Text>
            
            {currentAnalysis.pillars.map((pillar) => (
              <ExpandableCard
                key={pillar.name}
                title={getPillarLabel(pillar.name)}
                subtitle={`${pillar.score} / ${pillar.maxScore} Punkte`}
              >
                <View className="gap-4">
                  {/* Progress Bar */}
                  <View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-sm text-muted">Score</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {pillar.percentage}%
                      </Text>
                    </View>
                    <ProgressBar progress={pillar.percentage} height={8} />
                  </View>

                  {/* Revenue Impact */}
                  <View className="bg-background rounded-xl p-4">
                    <Text className="text-xs text-muted mb-1">
                      Umsatzverlust für diese Säule
                    </Text>
                    <Text className="text-xl font-bold text-foreground">
                      {formatCurrency(pillar.revenueImpact, settings.currency)}
                    </Text>
                  </View>

                  {/* Empfehlungen */}
                  <View>
                    <Text className="text-sm font-semibold text-foreground mb-2">
                      Empfehlungen
                    </Text>
                    {pillar.recommendations.map((rec, idx) => (
                      <View key={idx} className="flex-row gap-2 mb-2">
                        <Text className="text-sm text-primary">•</Text>
                        <Text className="text-sm text-foreground flex-1">
                          {rec}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ExpandableCard>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Buttons */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <SecondaryButton onPress={handleBackToHome}>
              Zum Dashboard
            </SecondaryButton>
          </View>
          <View className="flex-1">
            <PrimaryButton onPress={handleNewAnalysis}>
              Neue Analyse
            </PrimaryButton>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
