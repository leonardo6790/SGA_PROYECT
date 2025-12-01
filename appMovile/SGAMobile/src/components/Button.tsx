import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES } from '../utils/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Tamaño
    const sizeStyles: Record<string, ViewStyle> = {
      small: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md },
      medium: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg },
      large: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl },
    };

    // Variante
    const variantStyles: Record<string, ViewStyle> = {
      primary: { backgroundColor: COLORS.primary },
      secondary: { backgroundColor: COLORS.secondary },
      danger: { backgroundColor: COLORS.danger },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.5 }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<string, TextStyle> = {
      small: { fontSize: FONT_SIZES.sm },
      medium: { fontSize: FONT_SIZES.md },
      large: { fontSize: FONT_SIZES.lg },
    };

    const variantStyles: Record<string, TextStyle> = {
      primary: { color: COLORS.white },
      secondary: { color: COLORS.white },
      danger: { color: COLORS.white },
      outline: { color: COLORS.primary },
    };

    return {
      ...sizeStyles[size],
      ...variantStyles[variant],
      fontWeight: '600',
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? COLORS.primary : COLORS.white}
          size="small"
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
