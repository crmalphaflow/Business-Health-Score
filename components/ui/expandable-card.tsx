import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';

interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

/**
 * Card mit Expand/Collapse-Funktion
 */
export function ExpandableCard({
  title,
  subtitle,
  children,
  defaultExpanded = false,
}: ExpandableCardProps) {
  const colors = useColors();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const rotation = useSharedValue(defaultExpanded ? 180 : 0);

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const newExpanded = !isExpanded;
    rotation.value = withTiming(newExpanded ? 180 : 0, { duration: 300 });
    setIsExpanded(newExpanded);
  };

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
      <Pressable
        onPress={handleToggle}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-sm text-muted mt-1">
                {subtitle}
              </Text>
            )}
          </View>
          
          <Animated.View style={iconStyle}>
            <IconSymbol
              name="chevron.right"
              size={20}
              color={colors.muted}
            />
          </Animated.View>
        </View>
      </Pressable>
      
      {isExpanded && (
        <View className="px-4 pb-4 border-t border-border pt-4">
          {children}
        </View>
      )}
    </View>
  );
}
