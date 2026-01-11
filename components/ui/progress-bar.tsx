import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useColors } from '@/hooks/use-colors';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  animate?: boolean;
  color?: string;
}

/**
 * Horizontale Progress-Bar mit Farbcodierung
 */
export function ProgressBar({
  progress,
  height = 8,
  animate = true,
  color,
}: ProgressBarProps) {
  const colors = useColors();
  const animatedProgress = useSharedValue(0);

  // Farbe basierend auf Progress
  const getProgressColor = () => {
    if (color) return color;
    if (progress < 50) return colors.error;
    if (progress < 80) return colors.warning;
    return colors.success;
  };

  const progressColor = getProgressColor();

  useEffect(() => {
    if (animate) {
      animatedProgress.value = withTiming(progress, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animate]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value}%`,
    };
  });

  return (
    <View
      className="w-full rounded-full overflow-hidden"
      style={{ height, backgroundColor: colors.border }}
    >
      <Animated.View
        className="h-full rounded-full"
        style={[{ backgroundColor: progressColor }, animatedStyle]}
      />
    </View>
  );
}
