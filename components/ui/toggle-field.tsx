import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  helperText?: string;
}

/**
 * Toggle-Switch für Ja/Nein-Fragen
 */
export function ToggleField({ label, value, onChange, helperText }: ToggleFieldProps) {
  const colors = useColors();

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChange(!value);
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-foreground mb-3">
        {label}
      </Text>
      
      <View className="flex-row gap-3">
        {/* Ja-Button */}
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onChange(true);
          }}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            flex: 1,
            backgroundColor: value ? colors.primary : colors.surface,
            borderWidth: 1,
            borderColor: value ? colors.primary : colors.border,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            alignItems: 'center',
          })}
        >
          <Text
            className="text-base font-semibold"
            style={{ color: value ? colors.background : colors.foreground }}
          >
            Ja
          </Text>
        </Pressable>

        {/* Nein-Button */}
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onChange(false);
          }}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            flex: 1,
            backgroundColor: !value ? colors.primary : colors.surface,
            borderWidth: 1,
            borderColor: !value ? colors.primary : colors.border,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            alignItems: 'center',
          })}
        >
          <Text
            className="text-base font-semibold"
            style={{ color: !value ? colors.background : colors.foreground }}
          >
            Nein
          </Text>
        </Pressable>
      </View>
      
      {helperText && (
        <Text className="text-xs text-muted mt-2">
          {helperText}
        </Text>
      )}
    </View>
  );
}
