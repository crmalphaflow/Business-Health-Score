import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useColors } from '@/hooks/use-colors';
import type { ScoreStatus } from '@/types/business';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ScoreCircleProps {
  score: number;
  maxScore: number;
  size?: number;
  strokeWidth?: number;
  status?: ScoreStatus;
  animate?: boolean;
}

/**
 * Kreisförmiger Progress-Indikator für Score-Anzeige
 */
export function ScoreCircle({
  score,
  maxScore,
  size = 200,
  strokeWidth = 16,
  status = 'needs_improvement',
  animate = true,
}: ScoreCircleProps) {
  const colors = useColors();
  const progress = useSharedValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (score / maxScore) * 100;

  // Farbe basierend auf Status
  const getStatusColor = () => {
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

  const statusColor = getStatusColor();

  useEffect(() => {
    if (animate) {
      progress.value = withTiming(percentage / 100, {
        duration: 1500,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progress.value = percentage / 100;
    }
  }, [percentage, animate]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={statusColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {/* Center Text */}
      <View className="absolute items-center justify-center">
        <Text className="text-4xl font-bold text-foreground">
          {Math.round(score)}
        </Text>
        <Text className="text-sm text-muted">/ {maxScore}</Text>
        <Text className="text-lg font-semibold mt-1" style={{ color: statusColor }}>
          {Math.round(percentage)}%
        </Text>
      </View>
    </View>
  );
}
