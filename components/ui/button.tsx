import React from 'react';
import { Text, Pressable, ActivityIndicator, Platform } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

/**
 * Wiederverwendbare Button-Komponente
 */
export function Button({
  onPress,
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  const colors = useColors();

  const handlePress = () => {
    if (disabled || loading) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPress();
  };

  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => ({
        opacity: pressed && !isDisabled ? 0.9 : 1,
        transform: pressed && !isDisabled ? [{ scale: 0.97 }] : [{ scale: 1 }],
        backgroundColor: isPrimary ? colors.primary : 'transparent',
        borderWidth: isPrimary ? 0 : 1,
        borderColor: colors.primary,
      })}
      className={cn(
        'px-6 py-3 rounded-full items-center justify-center',
        isDisabled && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.background : colors.primary} />
      ) : (
        <Text
          className={cn(
            'text-base font-semibold',
            isPrimary ? 'text-background' : 'text-primary'
          )}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

/**
 * Primary Button (Shortcut)
 */
export function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="primary" />;
}

/**
 * Secondary Button (Shortcut)
 */
export function SecondaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="secondary" />;
}
