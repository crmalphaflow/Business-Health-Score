import React, { useState } from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

/**
 * Styled TextInput mit Label und Validierung
 */
export function InputField({
  label,
  error,
  helperText,
  containerClassName,
  ...textInputProps
}: InputFieldProps) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : isFocused
    ? colors.primary
    : colors.border;

  return (
    <View className={cn('mb-4', containerClassName)}>
      <Text className="text-sm font-medium text-foreground mb-2">
        {label}
      </Text>
      
      <TextInput
        {...textInputProps}
        onFocus={(e) => {
          setIsFocused(true);
          textInputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          textInputProps.onBlur?.(e);
        }}
        className="bg-surface rounded-xl px-4 py-3 text-base text-foreground"
        style={{
          borderWidth: 1,
          borderColor,
        }}
        placeholderTextColor={colors.muted}
      />
      
      {error && (
        <Text className="text-xs mt-1" style={{ color: colors.error }}>
          {error}
        </Text>
      )}
      
      {helperText && !error && (
        <Text className="text-xs text-muted mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
}
