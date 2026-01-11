import React from 'react';
import { View, Text } from 'react-native';
import { IconSymbol } from './icon-symbol';
import type { SymbolViewProps } from 'expo-symbols';
import { useColors } from '@/hooks/use-colors';

interface MetricCardProps {
  icon: SymbolViewProps['name'];
  label: string;
  value: string;
  subtitle?: string;
  iconColor?: string;
}

/**
 * Card-Komponente für einzelne Metriken (Icon, Wert, Label)
 */
export function MetricCard({ icon, label, value, subtitle, iconColor }: MetricCardProps) {
  const colors = useColors();

  return (
    <View 
      className="rounded-2xl p-5 border border-border overflow-hidden"
      style={{
        backgroundColor: colors.surface,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Gradient Background Accent */}
      <View 
        className="absolute top-0 right-0 w-32 h-32 rounded-full"
        style={{
          backgroundColor: `${iconColor || colors.primary}08`,
          transform: [{ translateX: 40 }, { translateY: -40 }],
        }}
      />
      
      <View className="flex-row items-center gap-3 mb-3">
        <View
          className="w-14 h-14 rounded-2xl items-center justify-center"
          style={{ 
            backgroundColor: iconColor ? `${iconColor}15` : `${colors.primary}15`,
            borderWidth: 1,
            borderColor: iconColor ? `${iconColor}30` : `${colors.primary}30`,
          }}
        >
          <IconSymbol
            name={icon}
            size={26}
            color={iconColor || colors.primary}
          />
        </View>
        <Text className="text-sm text-muted flex-1 font-medium">{label}</Text>
      </View>
      
      <Text 
        className="text-3xl font-bold mb-1"
        style={{ color: colors.foreground }}
      >
        {value}
      </Text>
      
      {subtitle && (
        <Text className="text-xs text-muted">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
