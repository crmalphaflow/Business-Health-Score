import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { ProgressBar } from './progress-bar';
import { useColors } from '@/hooks/use-colors';
import type { PillarScore } from '@/types/business';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface PillarCardProps {
  pillar: PillarScore;
  onPress?: () => void;
}

/**
 * Horizontale Card für Säulen-Übersicht
 */
export function PillarCard({ pillar, onPress }: PillarCardProps) {
  const colors = useColors();

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
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
  
  const getPillarIcon = (name: string): string => {
    const icons: Record<string, string> = {
      database: '📊',
      reputation: '⭐',
      lead_capture: '📞',
      omnichannel: '💬',
      website: '🌐',
    };
    return icons[name] || '📊';
  };
  
  const getPillarColor = (score: number): string => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.primary;
    if (score >= 40) return colors.warning;
    return colors.error;
  };
  
  const pillarColor = getPillarColor(pillar.score);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View 
        className="rounded-2xl p-5 border border-border overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          shadowColor: pillarColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        {/* Gradient Background Accent */}
        <View 
          className="absolute top-0 right-0 w-24 h-24 rounded-full"
          style={{
            backgroundColor: `${pillarColor}08`,
            transform: [{ translateX: 30 }, { translateY: -30 }],
          }}
        />
        
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3 flex-1">
            <View
              className="w-12 h-12 rounded-2xl items-center justify-center"
              style={{
                backgroundColor: `${pillarColor}15`,
                borderWidth: 1,
                borderColor: `${pillarColor}30`,
              }}
            >
              <Text className="text-2xl">{getPillarIcon(pillar.name)}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-foreground mb-1">
                {getPillarLabel(pillar.name)}
              </Text>
              <Text className="text-xs text-muted">
                {pillar.score} / {pillar.maxScore} Punkte
              </Text>
            </View>
          </View>
          
          <View 
            className="w-14 h-14 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: `${pillarColor}15`,
              borderWidth: 2,
              borderColor: `${pillarColor}40`,
            }}
          >
            <Text 
              className="text-xl font-bold"
              style={{ color: pillarColor }}
            >
              {pillar.score}
            </Text>
          </View>
        </View>
        
        <ProgressBar
          progress={pillar.percentage}
          height={8}
          color={pillarColor}
        />
      </View>
    </Pressable>
  );
}
