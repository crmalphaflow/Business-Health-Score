import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  label: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

/**
 * Checkbox-Gruppe für Multi-Select
 */
export function CheckboxGroup({
  label,
  options,
  selectedValues,
  onChange,
  error,
}: CheckboxGroupProps) {
  const colors = useColors();

  const handleToggle = (value: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    
    onChange(newValues);
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-foreground mb-3">
        {label}
      </Text>
      
      <View className="gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          
          return (
            <Pressable
              key={option.value}
              onPress={() => handleToggle(option.value)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View className="flex-row items-center gap-3 bg-surface rounded-xl px-4 py-3 border border-border">
                <View
                  className="w-6 h-6 rounded-md items-center justify-center"
                  style={{
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                    borderWidth: isSelected ? 0 : 1,
                    borderColor: colors.border,
                  }}
                >
                  {isSelected && (
                    <IconSymbol
                      name="checkmark"
                      size={16}
                      color={colors.background}
                    />
                  )}
                </View>
                
                <Text className="text-base text-foreground flex-1">
                  {option.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      
      {error && (
        <Text className="text-xs mt-2" style={{ color: colors.error }}>
          {error}
        </Text>
      )}
    </View>
  );
}
